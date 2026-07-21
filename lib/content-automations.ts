/**
 * SINGLE SOURCE OF CONTENT for /automations (the Growth Automation Lab).
 * Components read from here — no copy hardcoded in JSX, same rule as
 * lib/content.ts.
 *
 * PLACEHOLDER STATUS: every number in IMPACT is a stand-in and tagged
 * `// mock`. Swap real figures here; components do not change.
 */

import { serpentine } from "@/lib/flow";

/* --------------------------------------------------------------- §A1 hero */

export const A_HERO = {
  eyebrow: "Growth Automation Lab",
  // headline split so the accent line can be styled in JSX
  lead: "Your business should work",
  accent: "while you sleep.",
  sub: "Replace repetitive work with systems that capture leads, qualify prospects, run operations, and keep growing at 3am.",
  cta: { label: "Book an automation audit", href: "#audit" },
} as const;

/** The backdrop machine. Runs forever behind the headline. Icons only, no
 *  metas — it renders at ambient opacity where a meta line is just mush. */
export const A_HERO_FLOW = serpentine(
  [
    { label: "Lead", icon: "lead" },
    { label: "AI", icon: "ai" },
    { label: "CRM", icon: "crm" },
    { label: "Email", icon: "email" },
    { label: "Meeting", icon: "calendar" },
    { label: "Customer", icon: "user" },
  ],
  3,
  { payload: "lead" },
);

/* ---------------------------------------------------- §A2 what is / chaos */

export const A_TRANSFORM = {
  title: "Same business. Same team. Two different machines.",
  sub: "Nothing here is exotic. It's the work you already do, wired together so it stops depending on someone remembering.",
  before: {
    label: "Today",
    caption: "Every step waits on a human. Miss one and the lead is gone.",
  },
  after: {
    label: "Wired",
    caption: "Every step hands off on its own. Nothing waits on memory.",
  },
} as const;

/* Stale metas on the chaos side — the "before" machine should hurt a
 * little. The order machine answers each one with a live state. */
export const A_CHAOS_FLOW = serpentine(
  [
    { label: "Customer calls", icon: "phone-x", meta: "ringing…" },
    { label: "Nobody free", icon: "user-minus", meta: "on site" },
    { label: "Missed call", icon: "phone-x", meta: "3 today" },
    { label: "WhatsApp ping", icon: "note", meta: "unread 47" },
    { label: "Forgotten", icon: "clock", meta: "4 days ago" },
    { label: "Excel sheet", icon: "table", meta: "v7_final.xlsx" },
    { label: "Confusion", icon: "note", meta: "who has this?" },
    { label: "Lost customer", icon: "user-minus", meta: "—" },
  ],
  4,
);

export const A_ORDER_FLOW = serpentine(
  [
    { label: "Customer", icon: "user", kind: "trigger", meta: "on your site", doneMeta: "captured" },
    { label: "Website", icon: "globe", kind: "app", meta: "form fill", doneMeta: "submitted" },
    { label: "AI assistant", icon: "ai", kind: "ai", meta: "score —", doneMeta: "qualified" },
    { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", doneMeta: "2,419 rows" },
    { label: "Auto follow-up", icon: "email", kind: "action", meta: "queued", doneMeta: "sent ✓" },
    { label: "Booking", icon: "calendar", kind: "app", meta: "—", doneMeta: "Tue 10:00" },
    { label: "Dashboard", icon: "chart", kind: "metric", meta: "live", doneMeta: "updated" },
    { label: "Owner", icon: "user", kind: "outcome", meta: "reads one number", doneMeta: "asleep at 3am" },
  ],
  4,
  { payload: "lead" },
);

/* ------------------------------------------------------------ §A3 catalog */

export const A_CATALOG_HEADER = {
  eyebrow: "The stack",
  title: "Ten systems that quietly run a business.",
  sub: "Hover any card to watch it run. Most companies need three of these, not ten.",
} as const;

/* Each card's diagram is built from its steps — see serpentine(). Cards are
 * small, so steps carry an icon + kind (for the app-glyph and status states)
 * but no meta line — a 9px sub-line would be unreadable at card width. */
export const A_CATALOG = [
  {
    id: "lead-capture",
    name: "Lead capture",
    blurb: "A form fill becomes a tracked, assigned, followed-up lead in seconds.",
    steps: [
      { label: "Visitor", icon: "user", kind: "trigger" },
      { label: "Form", icon: "note", kind: "action" },
      { label: "CRM", icon: "crm", kind: "metric" },
      { label: "Email", icon: "email", kind: "action" },
      { label: "Sales team", icon: "users", kind: "outcome" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp assistant",
    blurb: "Answers the same twelve questions your team answers every day.",
    steps: [
      { label: "Customer", icon: "user", kind: "trigger" },
      { label: "WhatsApp", icon: "chat", kind: "app" },
      { label: "AI", icon: "ai", kind: "ai" },
      { label: "Answer", icon: "chat", kind: "action" },
      { label: "Booking", icon: "calendar", kind: "outcome" },
    ],
  },
  {
    id: "booking",
    name: "Appointment booking",
    blurb: "Self-serve calendar with reminders that kill no-shows.",
    steps: [
      { label: "Customer", icon: "user", kind: "trigger" },
      { label: "Calendar", icon: "calendar", kind: "app" },
      { label: "Confirm", icon: "check", kind: "action" },
      { label: "Reminder", icon: "bell", kind: "action" },
      { label: "Meeting", icon: "calendar", kind: "outcome" },
    ],
  },
  {
    id: "reviews",
    name: "Review engine",
    blurb: "Asks every happy customer, at the moment they're happiest.",
    steps: [
      { label: "Purchase", icon: "card", kind: "trigger" },
      { label: "Email", icon: "email", kind: "action" },
      { label: "Review", icon: "star", kind: "action" },
      { label: "Feedback", icon: "chat", kind: "outcome" },
    ],
  },
  {
    id: "invoice",
    name: "Invoicing",
    blurb: "Order to paid to booked, without a spreadsheet in the middle.",
    steps: [
      { label: "Order", icon: "cart", kind: "trigger" },
      { label: "Invoice", icon: "receipt", kind: "action" },
      { label: "Payment", icon: "card", kind: "action" },
      { label: "Accounting", icon: "calculator", kind: "outcome" },
    ],
  },
  {
    id: "hr",
    name: "Hiring",
    blurb: "Screens the pile so you only read the shortlist.",
    steps: [
      { label: "Resume", icon: "file", kind: "trigger" },
      { label: "AI screen", icon: "ai", kind: "ai" },
      { label: "Interview", icon: "chat", kind: "app" },
      { label: "Offer", icon: "check", kind: "outcome" },
    ],
  },
  {
    id: "pipeline",
    name: "Sales pipeline",
    blurb: "Every deal has a stage and a next action. Automatically.",
    steps: [
      { label: "Lead", icon: "lead", kind: "trigger" },
      { label: "Qualified", icon: "check", kind: "ai" },
      { label: "Proposal", icon: "file", kind: "action" },
      { label: "Won", icon: "trophy", kind: "outcome" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing sequence",
    blurb: "Turns a download into a conversation over two weeks.",
    steps: [
      { label: "Download", icon: "download", kind: "trigger" },
      { label: "Sequence", icon: "email", kind: "action" },
      { label: "Education", icon: "book", kind: "action" },
      { label: "Call", icon: "phone", kind: "app" },
      { label: "Sale", icon: "card", kind: "outcome" },
    ],
  },
  {
    id: "support",
    name: "Customer support",
    blurb: "Deflects the repeat questions, escalates the real ones.",
    steps: [
      { label: "Question", icon: "chat", kind: "trigger" },
      { label: "AI", icon: "ai", kind: "ai" },
      { label: "Docs", icon: "book", kind: "app" },
      { label: "Resolved", icon: "check", kind: "outcome" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    blurb: "One dashboard instead of six tabs and a guess.",
    steps: [
      { label: "Website", icon: "globe", kind: "trigger" },
      { label: "Events", icon: "pulse", kind: "app" },
      { label: "Dashboard", icon: "chart", kind: "metric" },
      { label: "Insight", icon: "lightbulb", kind: "outcome" },
    ],
  },
] as const;

/* ------------------------------------------------------- §A4 before/after */

export const A_SLIDER = {
  title: "Drag it.",
  sub: "Left is how the work runs today. Right is the same work, wired. Drag the handle, or use the arrow keys.",
  leftLabel: "Manual",
  rightLabel: "Automated",
  handleLabel: "Compare manual and automated workflow",
} as const;

export const A_SLIDER_BEFORE = serpentine(
  [
    { label: "Manual", icon: "user", meta: "someone remembers" },
    { label: "Phone", icon: "phone", meta: "if answered" },
    { label: "Paper", icon: "note", meta: "on a desk" },
    { label: "Forgotten", icon: "clock", meta: "4 days ago" },
    { label: "Lost customer", icon: "user-minus", meta: "gone" },
  ],
  3,
);

export const A_SLIDER_AFTER = serpentine(
  [
    { label: "Website", icon: "globe", kind: "trigger", meta: "form fill", activeMeta: "capturing…", doneMeta: "captured" },
    { label: "AI", icon: "ai", kind: "ai", meta: "score —", activeMeta: "thinking…", doneMeta: "qualified" },
    { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", activeMeta: "+1 row", doneMeta: "2,419 rows" },
    { label: "Automation", icon: "gear", kind: "action", meta: "idle", activeMeta: "running…", doneMeta: "done" },
    { label: "Customer", icon: "user", kind: "app", meta: "waiting", activeMeta: "notified…", doneMeta: "booked" },
    { label: "Revenue", icon: "chart", kind: "outcome", meta: "—", activeMeta: "posting…", doneMeta: "+1 sale" },
  ],
  3,
  { payload: "lead" },
);

/* --------------------------------------------------------- §A5 industries */

export const A_INDUSTRIES_HEADER = {
  title: "Every business is different. So every automation is too.",
  sub: "Same principles, different machine. Pick a business.",
  /** aria-label for the tablist — was the eyebrow before eyebrow rationing */
  tablistLabel: "Industries",
} as const;

/* Each step carries an icon + a present→settled meta pair so the build
 * reveal reads like a real machine wiring itself, not a labelled box. Metas
 * are generic-but-true system states — no invented client numbers. */
export const A_INDUSTRIES = [
  {
    id: "startup",
    name: "Startup",
    steps: [
      { label: "Visitor", icon: "user", kind: "trigger", meta: "lands", doneMeta: "identified" },
      { label: "Landing page", icon: "globe", kind: "app", meta: "loads", doneMeta: "converts" },
      { label: "Lead magnet", icon: "magnet", kind: "action", meta: "offered", doneMeta: "downloaded" },
      { label: "Email", icon: "email", kind: "action", meta: "queued", doneMeta: "sent" },
      { label: "CRM", icon: "crm", kind: "metric", meta: "new row", doneMeta: "logged" },
      { label: "AI qualify", icon: "ai", kind: "ai", meta: "scoring", doneMeta: "qualified" },
      { label: "Meeting", icon: "calendar", kind: "app", meta: "proposed", doneMeta: "booked" },
      { label: "Proposal", icon: "file", kind: "action", meta: "drafting", doneMeta: "sent" },
      { label: "Client", icon: "users", kind: "outcome", meta: "signing", doneMeta: "won" },
      { label: "Onboarding", icon: "rocket", kind: "action", meta: "kickoff", doneMeta: "live" },
      { label: "Dashboard", icon: "chart", kind: "metric", meta: "live", doneMeta: "one number" },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    steps: [
      { label: "Google search", icon: "search", kind: "trigger", meta: "found you", doneMeta: "clicked" },
      { label: "Website", icon: "globe", kind: "app", meta: "browsing", doneMeta: "engaged" },
      { label: "Lead form", icon: "note", kind: "action", meta: "filling", doneMeta: "submitted" },
      { label: "CRM", icon: "crm", kind: "metric", meta: "new row", doneMeta: "logged" },
      { label: "AI qualify", icon: "ai", kind: "ai", meta: "scoring", doneMeta: "qualified" },
      { label: "Site visit", icon: "mappin", kind: "app", meta: "scheduled", doneMeta: "surveyed" },
      { label: "Quotation", icon: "file", kind: "action", meta: "drafting", doneMeta: "sent" },
      { label: "Approval", icon: "check", kind: "app", meta: "pending", doneMeta: "approved" },
      { label: "Project", icon: "buildings", kind: "action", meta: "kickoff", doneMeta: "building" },
      { label: "Invoice", icon: "receipt", kind: "action", meta: "raised", doneMeta: "paid" },
      { label: "Referral", icon: "users", kind: "outcome", meta: "asked", doneMeta: "referred" },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    steps: [
      { label: "Instagram", icon: "chat", kind: "trigger", meta: "sees post", doneMeta: "taps link" },
      { label: "Website", icon: "globe", kind: "app", meta: "menu view", doneMeta: "engaged" },
      { label: "Reservation", icon: "calendar", kind: "app", meta: "picking", doneMeta: "booked" },
      { label: "Kitchen", icon: "fork", kind: "action", meta: "ticket in", doneMeta: "served" },
      { label: "Payment", icon: "card", kind: "action", meta: "at table", doneMeta: "paid" },
      { label: "Loyalty", icon: "star", kind: "action", meta: "points", doneMeta: "enrolled" },
      { label: "Review", icon: "star", kind: "action", meta: "asked", doneMeta: "5 stars" },
      { label: "Revisit", icon: "repeat", kind: "outcome", meta: "nudged", doneMeta: "returns" },
    ],
  },
  {
    id: "clinic",
    name: "Healthcare",
    steps: [
      { label: "Patient", icon: "user", kind: "trigger", meta: "enquires", doneMeta: "registered" },
      { label: "Appointment", icon: "calendar", kind: "app", meta: "picking", doneMeta: "booked" },
      { label: "Reminder", icon: "bell", kind: "action", meta: "24h out", doneMeta: "confirmed" },
      { label: "Consultation", icon: "stethoscope", kind: "app", meta: "in room", doneMeta: "seen" },
      { label: "Prescription", icon: "pill", kind: "action", meta: "writing", doneMeta: "issued" },
      { label: "Follow-up", icon: "email", kind: "outcome", meta: "scheduled", doneMeta: "sent" },
    ],
  },
  {
    id: "realestate",
    name: "Real estate",
    steps: [
      { label: "Listing", icon: "buildings", kind: "trigger", meta: "live", doneMeta: "viewed" },
      { label: "Enquiry", icon: "chat", kind: "action", meta: "incoming", doneMeta: "captured" },
      { label: "AI qualify", icon: "ai", kind: "ai", meta: "scoring", doneMeta: "qualified" },
      { label: "Viewing", icon: "calendar", kind: "app", meta: "scheduled", doneMeta: "toured" },
      { label: "Offer", icon: "tag", kind: "action", meta: "incoming", doneMeta: "accepted" },
      { label: "Paperwork", icon: "file", kind: "action", meta: "in flight", doneMeta: "signed" },
      { label: "Closed", icon: "check", kind: "outcome", meta: "clearing", doneMeta: "sold" },
    ],
  },
  {
    id: "gym",
    name: "Gym",
    steps: [
      { label: "Ad", icon: "megaphone", kind: "trigger", meta: "running", doneMeta: "clicked" },
      { label: "Trial signup", icon: "note", kind: "action", meta: "filling", doneMeta: "booked" },
      { label: "Reminder", icon: "bell", kind: "action", meta: "day before", doneMeta: "confirmed" },
      { label: "First session", icon: "calendar", kind: "app", meta: "checked in", doneMeta: "trained" },
      { label: "Membership", icon: "card", kind: "action", meta: "offered", doneMeta: "joined" },
      { label: "Renewal", icon: "repeat", kind: "outcome", meta: "nudged", doneMeta: "renewed" },
    ],
  },
  {
    id: "agency",
    name: "Agency",
    steps: [
      { label: "Inbound", icon: "email", kind: "trigger", meta: "arrives", doneMeta: "triaged" },
      { label: "Discovery", icon: "chat", kind: "app", meta: "scheduled", doneMeta: "scoped" },
      { label: "Proposal", icon: "file", kind: "action", meta: "drafting", doneMeta: "sent" },
      { label: "Contract", icon: "file", kind: "action", meta: "out", doneMeta: "signed" },
      { label: "Kickoff", icon: "rocket", kind: "app", meta: "scheduled", doneMeta: "launched" },
      { label: "Retainer", icon: "repeat", kind: "outcome", meta: "monthly", doneMeta: "recurring" },
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    steps: [
      { label: "Ad", icon: "megaphone", kind: "trigger", meta: "running", doneMeta: "clicked" },
      { label: "Product page", icon: "tag", kind: "app", meta: "viewing", doneMeta: "added" },
      { label: "Cart", icon: "cart", kind: "app", meta: "filled", doneMeta: "checkout" },
      { label: "Abandon email", icon: "email", kind: "action", meta: "triggered", doneMeta: "sent" },
      { label: "Purchase", icon: "card", kind: "action", meta: "paying", doneMeta: "paid" },
      { label: "Reorder", icon: "repeat", kind: "outcome", meta: "nudged", doneMeta: "repeats" },
    ],
  },
] as const;

/** Wide chains need more columns or the rows get comically long. */
export const A_INDUSTRY_COLS = 4;

/* ------------------------------------------------------------- §A6 impact */

export const A_IMPACT_HEADER = {
  title: "The point was never the robot.",
} as const;

export const A_IMPACT = [
  // mock — replace with real aggregates once we have them across clients
  { id: "hours", value: 62, suffix: "h", label: "Saved per month", note: "Per team, average" },
  { id: "leads", value: 3.4, decimals: 1, suffix: "x", label: "More leads captured", note: "vs. manual follow-up" },
  { id: "response", value: 90, suffix: "s", label: "First response time", note: "Down from ~6 hours" },
  { id: "tasks", value: 100, suffix: "%", label: "Of follow-ups sent", note: "Nothing depends on memory" },
] as const;

/* ---------------------------------------------------------------- §A7 cta */

export const A_CTA = {
  heading: "Let's find the three systems you actually need.",
  sub: "A free 30-minute audit. We map your current workflow, mark what's automatable, and tell you what it's worth. No deck.",
  placeholder: "you@company.com",
  messagePlaceholder: "What does your lead flow look like today?",
  button: "Book the audit",
  /** where the form falls back if the send endpoint isn't configured */
  fallbackEmail: "hello@sampeerstudio.com", // TODO: confirm live inbox — mirrors lib/content.ts CTA
} as const;
