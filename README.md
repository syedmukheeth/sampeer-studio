# SAMPeer Studio

The growth layer your startup is missing. One-page storytelling site.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Motion · GSAP ScrollTrigger · Lenis · self-hosted Clash Display + Inter.

## Local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Architecture

- `app/layout.tsx` — fonts, Lenis provider, metadata, viewport.
- `app/page.tsx` — section assembly only.
- `app/globals.css` — design tokens (dark lock), reduced-motion collapse.
- `lib/content.ts` — **all copy + data** (edit content here, not in components).
- `lib/constants.ts` — z-index scale, brand tokens, easing.
- `components/sections/*` — the 8 sections + nav + footer.
- `components/ui/*` — motion primitives (Magnetic, TiltCard, CountUp, Reveal).
- `app/opengraph-image.tsx` · `app/icon.tsx` · `app/robots.ts` · `app/sitemap.ts` · `app/manifest.ts` — generated metadata assets.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the repo at vercel.com/new. Framework auto-detects Next.js. No build config needed.
3. Add the custom domain in Vercel → Settings → Domains. SSL is automatic.
4. Redeploy after the content swaps below.

## Before public launch — swap placeholders

All marked `// TODO` or `// mock`:

- [ ] Real domain in `app/layout.tsx` (`metadataBase`), `app/robots.ts`, `app/sitemap.ts`.
- [ ] Real client names + outcomes + stats in `lib/content.ts` (`WORK`, `STATS`).
- [ ] Real work screenshots — drop files in `public/` and reference them by path. Keep it that way: `next.config.ts` intentionally sets **no** `remotePatterns`, so `/_next/image` can never be pointed at a third-party host (see [Security](#security)).
- [ ] Syed photo + real LinkedIn in `ABOUT`.
- [ ] Real email / Calendly endpoint in `CTA.action` and `FOOTER`.
- [ ] Verify hero verdict + problem copy read the way you want.

## Security

The site is static except for one endpoint, and it's built to stay that way.

- **Headers** — CSP, HSTS (2y, preload-eligible), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and COOP are set for every route in `next.config.ts`. `poweredByHeader` is off, so responses don't advertise the framework version.
- **CSP** — header-based, not nonce-based. Nonces would force every page to render dynamically and cost the static prerender; on a site with no auth, no cookies and no user-generated content that trade isn't worth it. `object-src`, `base-uri`, `form-action` and `frame-ancestors` are locked down regardless.
- **Images** — no `remotePatterns` by design. Every asset is local, so attacker-supplied bytes never reach the sharp/libvips decoders.
- **`/api/contact`** — the only input surface. Bounded body (16 KB), bounded rate-limit table, allow-listed `source`, JSON-only content type (so a cross-origin form can't post to it), a 10s upstream timeout, and a throttle keyed on an edge-set IP rather than the caller-supplied `X-Forwarded-For`.

Check dependencies before every deploy:

```bash
npm audit --omit=dev
```

That's the tree that actually ships, and it should read **0 vulnerabilities**. The full `npm audit` also reports `brace-expansion`, which reaches the project only through ESLint's `minimatch@3`; it is lint-time only, never bundled, and the fixed release (5.0.8) is not API-compatible with `minimatch@3`. Revisit when `eslint-plugin-import` / `jsx-a11y` / `react` move off `minimatch@3`.

## Go-live checklist

- [ ] Responsive: 375 / 768 / 1024 / 1440.
- [ ] Motion QA: sticky-stack + horizontal-pan smooth, no cut-off pins.
- [ ] Reduced-motion: OS toggle → clean static fallback.
- [ ] Lighthouse: `npx lighthouse <url> --view` (LCP<2.5s, INP<200ms, CLS<0.1).
- [ ] CTA delivers a real message end to end.
- [ ] OG card renders in a link-preview test (e.g. paste link in a DM).
- [ ] Real device: one iOS, one Android.
