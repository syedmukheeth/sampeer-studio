/**
 * Contact endpoint for both CTAs (home + /automations).
 * Delivers via Resend when RESEND_API_KEY is set; without it the client is
 * told to fall back to a direct mailto so no lead is ever silently dropped.
 *
 * This is the only route on the site that accepts input, so it is the only
 * real attack surface, it is written accordingly: bounded body, bounded
 * memory, allow-listed fields, and a throttle keyed on an IP the caller
 * cannot choose.
 */

const TO = process.env.CONTACT_TO ?? "hello@sampeerstudio.com";
// resend.dev sender works before the real domain is verified in Resend
const FROM = process.env.CONTACT_FROM ?? "SAMPeer Studio <onboarding@resend.dev>";

/** Hard ceiling on the request body. The form sends well under 5 KB; anything
 *  larger is not a lead. Enforced before parsing so a multi-megabyte POST is
 *  never buffered or handed to JSON.parse. */
const MAX_BODY_BYTES = 16 * 1024;
const MAX_EMAIL_LEN = 254; // RFC 5321 max path length
const MAX_MESSAGE_LEN = 4000;

/** Where a submission came from. Allow-listed rather than echoed: this value
 *  lands in the subject line of a mail we read, and an open text field there
 *  is a free spoofing primitive for anyone who finds the endpoint. */
const SOURCES = new Set(["site", "home", "automations", "audit"]);

/** Naive per-IP throttle. Fine for a portfolio-scale endpoint on one region;
 *  swap for Upstash/KV if the site ever runs on multiple instances. */
const hits = new Map<string, { n: number; t: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;
/** Bound the table so a flood of distinct keys can't grow it without limit.
 *  Expired rows are swept first; if everything is still live we stop admitting
 *  new keys rather than grow, a full table fails closed, not open. */
const MAX_TRACKED_IPS = 10_000;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);

  if (h && now - h.t <= WINDOW_MS) {
    h.n += 1;
    return h.n > LIMIT;
  }

  if (!h && hits.size >= MAX_TRACKED_IPS) {
    for (const [k, v] of hits) {
      if (now - v.t > WINDOW_MS) hits.delete(k);
    }
    if (hits.size >= MAX_TRACKED_IPS) return true;
  }

  hits.set(ip, { n: 1, t: now });
  return false;
}

/**
 * The client IP, taken only from headers the edge sets itself.
 *
 * The obvious `x-forwarded-for.split(",")[0]` is the wrong end of the list:
 * XFF is append-only, so the leftmost entry is whatever the caller sent, and
 * reading it lets anyone mint a fresh identity per request and walk straight
 * past the throttle. Vercel's own `x-vercel-forwarded-for` / `x-real-ip` are
 * overwritten at the edge and cannot be forged; behind any other proxy the
 * rightmost XFF hop is the one our trusted front door appended.
 */
function clientIp(request: Request) {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel;

  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;

  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff.split(",");
    const last = hops[hops.length - 1]?.trim();
    if (last) return last;
  }
  return "local";
}

export async function POST(request: Request) {
  // Cross-origin form posts can't set this, so requiring it forces a preflight
  // the browser will refuse to send from another origin.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 415 });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  // Throttle before doing any work on the payload.
  if (limited(clientIp(request))) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // Re-check the real length: content-length is a claim, not a guarantee.
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: { email?: unknown; message?: unknown; company?: unknown; source?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // honeypot, bots fill every field; humans never see this one
  if (body.company) return Response.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_LEN) : "";
  const rawSource = typeof body.source === "string" ? body.source : "";
  const source = SOURCES.has(rawSource) ? rawSource : "site";

  // No whitespace either side of the @, so a validated address can never carry
  // the CR/LF that would let it break out of the reply-to field.
  if (email.length > MAX_EMAIL_LEN || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // not configured yet, tell the client to open mailto instead
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      // A hung upstream otherwise holds the function open for its full timeout.
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `New lead (${source}): ${email}`,
        text: `From: ${email}\nSource: ${source}\n\n${message || "(no message)"}`,
      }),
    });
  } catch {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  if (!res.ok) {
    // Deliberately opaque: the upstream body can echo our config back out.
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
