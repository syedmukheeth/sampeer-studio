import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 *
 * Deliberately the header-based (non-nonce) policy from the Next.js CSP guide,
 * not the proxy/nonce one: nonces require every page to render dynamically,
 * which would throw away the static prerender of all 15 routes. On a marketing
 * site with no auth, no cookies, and no user-generated content, that trade is
 * not worth it, the load time IS part of the pitch.
 *
 * So `'unsafe-inline'` stays on script-src (Next's own bootstrap is inline) and
 * on style-src (Tailwind + Motion write inline styles). Everything that does
 * not cost us rendering is locked down hard: no plugins, no <base> hijack, no
 * cross-origin form posts, no framing.
 *
 * `'unsafe-eval'` is dev-only, React uses eval there to rebuild server error
 * stacks in the browser. It never ships to production.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com",
  // Work cards embed the real client sites (LiveSiteFrame); those are
  // third-party https origins, sandboxed at the iframe.
  "frame-src https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Two years, subdomains included, preload-list eligible.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Redundant with frame-ancestors above, kept for pre-CSP3 browsers.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework (and therefore its patch level).
  poweredByHeader: false,

  images: {
    // No remotePatterns by design. Every image on the site ships from /public,
    // so /_next/image cannot be aimed at a third-party host, which keeps
    // attacker-supplied bytes away from the sharp/libvips decoders entirely.
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
