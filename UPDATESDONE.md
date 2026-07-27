# Updates done

Brand assets, contact-form focus, the client testimonial, navigation layout, and a codebase cleanup.

## Brand

- The logo is now the supplied brand artwork instead of the hand-drawn SVG `BrandMark`. Source PNGs shipped on a cream ground, so each was flood-filled to transparency from its corners and cropped to the ink: `public/logo-mark.png` (medallion), `public/logo-full.png` (horizontal lockup), `public/logo.png` + `app/icon.png` (512² square, used by the favicon and the schema `logo` field).
- `components/ui/Logo.tsx` renders those through `next/image`. `components/ui/BrandMark.tsx` and the root `SampeerStudio-Logo.png` are deleted.

## Contact form: the focus rectangle

Clicking either contact field stamped a rounded rectangle over the curved "lens" field.

Root cause was layer order, not specificity. Everything after `@import "tailwindcss"` in `app/globals.css` was written **unlayered**, and unlayered CSS beats every rule in `@layer utilities` regardless of specificity — so the page-wide `:focus-visible { outline: 2px solid }` overrode any `focus-visible:outline-none` on the control.

- that rule now lives in `@layer base`, so it still overrides preflight and still covers every control that asks for nothing, while a utility can opt out (`app/globals.css`)
- the wrapper's `focus-within:ring-2` is kept only under `forced-colors:`, where the decorative SVG stroke is dropped by the OS and something real has to stand in (`components/ui/CurvedInput.tsx`)
- autofill's opaque rectangle and the mobile tap-highlight rectangle are both suppressed on form controls (`app/globals.css`)

Focus now reads as the lens outline turning sage — the field keeps its shape.

## Client testimonial

- the testimonial used `client-asrg-1.webp`, a 1000×1000 square crop that cut the right-hand person out of frame. Replaced by `public/client-asrg.webp`, built from the client's original at 1600×1200 with all three people in frame; the square crop is deleted.
- the WORK gallery's `asrg-client*.webp` are different moments from the same visit and are **untouched** — the testimonial gets its own file rather than overwriting the handshake photo.
- the photo now sits in a left rail (`components/sections/Testimonials.tsx`): a bordered `figure` on paper with an accent strike and a caption, image at its own aspect ratio (`h-auto w-full`, capped at `20rem`) so it is never cropped and never enlarged.

## Navigation

- the mark keeps the left corner; navigation moved to the right edge, where the toggle and **Start** share one column — Start is part of the nav rather than a separate floating corner button.
- the toggle is a three-bar hamburger (was two), so it reads as a menu. Fixed a layout bug found doing it: the shared `bubble` class carried `grid place-items-center`, and `grid` beats a `flex` added at the call site, so the bars became stretched grid rows 20px apart instead of 5. `bubble` no longer sets a display; each caller picks its own.
- the open menu's links are spread across the wall instead of clustering in the centre. From `md` up each pill is absolutely placed at a hand-set point, sized to its label, with the points chosen to clear the fixed chrome in both top corners. Below `md` the centred column is unchanged.
- menu options now mirror the page in order — Approach, Work, Automations, Clients, Process, About (was four).
- **Bug:** the menu's scroll lock did not hold. `body { overflow: hidden }` alone cannot stop Lenis, which drives the page from its own rAF loop, so the page kept scrolling under the overlay. The Lenis instance is now stopped with the wall and restarted on close.

## Cleanup

- **Duplicate CTA sections merged.** `components/sections/CTA.tsx` and `components/automations/CTA.tsx` were byte-identical markup differing only in copy, section id and tracked event. Both replaced by `components/ui/CtaSection.tsx`, wired at all eight call sites (home, `/automations`, and the six work pages, which were each importing the home CTA).
- **Unused assets deleted:** `client-asrg-1.webp`, the five stock Next.js SVGs (`file`, `globe`, `next`, `vercel`, `window`), root `1st.HEIC`, `faisal.jpeg`, `SampeerStudio-Logo.png`.
- Every remaining image was validated (decodes, correct format) and hashed for duplicates — none. Components, `lib/content.ts` exports and dependencies swept for dead code — nothing unused left.

## Verification

`next build`, `tsc --noEmit` and `eslint` are clean. Layout claims were measured in a live browser (menu pill geometry checked for overlap and overflow at 1280×720 and 390×844; the served testimonial image confirmed as 4:3 WebP). Screenshots were not available in the authoring environment, so nothing here rests on a visual pass — worth an eye before merge.
