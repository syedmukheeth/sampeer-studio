/**
 * SINGLE SOURCE OF CONTENT for the whole page.
 * Components read from here — no copy hardcoded in JSX.
 *
 * PLACEHOLDER STATUS: WORK (§04) is real — six live client sites. Pillars,
 * stats, and testimonials still carry stand-ins; mock values are tagged
 * `// mock` / `// TODO`. Swap real data here; components do not change.
 *
 * Image helper: stockImg(seed, w, h) -> deterministic Picsum URL.
 */

import { serpentine } from "@/lib/flow";
import { A_CONSOLE_URL } from "@/lib/content-automations";

export function stockImg(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/* ---------------------------------------------------------------- nav */
/* Hrefs are root-relative, not bare hashes: the site is no longer one page,
   and `#work` from /automations goes nowhere. Nav resolves these per route. */
export const NAV = {
  brand: "Sampeer Studio",
  links: [
    { label: "Work", href: "/#work" },
    { label: "Approach", href: "/#build" },
    { label: "Automations", href: "/automations" },
    { label: "About", href: "/#about" },
  ],
  cta: { label: "Start", href: "/#contact" },
} as const;

/* --------------------------------------------------------------- hero */
/* §01 The Verdict — one statement plus a quiet anchor into the proof. */
export const HERO = {
  // headline split so the accent word can be styled in JSX
  lead: "Most startups don't fail.",
  accent: "They go unnoticed.",
  // quiet follow line, kept under the 20-word cap
  sub: "We build the growth layer that makes founders impossible to ignore.",
  /** Primary lead CTA — the one solid strike above the fold. A premium agency
   *  site earns the click here, not only in the Nav. */
  ctaPrimary: { label: "Book a free call", href: "#contact" },
  /** Quiet secondary anchor: doubles as the scroll affordance and a skip
   *  straight to the proof. */
  cta: { label: "See the work", href: "#work" },
} as const;

/**
 * A/B test bench for the hero verdict (Phase 6, post-launch).
 * Not wired by default: rendering a random variant on the client causes a
 * hydration flash. To enable safely, assign a variant via middleware/cookie
 * (server-stable), pass it into <Hero variant=...>, and `track("hero_view",
 * { variant })`. Pick the winner, then promote it into HERO above.
 */
export const HERO_VARIANTS = [
  { id: "a", lead: "Most startups don't fail.", accent: "They go unnoticed." },
  { id: "b", lead: "Your product is not the problem.", accent: "Your silence is." },
] as const;

/* ------------------------------------------------------------ problem */
/* §02 No heading. Brutal prose. Creates the itch. */
export const PROBLEM = {
  lines: [
    "Your product is good. That was never the question.",
    "Nobody notices it. Nobody remembers it. Nobody trusts it yet.",
    "So the users don't come, the momentum never starts, and the work stays invisible.",
  ],
  // one word gets the indigo strike in JSX
  emphasis: "invisible",
} as const;

/* -------------------------------------------------------------- build */
/* §03 Three pillars as outcomes, not deliverables. Sticky-stack. Each panel's
 * visual is a bespoke PillarGraphic (wireframe / live Flow / post skeleton),
 * not stock photography — the work itself is the imagery. */
export type Pillar = {
  id: string;
  index: string;
  title: string;
  outcome: string;
  body: string;
  /** which PillarGraphic variant renders in the panel's visual frame */
  graphic: "story" | "growth" | "founder";
};

export const PILLARS: Pillar[] = [
  {
    id: "story",
    index: "01",
    title: "Storytelling Website",
    outcome: "Strangers start trusting you in ninety seconds.",
    body: "Not a template. An experience that carries your vision, earns belief, and turns visitors into believers before they ever talk to you.",
    graphic: "story",
  },
  {
    id: "growth",
    index: "02",
    title: "Growth System",
    outcome: "Leads arrive, qualify, and book themselves.",
    body: "Capture, CRM, AI qualification, follow-up, and booking wired into one engine. Automation is a part of it. Revenue is the point.",
    graphic: "growth",
  },
  {
    id: "founder",
    index: "03",
    title: "Founder Brand",
    outcome: "Your name opens doors before you do.",
    body: "Founders are the new media companies. We build the presence and authority that pull opportunities toward you instead of chasing them.",
    graphic: "founder",
  },
];

/** The growth pillar's live machine — rendered by PillarGraphic via Flow. */
export const PILLAR_GROWTH_FLOW = serpentine(
  [
    { label: "Lead", icon: "lead", kind: "trigger", meta: "just now", activeMeta: "capturing…", doneMeta: "captured" },
    { label: "AI qualify", icon: "ai", kind: "ai", meta: "score -", activeMeta: "thinking…", doneMeta: "score 87" },
    { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", activeMeta: "+1 row", doneMeta: "2,419 rows" },
    { label: "Follow-up", icon: "email", kind: "action", meta: "queued", activeMeta: "sending…", doneMeta: "sent ✓" },
    { label: "Booked", icon: "calendar", kind: "outcome", meta: "-", activeMeta: "confirming…", doneMeta: "Tue 10:00" },
  ],
  2,
  { payload: "lead" },
);

/* --------------------------------------------------------------- work */
/* §04 Real work, vertical sticky-stack. Each card shows a local poster at
 * rest and embeds the live site (scaled iframe) on hover — the project's own
 * hero animation is the showcase. Descriptions state what the site is; no
 * invented metrics. */
export type LiveProject = {
  id: string;
  client: string;
  industry: string;
  description: string;
  url: string;
  /** local still of the live site, shown at rest (public/work/*.webp) */
  poster: string;
  /** internal case-study route; when set the card opens this instead of the
   *  live site, and the live site moves inside the case study */
  caseStudy?: string;
  /** real on-site proof shown as a small photo stack on the card */
  proof?: { photos: string[]; label: string };
  /** a short client pull-quote shown on the card */
  testimonial?: { quote: string; author: string };
};

export const WORK_HEADER = {
  eyebrow: "Real work",
  title: "Six live sites. Step inside any of them.",
} as const;

export const WORK: LiveProject[] = [
  {
    id: "asrg",
    poster: "/work/asrg.webp",
    client: "ASRG Construction",
    industry: "Construction & Civil, Kurnool",
    description: "Full brand site for a 46-year civil contracting firm. Projects, process, and enquiry in one place.",
    url: "https://www.asrgcontruction.com/",
    caseStudy: "/work/asrg",
    proof: {
      photos: ["/asrg-client.webp", "/asrg-client-2.webp"],
      label: "On-site with the client, Kurnool",
    },
    testimonial: {
      quote: "Our online presence finally matches the work we do.",
      author: "ASRG Construction",
    },
  },
  {
    id: "aurum",
    poster: "/work/aurum.webp",
    client: "Aurum Resorts",
    industry: "Luxury Hospitality, Maldives",
    description: "A private-island resort experience told in stillness. Villas, dining, and the sea.",
    url: "https://luxury-hotel-sooty.vercel.app/",
    caseStudy: "/work/aurum",
  },
  {
    id: "liftx",
    poster: "/work/liftx.webp",
    client: "LIFT-X",
    industry: "Fitness, Kurnool",
    description: "A premium unisex gym site built on bold type and one decision: start.",
    url: "https://lift-x-ten.vercel.app/",
    caseStudy: "/work/liftx",
  },
  {
    id: "vantara",
    poster: "/work/vantara.webp",
    client: "Vantara & Rao",
    industry: "Corporate Law, Hyderabad",
    description: "A corporate law firm positioned as a strategic partner, not a reactive counsel.",
    url: "https://law-firm-eight-livid.vercel.app/",
    caseStudy: "/work/vantara",
  },
  {
    id: "novacare",
    poster: "/work/novacare.webp",
    client: "NovaCare Medical Center",
    industry: "Healthcare, Hyderabad",
    description: "A multi-specialty hospital site that makes fifty departments feel human.",
    url: "https://healthcare-ten-orcin.vercel.app/",
    caseStudy: "/work/novacare",
  },
  {
    id: "uniquirk",
    poster: "/work/uniquirk.webp",
    client: "Uniquirk Solutions",
    industry: "Personal Branding, B2B",
    description: "LinkedIn authority engineering for CXOs, with a dark, sharp site to match the pitch.",
    url: "https://uniquirk.vercel.app/",
    caseStudy: "/work/uniquirk",
  },
];

/* -------------------------------------------------------- case study */
/* §04a Case studies, data-driven. One shape, two visual variants:
 *  - `gallery` — real on-site photos (ASRG only, a real client).
 *  - `shots`   — desktop + mobile captures of the live site (the five concept
 *    builds, which have no on-site photos).
 * The CaseStudy component renders whichever is present. Each object gets a
 * route at /work/<slug>; the matching WORK card links there. */
export type CaseStudyData = {
  slug: string;
  eyebrow: string;
  client: string;
  tagline: string;
  liveUrl: string;
  poster: string;
  meta: { label: string; value: string }[];
  challenge: { title: string; body: string };
  solution: { title: string; body: string };
  servicesTitle: string;
  services: string[];
  outcome: { title: string; body: string };
  visit: string;
  /** real on-site photo gallery (portrait grid) */
  gallery?: {
    title: string;
    caption: string;
    photos: { src: string; alt: string; caption: string }[];
  };
  /** live-site proof — desktop still (the poster) + a live phone-frame render.
   *  Both are derived from existing fields (poster, liveUrl); this only carries
   *  the section's copy, so there are no separate capture files to source. */
  shots?: {
    title: string;
    caption: string;
  };
};

/* ASRG Construction — the first full case study. Real client, real on-site
 * photos (public/asrg-client*.webp), real live site. Copy is the owner's,
 * lightly shaped. */
export const CASE_ASRG: CaseStudyData = {
  slug: "asrg",
  eyebrow: "Case study",
  client: "ASRG Construction",
  tagline: "A 46-year civil contracting firm, finally as credible online as it is on site.",
  liveUrl: "https://www.asrgcontruction.com/",
  poster: "/work/asrg.webp",
  meta: [
    { label: "Industry", value: "Construction & Civil" },
    { label: "Location", value: "Kurnool, India" },
    { label: "Engagement", value: "Website · SEO · Google Business" },
  ],
  challenge: {
    title: "The challenge",
    body: "Four decades of civil contracting, and almost none of it visible online. Prospects searching for a contractor found competitors first, with no way to weigh ASRG's track record before picking up the phone. The reputation was real; nothing digital backed it up.",
  },
  solution: {
    title: "The solution",
    body: "A premium storytelling website that puts the firm's history, projects, and process in one place - fast to load, clear on every device, and built to rank. Paired with SEO groundwork and a fully optimized Google Business Profile so ASRG shows up when Kurnool searches for a civil contractor.",
  },
  servicesTitle: "What we delivered",
  services: [
    "Premium storytelling website",
    "Website design & development",
    "Search engine optimization (SEO)",
    "Google Business Profile setup",
    "Fully responsive build",
    "Performance optimization",
  ],
  gallery: {
    title: "On the ground",
    caption: "On-site at the ASRG Construction office in Kurnool - where the project was signed.",
    photos: [
      { src: "/asrg-client.webp", alt: "Sampeer Studio founder shaking hands with the ASRG Construction owner", caption: "Sealing the project" },
      { src: "/asrg-client-2.webp", alt: "Sampeer Studio founder with the ASRG Construction owner at their office", caption: "With the ASRG team, Kurnool" },
    ],
  },
  outcome: {
    title: "The outcome",
    body: "A modern, professional digital presence that finally matches the work - one that earns trust on first impression and lays the foundation for organic search visibility and inbound leads.",
  },
  visit: "Visit the live site",
};

/* --------------------------------------------- concept-build case studies */
/* §04b The five concept builds. These are portfolio pieces, not paying
 * clients, so the copy is honest about that: no invented clients, metrics, or
 * testimonials. The challenge/solution read as design rationale — the problem
 * the *category* faces, and the decision the build makes about it. Visual proof
 * is a desktop + mobile capture of the live site (public/work/shots/). */

export const CASE_AURUM: CaseStudyData = {
  slug: "aurum",
  eyebrow: "Concept build",
  client: "Aurum Resorts",
  tagline: "A private-island resort concept told in stillness — where the design does the selling by getting out of the way.",
  liveUrl: "https://luxury-hotel-sooty.vercel.app/",
  poster: "/work/aurum.webp",
  meta: [
    { label: "Industry", value: "Luxury Hospitality" },
    { label: "Focus", value: "Brand & booking experience" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "Most resort sites shout — carousels, badges, ten offers above the fold. Luxury reads as restraint, and the louder a site is, the cheaper the room feels. The problem to solve was making a screen feel expensive.",
  },
  solution: {
    title: "The approach",
    body: "One image at a time, generous negative space, and type that never hurries. The villas, the dining, and the sea each get room to breathe, so the site sells the way a private island does — by slowing you down.",
  },
  servicesTitle: "What this build demonstrates",
  services: [
    "Editorial storytelling layout",
    "Full-bleed cinematic imagery",
    "Restraint-first typography",
    "Responsive build",
    "Motion & scroll pacing",
    "Booking-intent flow",
  ],
  outcome: {
    title: "Why it exists",
    body: "A concept piece that proves a hospitality brand can feel five-star on the first scroll — the studio's case for stillness as a sales tool, not a compromise.",
  },
  shots: {
    title: "The build, on screen",
    caption: "The Aurum Resorts concept, live on desktop and mobile.",
  },
  visit: "Visit the live site",
};

export const CASE_LIFTX: CaseStudyData = {
  slug: "liftx",
  eyebrow: "Concept build",
  client: "LIFT-X",
  tagline: "A premium unisex gym concept built on bold type and a single decision: start.",
  liveUrl: "https://lift-x-ten.vercel.app/",
  poster: "/work/liftx.webp",
  meta: [
    { label: "Industry", value: "Fitness" },
    { label: "Focus", value: "Conversion & sign-up intent" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "Gym sites bury the one action that matters — joining — under class timetables, pricing tiers, and stock photos of equipment. The visitor already knows they should train. They need a reason to act today.",
  },
  solution: {
    title: "The approach",
    body: "Oversized, confident type carries the whole site, and every section funnels toward one CTA. No hedging, no ten menu items — just momentum and a single decision made easy.",
  },
  servicesTitle: "What this build demonstrates",
  services: [
    "Bold display typography",
    "Single-CTA conversion flow",
    "High-energy motion",
    "Responsive build",
    "Performance optimization",
    "Brand-led art direction",
  ],
  outcome: {
    title: "Why it exists",
    body: "A concept piece showing how far a fitness brand gets on type and focus alone — proof the studio can build energy without clutter.",
  },
  shots: {
    title: "The build, on screen",
    caption: "The LIFT-X concept, live on desktop and mobile.",
  },
  visit: "Visit the live site",
};

export const CASE_VANTARA: CaseStudyData = {
  slug: "vantara",
  eyebrow: "Concept build",
  client: "Vantara & Rao",
  tagline: "A corporate-law concept positioned as a strategic partner, not reactive counsel.",
  liveUrl: "https://law-firm-eight-livid.vercel.app/",
  poster: "/work/vantara.webp",
  meta: [
    { label: "Industry", value: "Corporate Law" },
    { label: "Focus", value: "Authority & trust" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "Law-firm sites default to grey templates and stock gavels, which read as interchangeable. For corporate clients choosing counsel for a merger or a dispute, interchangeable is the last thing that wins the brief.",
  },
  solution: {
    title: "The approach",
    body: "A restrained, confident identity — serious typography, deliberate structure, and copy that speaks like a partner across the table. The design signals judgment before a single case is read.",
  },
  servicesTitle: "What this build demonstrates",
  services: [
    "Authority-led visual identity",
    "Structured practice-area IA",
    "Trust & credibility architecture",
    "Responsive build",
    "Accessible, legible typography",
    "Enquiry-intent flow",
  ],
  outcome: {
    title: "Why it exists",
    body: "A concept piece proving a professional-services firm can look like the partner it claims to be — the studio's case for positioning over decoration.",
  },
  shots: {
    title: "The build, on screen",
    caption: "The Vantara & Rao concept, live on desktop and mobile.",
  },
  visit: "Visit the live site",
};

export const CASE_NOVACARE: CaseStudyData = {
  slug: "novacare",
  eyebrow: "Concept build",
  client: "NovaCare Medical Center",
  tagline: "A multi-specialty hospital concept designed to make fifty departments feel like one calm front door.",
  liveUrl: "https://healthcare-ten-orcin.vercel.app/",
  poster: "/work/novacare.webp",
  meta: [
    { label: "Industry", value: "Healthcare" },
    { label: "Focus", value: "Reassurance & wayfinding" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "Hospital sites drown patients in departments and jargon at the exact moment they are anxious and scanning for one answer. The information is all there; the reassurance is missing.",
  },
  solution: {
    title: "The approach",
    body: "A warm, human hero and a quiet information hierarchy that leads with reassurance, then reveals depth on demand. Care comes first, the fifty specialties come second — findable, not overwhelming.",
  },
  servicesTitle: "What this build demonstrates",
  services: [
    "Human-first hero & tone",
    "Calm information hierarchy",
    "Department wayfinding",
    "Responsive build",
    "Accessible, legible typography",
    "Appointment-intent flow",
  ],
  outcome: {
    title: "Why it exists",
    body: "A concept piece showing a large hospital can feel personal and calm online — the studio's case for designing around the patient's state of mind, not the org chart.",
  },
  shots: {
    title: "The build, on screen",
    caption: "The NovaCare concept, live on desktop and mobile.",
  },
  visit: "Visit the live site",
};

export const CASE_UNIQUIRK: CaseStudyData = {
  slug: "uniquirk",
  eyebrow: "Concept build",
  client: "Uniquirk Solutions",
  tagline: "A personal-branding concept for CXOs — a dark, sharp site that matches the pitch it sells.",
  liveUrl: "https://uniquirk.vercel.app/",
  poster: "/work/uniquirk.webp",
  meta: [
    { label: "Industry", value: "Personal Branding, B2B" },
    { label: "Focus", value: "Positioning & credibility" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "A brand that sells authority engineering can't look generic — the site is the proof of the service. A soft, templated page quietly undercuts every promise made on it.",
  },
  solution: {
    title: "The approach",
    body: "A dark, high-contrast interface with sharp type and deliberate motion, built to feel like the premium positioning it's pitching. The medium is the argument.",
  },
  servicesTitle: "What this build demonstrates",
  services: [
    "Dark, high-contrast UI",
    "Sharp, confident typography",
    "Positioning-led copy structure",
    "Responsive build",
    "Motion & interaction detail",
    "Lead-capture flow",
  ],
  outcome: {
    title: "Why it exists",
    body: "A concept piece where the site itself demonstrates the service — the studio's case for a brand that practices what it sells.",
  },
  shots: {
    title: "The build, on screen",
    caption: "The Uniquirk concept, live on desktop and mobile.",
  },
  visit: "Visit the live site",
};

/* --------------------------------------------- case study registry */
/* slug -> data, so a single dynamic route or lookup can resolve any of them. */
export const CASE_STUDIES: Record<string, CaseStudyData> = {
  asrg: CASE_ASRG,
  aurum: CASE_AURUM,
  liftx: CASE_LIFTX,
  vantara: CASE_VANTARA,
  novacare: CASE_NOVACARE,
  uniquirk: CASE_UNIQUIRK,
};

/* -------------------------------------------------- automations teaser */
/* §04b The doorway to /automations. The nav link alone left the second
 * offering invisible to anyone who simply scrolls, so the story now says it
 * out loud: the sites above are what we build, this is what makes them work
 * without you. Deliberately copy-only — the live diagrams live on the route
 * itself, and the home page cannot afford them. */
export const AUTOMATION_TEASER = {
  eyebrow: "Growth Automation Lab",
  title: "A site brings them in. A system keeps them.",
  sub: "The work above is the front door. Behind it, we wire the follow-up, qualification, booking, and reporting that used to depend on someone remembering.",
  /** a taste of the ten-system catalog, not the whole menu */
  systems: [
    "Lead capture",
    "WhatsApp assistant",
    "Appointment booking",
    "Review engine",
  ],
  cta: { label: "Step inside the Lab", href: "/automations" },
} as const;

/* The live machine that now plays inline on home. Two 3-col graphs on the same
 * grid footprint so the scroll cross-fade reads as the SAME business rewired,
 * not two unrelated diagrams — same discipline as /automations Transform. */
/* The chaos side carries STALE metas on purpose — "4 days ago",
 * "v7_final.xlsx" — so the crossfade to the wired machine reads as relief,
 * not just a re-skin. */
export const AUTOMATION_TEASER_CHAOS = serpentine(
  [
    { label: "Missed call", icon: "phone-x", meta: "3 today" },
    { label: "Sticky note", icon: "note", meta: "somewhere" },
    { label: "Forgotten", icon: "clock", meta: "4 days ago" },
    { label: "Excel", icon: "table", meta: "v7_final.xlsx" },
    { label: "Lost lead", icon: "user-minus", meta: "-" },
  ],
  3,
);
export const AUTOMATION_TEASER_ORDER = serpentine(
  [
    { label: "New lead", icon: "lead", kind: "trigger", meta: "just now", activeMeta: "capturing…", doneMeta: "captured" },
    { label: "AI qualify", icon: "ai", kind: "ai", meta: "score -", activeMeta: "thinking…", doneMeta: "score 87" },
    { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", activeMeta: "+1 row", doneMeta: "2,419 rows" },
    { label: "Auto follow-up", icon: "email", kind: "action", meta: "queued", activeMeta: "sending…", doneMeta: "sent ✓" },
    { label: "Booked", icon: "calendar", kind: "outcome", meta: "-", activeMeta: "confirming…", doneMeta: "Tue 10:00" },
  ],
  3,
  { payload: "lead" },
);

/** The captions that cross-fade with the two machines. */
export const AUTOMATION_TEASER_STATES = {
  before: {
    label: "Today",
    caption: "Every step waits on someone remembering. Miss one, the lead is gone.",
  },
  after: {
    label: "Wired",
    caption: "Every step hands off on its own. Nothing waits on memory.",
  },
} as const;

/* §04b (home) THE AUTOMATION STAGE — the dark cinematic showcase.
 * The home page's centerpiece: a scroll-driven story where four signature
 * systems each build themselves under the scrollbar, fire, and land an
 * outcome, then hand off to the live console. Same Flow dialect as
 * /automations; the copy and the console URL stay single-sourced (the URL is
 * imported from content-automations so it can never drift). The `href` beats
 * deep-link into the real, running product — the console the owner asked to
 * surface — so a visitor can run the actual tool, not just watch a diagram.
 * Metas are generic-but-true system states; no invented client numbers. */
export const HOME_AUTOMATION_STORY = {
  eyebrow: "Growth Automation Lab",
  title: "A site brings them in. A system keeps them.",
  sub: "The work above is the front door. Behind it we wire the follow-up, qualification, invoicing, and reporting that used to depend on someone remembering. Scroll — watch four of them wire themselves.",
  beats: [
    {
      id: "lead-capture",
      name: "Lead capture",
      outcome:
        "A form fill becomes a booked call — captured, scored, and followed up while you sleep.",
      href: `${A_CONSOLE_URL}/sales-os/lead-pipeline`,
      cols: 3,
      payload: "lead",
      steps: [
        { label: "Visitor", icon: "user", kind: "trigger", meta: "on your site", doneMeta: "captured" },
        { label: "Form", icon: "note", kind: "action", meta: "fill", doneMeta: "submitted" },
        { label: "AI qualify", icon: "ai", kind: "ai", meta: "score -", activeMeta: "thinking…", doneMeta: "score 87" },
        { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", activeMeta: "+1 row", doneMeta: "2,419 rows" },
        { label: "Auto follow-up", icon: "email", kind: "action", meta: "queued", activeMeta: "sending…", doneMeta: "sent ✓" },
        { label: "Booked call", icon: "calendar", kind: "outcome", meta: "-", activeMeta: "confirming…", doneMeta: "Tue 10:00" },
      ],
    },
    {
      id: "invoice",
      name: "Invoicing",
      outcome:
        "Order to paid to reconciled — no spreadsheet in the middle, no month-end scramble.",
      href: `${A_CONSOLE_URL}/business-os/invoice-generator`,
      cols: 3,
      payload: "order",
      steps: [
        { label: "Order", icon: "cart", kind: "trigger", meta: "placed", doneMeta: "received" },
        { label: "Invoice", icon: "receipt", kind: "action", meta: "drafting", activeMeta: "generating…", doneMeta: "issued" },
        { label: "Payment", icon: "card", kind: "action", meta: "pending", activeMeta: "collecting…", doneMeta: "paid ✓" },
        { label: "Reconcile", icon: "calculator", kind: "metric", meta: "open", activeMeta: "matching…", doneMeta: "matched" },
        { label: "Books", icon: "chart", kind: "outcome", meta: "-", activeMeta: "posting…", doneMeta: "up to date" },
      ],
    },
    {
      id: "marketing",
      name: "Cold outreach",
      outcome:
        "A cold list becomes warm conversations — personalized, sent, and booked without a rep touching it.",
      href: `${A_CONSOLE_URL}/sales-os/cold-email`,
      cols: 3,
      payload: "lead",
      steps: [
        { label: "List", icon: "table", kind: "trigger", meta: "imported", doneMeta: "cleaned" },
        { label: "AI writes", icon: "ai", kind: "ai", meta: "blank", activeMeta: "drafting…", doneMeta: "personalized" },
        { label: "Send", icon: "email", kind: "action", meta: "queued", activeMeta: "sending…", doneMeta: "delivered" },
        { label: "Reply", icon: "chat", kind: "app", meta: "waiting", activeMeta: "watching…", doneMeta: "replied" },
        { label: "Meeting", icon: "calendar", kind: "outcome", meta: "-", activeMeta: "booking…", doneMeta: "booked" },
      ],
    },
    {
      id: "analytics",
      name: "Reporting",
      outcome:
        "Six tabs and a guess become one live dashboard that shows the single number that matters.",
      href: `${A_CONSOLE_URL}/growth-os/analytics`,
      cols: 2,
      payload: "event",
      steps: [
        { label: "Website", icon: "globe", kind: "trigger", meta: "traffic", doneMeta: "tracked" },
        { label: "Events", icon: "pulse", kind: "app", meta: "streaming", activeMeta: "capturing…", doneMeta: "captured" },
        { label: "Dashboard", icon: "chart", kind: "metric", meta: "live", activeMeta: "aggregating…", doneMeta: "updated" },
        { label: "Insight", icon: "lightbulb", kind: "outcome", meta: "-", activeMeta: "computing…", doneMeta: "one number" },
      ],
    },
  ],
  /** the payoff — surface the live console (the owner's ask) then the full Lab */
  cta: {
    live: { label: "See all 16 systems running live", href: A_CONSOLE_URL },
    lab: { label: "Step inside the Lab", href: "/automations" },
  },
} as const;

/* ----------------------------------------------------------- branding */
/* §04c The third service, said out loud. The Build pillar names it; this
 * section sells it — claim first, mechanics second, then the Stats band right
 * below supplies the numbers. Real post screenshots slot in later (intake). */
export const BRANDING = {
  title: "Your name should open doors before you do.",
  sub: "Founders are the new media companies. We turn yours into the reason leads arrive warm.",
  moves: [
    {
      title: "Positioning",
      body: "One sharp point of view, said the same way everywhere, until the niche repeats it back.",
    },
    {
      title: "Content system",
      body: "A weekly cadence of posts written from your work, not around it. You approve, we ship.",
    },
    {
      title: "Distribution",
      body: "Comments, DMs, and the follow-up loop that turns readers into booked calls.",
    },
  ],
  cta: { label: "Watch it happen on LinkedIn", href: "https://www.linkedin.com/in/syedmukheeth/" },
} as const;

/* -------------------------------------------------------------- stats */
/* §05 Proof numbers, count-up. LinkedIn-led social proof — the audience is
 * the asset. Only `followers` is real today; the rest are tagged TODO and are
 * a one-line swap once you send the real figures from LinkedIn analytics. */
/** `value` count-ups; `text` renders verbatim (for honest non-numeric proof
 *  like a reach or a portfolio state). One or the other, never both. */
export type Stat = { value?: number; suffix?: string; decimals?: number; text?: string; label: string };

export const STATS: Stat[] = [
  { value: 8.7, decimals: 1, suffix: "K+", label: "LinkedIn followers" },
  { value: 350, suffix: "K+", label: "Monthly impressions" },
  { text: "UK & India", label: "Clients worked with" },
  { text: "Growing", label: "Premium client portfolio" },
];


/* ------------------------------------------------------ testimonials */
/* §05.5 Founder voices. Editorial pull-quotes, not cards. Placeholder copy +
 * names (mock) — swap for real founder quotes here; component does not change. */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** optional proof image (public/*.webp) — a real client, shown as a chip */
  photo?: string;
};

export const TESTIMONIALS_HEADER = {
  title: "Clients, after.",
} as const;

/* One real, verified client voice beats three invented ones. Add more here as
 * clients give quotes — the component handles any length. */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "asrg",
    quote:
      "Sampeer Studio gave us a premium storytelling website and handled our SEO and Google Business Profile professionally. Our online presence finally matches the work we do.",
    name: "ASRG Construction",
    role: "Construction & Civil · Kurnool",
    photo: "/asrg-client.webp",
  },
];

/* ------------------------------------------------------------ process */
/* §06 Diagnose -> Build -> Grow. Verb-noun, no "Stage 1". */
export type Step = { id: string; title: string; body: string };

export const PROCESS_HEADER = {
  title: "Diagnose. Build. Grow.",
} as const;

export const PROCESS: Step[] = [
  { id: "diagnose", title: "Diagnose", body: "We find why you are being overlooked. The gap between what you do and what people perceive." },
  { id: "build", title: "Build", body: "Website, growth system, and founder presence built as one connected engine, not three disconnected projects." },
  { id: "grow", title: "Grow", body: "Attention turns into trust, trust into leads, leads into revenue. We tune what the data tells us." },
];

/* -------------------------------------------------------------- about */
/* §07 Syed POV. Manifesto, not bio. */
export const ABOUT = {
  name: "Syed Abdul Mukheeth Peer",
  role: "Founder, Sampeer Studio",
  photo: "/founder.webp",
  linkedin: "https://www.linkedin.com/in/syedmukheeth/",
  manifesto: [
    "I help startups and ambitious businesses grow through premium storytelling websites, growth systems, and AI automation.",
    "Rather than simply building websites, I focus on digital experiences that build trust, attract customers, and support long-term growth.",
    "My approach combines strategy, design, SEO, automation, and conversion-focused development.",
    "Built together, they help a business stop asking for attention and start earning it.",
  ],
} as const;

/* ---------------------------------------------------------------- cta */
/* §08 Dead simple. One input, one button. */
export const CTA = {
  heading: "Tell me about your startup.",
  sub: "One message. No forms, no funnels. It comes straight to me.",
  placeholder: "you@startup.com",
  messagePlaceholder: "What are you building, and what's in the way?",
  button: "Start",
  /** where the form falls back if the send endpoint isn't configured */
  fallbackEmail: "sampeerstudio@gmail.com",
} as const;

/* ------------------------------------------------------------- footer */
export const FOOTER = {
  brand: "Sampeer Studio",
  line: "The growth layer your startup is missing.",
  email: "sampeerstudio@gmail.com",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/syedmukheeth/" },
  ],
  year: new Date().getFullYear(),
  rights: "All rights reserved.",
} as const;
