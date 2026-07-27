# SAMPeer, Storytelling & Growth Studio

> The growth layer your startup is missing. Modern, high-conversion storytelling website built with Next.js 16, GSAP, Motion, and Tailwind CSS.

🌐 **Live Demo:** [https://sam-peer.vercel.app](https://sam-peer.vercel.app)

---

## ⚡ Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS v4 & Vanilla CSS Design System
- **Animations:** GSAP (ScrollTrigger), Motion, Lenis Smooth Scroll
- **Typography:** Self-hosted Clash Display + Inter
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Local Development

```bash
# Clone the repository
git clone https://github.com/06Faisal/SAMPeer.git
cd SAMPeer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Architecture Overview

- `app/layout.tsx`, Root layout, self-hosted fonts, Lenis provider, viewport & metadata.
- `app/page.tsx`, Main section assembly.
- `app/globals.css`, Global CSS variables, custom typography, design tokens.
- `lib/content.ts`, Centralized content structure for all copy, metrics, and project data.
- `lib/constants.ts`, Core brand constants, layout metrics, and z-index scales.
- `components/sections/*`, Page sections (Hero, About, Work, Automation Lab, Process, Build, Footer).
- `components/ui/*`, Reusable interactive UI primitives (CardSwap, TextType, LineSidebar, TiltCard, Magnetic).
- `app/api/contact/route.ts`, Resend-powered contact submission API with rate limiting and mailto fallback.

- [ ] Real domain in `app/layout.tsx` (`metadataBase`), `app/robots.ts`, `app/sitemap.ts`.
- [ ] Real client names + outcomes + stats in `lib/content.ts` (`WORK`, `STATS`).
- [ ] Real work screenshots, drop files in `public/` and reference them by path. Keep it that way: `next.config.ts` intentionally sets **no** `remotePatterns`, so `/_next/image` can never be pointed at a third-party host (see [Security](#security)).
- [ ] Syed photo + real LinkedIn in `ABOUT`.
- [ ] Real email / Calendly endpoint in `CTA.action` and `FOOTER`.
- [ ] Verify hero verdict + problem copy read the way you want.

## Security

The site is static except for one endpoint, and it's built to stay that way.

- **Headers**, CSP, HSTS (2y, preload-eligible), `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and COOP are set for every route in `next.config.ts`. `poweredByHeader` is off, so responses don't advertise the framework version.
- **CSP**, header-based, not nonce-based. Nonces would force every page to render dynamically and cost the static prerender; on a site with no auth, no cookies and no user-generated content that trade isn't worth it. `object-src`, `base-uri`, `form-action` and `frame-ancestors` are locked down regardless.
- **Images**, no `remotePatterns` by design. Every asset is local, so attacker-supplied bytes never reach the sharp/libvips decoders.
- **`/api/contact`**, the only input surface. Bounded body (16 KB), bounded rate-limit table, allow-listed `source`, JSON-only content type (so a cross-origin form can't post to it), a 10s upstream timeout, and a throttle keyed on an edge-set IP rather than the caller-supplied `X-Forwarded-For`.

Check dependencies before every deploy:

```bash
npm audit --omit=dev
```

That's the tree that actually ships, and it should read **0 vulnerabilities**. The full `npm audit` also reports `brace-expansion`, which reaches the project only through ESLint's `minimatch@3`; it is lint-time only, never bundled, and the fixed release (5.0.8) is not API-compatible with `minimatch@3`. Revisit when `eslint-plugin-import` / `jsx-a11y` / `react` move off `minimatch@3`.

---

## 🌐 Deployment (Vercel)

This repository is deployed on **Vercel**:

1. Pushes to `main` automatically trigger production deployments.
2. Production URL: [sam-peer.vercel.app](https://sam-peer.vercel.app)
3. Environment variables (optional for Resend email service):
   - `RESEND_API_KEY`: API key for direct email delivery.
   - `CONTACT_TO`: Receiving email address.
