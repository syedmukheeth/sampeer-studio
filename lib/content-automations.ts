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

/** The backdrop machine. Runs forever behind the headline. */
export const A_HERO_FLOW = serpentine(
  ["Lead", "AI", "CRM", "Email", "Meeting", "Customer"],
  3,
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

export const A_CHAOS_FLOW = serpentine(
  [
    "Customer calls",
    "Nobody free",
    "Missed call",
    "WhatsApp ping",
    "Forgotten",
    "Excel sheet",
    "Confusion",
    "Lost customer",
  ],
  4,
);

export const A_ORDER_FLOW = serpentine(
  [
    "Customer",
    "Website",
    "AI assistant",
    "CRM",
    "Auto follow-up",
    "Booking",
    "Dashboard",
    "Owner",
  ],
  4,
);

/* ------------------------------------------------------------ §A3 catalog */

export const A_CATALOG_HEADER = {
  eyebrow: "The stack",
  title: "Ten systems that quietly run a business.",
  sub: "Hover any card to watch it run. Most companies need three of these, not ten.",
} as const;

/** Each card's diagram is built from its steps — see serpentine(). */
export const A_CATALOG = [
  {
    id: "lead-capture",
    name: "Lead capture",
    blurb: "A form fill becomes a tracked, assigned, followed-up lead in seconds.",
    steps: ["Visitor", "Form", "CRM", "Email", "Sales team"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp assistant",
    blurb: "Answers the same twelve questions your team answers every day.",
    steps: ["Customer", "WhatsApp", "AI", "Answer", "Booking"],
  },
  {
    id: "booking",
    name: "Appointment booking",
    blurb: "Self-serve calendar with reminders that kill no-shows.",
    steps: ["Customer", "Calendar", "Confirm", "Reminder", "Meeting"],
  },
  {
    id: "reviews",
    name: "Review engine",
    blurb: "Asks every happy customer, at the moment they're happiest.",
    steps: ["Purchase", "Email", "Review", "Feedback"],
  },
  {
    id: "invoice",
    name: "Invoicing",
    blurb: "Order to paid to booked, without a spreadsheet in the middle.",
    steps: ["Order", "Invoice", "Payment", "Accounting"],
  },
  {
    id: "hr",
    name: "Hiring",
    blurb: "Screens the pile so you only read the shortlist.",
    steps: ["Resume", "AI screen", "Interview", "Offer"],
  },
  {
    id: "pipeline",
    name: "Sales pipeline",
    blurb: "Every deal has a stage and a next action. Automatically.",
    steps: ["Lead", "Qualified", "Proposal", "Won"],
  },
  {
    id: "marketing",
    name: "Marketing sequence",
    blurb: "Turns a download into a conversation over two weeks.",
    steps: ["Download", "Sequence", "Education", "Call", "Sale"],
  },
  {
    id: "support",
    name: "Customer support",
    blurb: "Deflects the repeat questions, escalates the real ones.",
    steps: ["Question", "AI", "Knowledge base", "Resolved"],
  },
  {
    id: "analytics",
    name: "Analytics",
    blurb: "One dashboard instead of six tabs and a guess.",
    steps: ["Website", "Events", "Dashboard", "Insight"],
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
  ["Manual", "Phone", "Paper", "Forgotten", "Lost customer"],
  3,
);

export const A_SLIDER_AFTER = serpentine(
  ["Website", "AI", "CRM", "Automation", "Customer", "Revenue"],
  3,
);

/* --------------------------------------------------------- §A5 industries */

export const A_INDUSTRIES_HEADER = {
  title: "Every business is different. So every automation is too.",
  sub: "Same principles, different machine. Pick a business.",
  /** aria-label for the tablist — was the eyebrow before eyebrow rationing */
  tablistLabel: "Industries",
} as const;

export const A_INDUSTRIES = [
  {
    id: "startup",
    name: "Startup",
    steps: [
      "Visitor",
      "Landing page",
      "Lead magnet",
      "Email",
      "CRM",
      "AI qualify",
      "Meeting",
      "Proposal",
      "Client",
      "Onboarding",
      "Dashboard",
    ],
  },
  {
    id: "construction",
    name: "Construction",
    steps: [
      "Google search",
      "Website",
      "Lead form",
      "CRM",
      "AI qualify",
      "Site visit",
      "Quotation",
      "Approval",
      "Project",
      "Invoice",
      "Referral",
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    steps: [
      "Instagram",
      "Website",
      "Reservation",
      "Kitchen",
      "Payment",
      "Loyalty",
      "Review",
      "Revisit",
    ],
  },
  {
    id: "clinic",
    name: "Healthcare",
    steps: [
      "Patient",
      "Appointment",
      "Reminder",
      "Consultation",
      "Prescription",
      "Follow-up",
    ],
  },
  {
    id: "realestate",
    name: "Real estate",
    steps: [
      "Listing",
      "Enquiry",
      "AI qualify",
      "Viewing",
      "Offer",
      "Paperwork",
      "Closed",
    ],
  },
  {
    id: "gym",
    name: "Gym",
    steps: ["Ad", "Trial signup", "Reminder", "First session", "Membership", "Renewal"],
  },
  {
    id: "agency",
    name: "Agency",
    steps: ["Inbound", "Discovery", "Proposal", "Contract", "Kickoff", "Retainer"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    steps: ["Ad", "Product page", "Cart", "Abandon email", "Purchase", "Reorder"],
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
