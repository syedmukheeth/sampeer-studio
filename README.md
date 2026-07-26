# Sampeer Studio

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

## Before Public Launch

Code placeholders have been cleared. Remaining launch checks are owner/content tasks:

- [ ] Custom domain: update `SITE_URL` in `lib/constants.ts` after the domain is live.
- [ ] Confirm client names, industries, descriptions, stats, and permissions in `lib/content.ts`.
- [x] Work screenshots are local files in `public/work/`.
- [x] Syed photo and LinkedIn are wired in `ABOUT`.
- [x] Public email and contact form fallback are wired; add Vercel env vars before production lead capture.
- [ ] Verify hero verdict + problem copy read the way you want.

## Go-live checklist

- [ ] Responsive: 375 / 768 / 1024 / 1440.
- [ ] Motion QA: sticky-stack + horizontal-pan smooth, no cut-off pins.
- [ ] Reduced-motion: OS toggle → clean static fallback.
- [ ] Lighthouse: `npx lighthouse <url> --view` (LCP<2.5s, INP<200ms, CLS<0.1).
- [ ] CTA delivers a real message end to end.
- [ ] OG card renders in a link-preview test (e.g. paste link in a DM).
- [ ] Real device: one iOS, one Android.
