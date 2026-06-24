import { track } from "@vercel/analytics";

/** Named events, one place. Keep names stable — dashboards depend on them. */
export const EVENTS = {
  ctaClickNav: "cta_click_nav",
  ctaSubmit: "cta_submit",
  scrollDepth: "scroll_depth",
} as const;

export { track };
