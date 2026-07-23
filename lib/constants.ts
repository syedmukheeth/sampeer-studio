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
 *  BRAND = the LIGHT body palette. STAGE = the dark `.stage` family used by
 *  any canvas/SVG that renders inside an automation showcase. Keep both in
 *  sync with the `@theme` and `.stage` blocks in globals.css. */
export const BRAND = {
  base: "#f7f6f2",
  elevated: "#ffffff",
  elevated2: "#eceae3",
  ink: "#1a1a18",
  muted: "#57574f",
  accent: "#6c63ff",
  accentText: "#4b41c7",
  accentDim: "#4f48c4",
  accentSoft: "rgba(108, 99, 255, 0.08)",
} as const;

/** The dark cinematic family for subtrees wrapped in `.stage`. */
export const STAGE = {
  base: "#0a0a0b",
  elevated: "#141416",
  elevated2: "#1a1a1c",
  ink: "#f5f5f0",
  muted: "#8a8a85",
  accent: "#6c63ff",
  accentText: "#a7a1ff",
  accentDim: "#4f48c4",
  accentSoft: "rgba(108, 99, 255, 0.08)",
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
