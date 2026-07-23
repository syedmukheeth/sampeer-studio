/**
 * Single source of truth for cross-cutting design constants.
 * Content/data lands here in Phase 1 — keep copy out of components.
 */

/** Systemic z-index scale. Never spray arbitrary z values in components. */
export const Z = {
  base: 0,
  raised: 10,
  nav: 40,
  overlay: 50,
  grain: 60,
} as const;

/** Brand tokens mirrored from globals.css for JS-driven motion/canvas use.
 *  BRAND = the DARK body palette. STAGE = the deeper near-black `.stage` family
 *  used by any canvas/SVG that renders inside an automation showcase. Keep both
 *  in sync with the `@theme` and `.stage` blocks in globals.css. */
export const BRAND = {
  base: "#0a0b0b",
  elevated: "#121514",
  elevated2: "#1a1e1c",
  ink: "#f2f5f3",
  muted: "#9aa5a0",
  accent: "#10b981",
  accentText: "#34d399",
  accentDim: "#059669",
  accentSoft: "rgba(16, 185, 129, 0.1)",
} as const;

/** The deeper, near-pure-black cinematic family for `.stage` subtrees. */
export const STAGE = {
  base: "#050605",
  elevated: "#0c0f0d",
  elevated2: "#12160f",
  ink: "#f4f7f5",
  muted: "#929c97",
  accent: "#10b981",
  accentText: "#5eead4",
  accentDim: "#059669",
  accentSoft: "rgba(16, 185, 129, 0.12)",
} as const;

/** Standard reveal easing — matches the CSS cubic used across the page. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * MOTION SYSTEM — one dialect for the whole page.
 * Every reveal, stagger, and transition pulls from here so the site moves
 * like one organism, not nine sections that each invented their own timing.
 * Storytelling spine: noise -> signal. Motion resolves, never just fades.
 */
export const EASE = {
  /** expo-out — the default "arrive and settle" curve */
  out: [0.16, 1, 0.3, 1] as const,
  /** smooth symmetric — for pinned scrub / camera-like moves */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** soft overshoot — for accents that "pop" once (the indigo strike) */
  pop: [0.34, 1.4, 0.64, 1] as const,
} as const;

export const DUR = {
  fast: 0.45,
  base: 0.7,
  slow: 1.0,
  hero: 0.85,
} as const;

/** Reveal cadence — shared so staggers read as one rhythm everywhere. */
export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  loose: 0.14,
} as const;

/** Default in-view trigger — reveal a touch before fully on screen. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/** The signature lift distance for fade-up reveals (px). One value, page-wide. */
export const RISE = 28;

/**
 * Scroll distance (px) allotted per node when a Flow diagram builds itself
 * under the scrollbar. N nodes => sticky region of roughly N * FLOW_STEP.
 */
export const FLOW_STEP = 140;
