/**
 * Contact endpoint for both CTAs (home + /automations).
 * Delivers via Resend when RESEND_API_KEY is set; without it the client is
 * told to fall back to a direct mailto so no lead is ever silently dropped.
 */

const TO = process.env.CONTACT_TO ?? "hello@sampeerstudio.com";
// resend.dev sender works before the real domain is verified in Resend
const FROM = process.env.CONTACT_FROM ?? "Sampeer Studio <onboarding@resend.dev>";

/** Naive per-IP throttle. Fine for a portfolio-scale endpoint on one region;
 *  swap for Upstash/KV if the site ever runs on multiple instances. */
const hits = new Map<string, { n: number; t: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > WINDOW_MS) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > LIMIT;
}

export async function POST(request: Request) {
  let body: { email?: string; message?: string; company?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim().slice(0, 4000);
  const source = (body.source ?? "site").slice(0, 40);

  // honeypot — bots fill every field; humans never see this one
  if (body.company) return Response.json({ ok: true });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // not configured yet — tell the client to open mailto instead
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `New lead (${source}): ${email}`,
      text: `From: ${email}\nSource: ${source}\n\n${message || "(no message)"}`,
    }),
  });

  if (!res.ok) {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
