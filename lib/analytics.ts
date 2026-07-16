import { track } from "@vercel/analytics";

/** Named events, one place. Keep names stable — dashboards depend on them. */
export const EVENTS = {
  ctaClickNav: "cta_click_nav",
  ctaSubmit: "cta_submit",
  scrollDepth: "scroll_depth",
  workVisitSite: "work_visit_site",
  auditClickHero: "audit_click_hero",
  auditSubmit: "audit_submit",
  industrySelect: "industry_select",
} as const;

export { track };
