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

/** Brand tokens mirrored from globals.css for JS-driven motion/canvas use. */
export const BRAND = {
  base: "#0a0a0a",
  ink: "#f5f5f0",
  muted: "#8a8a85",
  accent: "#6c63ff",
} as const;

/** Standard reveal easing — matches the CSS cubic used across the page. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
