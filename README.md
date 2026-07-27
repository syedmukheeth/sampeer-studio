# SAMPeer — Storytelling & Growth Studio

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

- `app/layout.tsx` — Root layout, self-hosted fonts, Lenis provider, viewport & metadata.
- `app/page.tsx` — Main section assembly.
- `app/globals.css` — Global CSS variables, custom typography, design tokens.
- `lib/content.ts` — Centralized content structure for all copy, metrics, and project data.
- `lib/constants.ts` — Core brand constants, layout metrics, and z-index scales.
- `components/sections/*` — Page sections (Hero, About, Work, Automation Lab, Process, Build, Footer).
- `components/ui/*` — Reusable interactive UI primitives (CardSwap, TextType, LineSidebar, TiltCard, Magnetic).
- `app/api/contact/route.ts` — Resend-powered contact submission API with rate limiting and mailto fallback.

---

## 🌐 Deployment (Vercel)

This repository is deployed on **Vercel**:

1. Pushes to `main` automatically trigger production deployments.
2. Production URL: [sam-peer.vercel.app](https://sam-peer.vercel.app)
3. Environment variables (optional for Resend email service):
   - `RESEND_API_KEY`: API key for direct email delivery.
   - `CONTACT_TO`: Receiving email address.
