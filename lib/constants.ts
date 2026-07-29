/**
 * Single source of truth for cross-cutting design constants.
 * Content/data belongs in lib/content.ts; keep copy out of components.
 */

/** Public production URL in use today. Swap this when the custom domain is live. */
export const SITE_URL = "https://sampeer-studio.vercel.app";

/**
 * Systemic z-index scale. Never spray arbitrary z values in components.
 *
 * The nav is the last layer on the page, nothing persistent paints over it.
 * `overlay` is the one thing above it, and only because the mobile sheet IS
 * the nav in its expanded state.
 */
export const Z = {
  base: 0,
  raised: 10,
  spine: 30,
  grain: 35,
  nav: 40,
  overlay: 50,
} as const;

/* BRAND and STAGE palette mirrors used to live here. They duplicated every
   colour from globals.css as hex strings and told the reader to keep the two in
   sync by hand, but nothing ever imported them, so the copy just drifted. The
   `@theme` and `.stage` blocks in app/globals.css are the only source of truth;
   the handful of places that genuinely cannot read a CSS var (the NoiseField
   shader, the ShapeGrid canvas, the satori OG card, the PWA manifest) hold
   their own literal and say so in a comment. */

/** Standard reveal easing, matches the CSS cubic used across the page. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * MOTION SYSTEM, one dialect for the whole page.
 * Every reveal, stagger, and transition pulls from here so the site moves
 * like one organism, not nine sections that each invented their own timing.
 * Storytelling spine: noise -> signal. Motion resolves, never just fades.
 */
export const EASE = {
  /** expo-out, the default "arrive and settle" curve */
  out: [0.16, 1, 0.3, 1] as const,
  /** smooth symmetric, for pinned scrub / camera-like moves */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** soft overshoot, for accents that "pop" once (the violet strike) */
  pop: [0.34, 1.4, 0.64, 1] as const,
} as const;

export const DUR = {
  fast: 0.45,
  base: 0.7,
  slow: 1.0,
  hero: 0.85,
} as const;

/** Reveal cadence, shared so staggers read as one rhythm everywhere. */
export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  loose: 0.14,
} as const;

/** Default in-view trigger, reveal a touch before fully on screen. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/** The signature lift distance for fade-up reveals (px). One value, page-wide. */
export const RISE = 28;

/**
 * Scroll distance (px) allotted per node when a Flow diagram builds itself
 * under the scrollbar. N nodes => sticky region of roughly N * FLOW_STEP.
 */
export const FLOW_STEP = 140;
