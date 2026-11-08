/**
 * SINGLE SOURCE OF CONTENT for the whole site.
 * Components read from here, no copy hardcoded in JSX. The site speaks as the
 * studio ("we"); the founder section and the footer credit are Syed's own
 * first person. No line claims a team size either way.
 *
 * Every image referenced here is a local /public asset, no remote hosts, so
 * next/image needs no remotePatterns and never fetches third-party bytes.
 */

import { A_CONSOLE_URL } from "@/lib/content-automations";

/* ------------------------------------------------------------ socials */
export const SOCIALS = {
  linkedin: {
    label: "LinkedIn",
    handle: "in/syedmukheeth",
    href: "https://www.linkedin.com/in/syedmukheeth/",
  },
  instagram: {
    label: "Instagram",
    handle: "@syedmukheeth.29",
    href: "https://www.instagram.com/syedmukheeth.29/",
  },
  studioInstagram: {
    label: "Studio Instagram",
    handle: "@sampeer.studio",
    href: "https://www.instagram.com/sampeer.studio/",
  },
  site: {
    label: "Personal site",
    handle: "syedmukheeth.is-a.dev",
    href: "https://www.syedmukheeth.is-a.dev/",
  },
} as const;

/* ---------------------------------------------------------------- nav */
/* Root-relative hashes so the same links work from /work/* and /automations. */
export const NAV = {
  brand: "SAMPeer Studio",
  links: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Clients", href: "/#clients" },
    { label: "About", href: "/#about" },
  ],
  /* One label per intent, page-wide: the hero's primary CTA says the same. */
  cta: { label: "Start a project", href: "/#contact" },
} as const;

/* --------------------------------------------------------------- hero */
/* The night diptych: the statement and the plain offer on one side, the
 * founder film on the other. The last line is the one orange strike. */
export const HERO = {
  lines: ["Get noticed.", "Remembered."],
  accent: "Chosen.",
  offer: "Websites, automation and founder brands for companies in India and the UK.",
  place: "Kurnool → UK & India",
  primary: { label: "Start a project", href: "#contact" },
  secondary: { label: "See the work", href: "#work" },
} as const;

/** The founder film. Cut from Syed's own footage: the city (Konda Reddy fort),
 *  the craft (his desk), the client (ASRG's owner seeing his new site), graded
 *  black and white and framed 4:5. One file serves every screen. Versioned
 *  names so the files can be cached forever. */
export const FILM = {
  label: "Founder film: a day of work in Kurnool",
  pause: "Pause the film",
  play: "Play the film",
  src: "/film/hero.v2.mp4",
  poster: "/film/hero.v2.webp",
  w: 720,
  h: 900,
} as const;

/** Chapter labels, numbered in page order. Each rides the ink hairline that
 *  opens its chapter. */
export const CHAPTERS = {
  services: { index: "01", label: "What we do" },
  work: { index: "02", label: "Selected work" },
  clients: { index: "03", label: "Clients" },
  automation: { index: "04", label: "Systems, running" },
  process: { index: "05", label: "How we work" },
  founder: { index: "06", label: "Behind the studio" },
  contact: { index: "07", label: "Start a project" },
} as const;

export type Chapter = { index: string; label: string };

/* -------------------------------------------------------------- stats */
/** `value` renders as a number; `text` renders verbatim for honest
 *  non-numeric proof. One or the other, never both. */
export type Stat = { value?: number; suffix?: string; decimals?: number; text?: string; label: string };

export const STATS: Stat[] = [
  { value: 9, label: "Live sites shipped" },
  { value: 8.7, decimals: 1, suffix: "K+", label: "LinkedIn followers" },
  { value: 350, suffix: "K+", label: "Monthly impressions" },
  { text: "UK & India", label: "Clients worked with" },
];

/** The typographic client line beside the stats: real clients only, the ones
 *  with live work below. */
export const PROOF = {
  trustedBy: "Trusted by",
  clients: ["Suri Mansoor Ali Khan", "ASRG Construction", "MAA Furniture"],
} as const;

/* --------------------------------------------------------------- work */
/* Every project is live. Client work and the product are real; concept builds
 * are self-initiated sites for fictional brands and are labelled as such.
 * Posters are 1440x900 captures in public/work/. */
export type ProjectKind = "client" | "product" | "concept";

export type LiveProject = {
  id: string;
  kind: ProjectKind;
  client: string;
  category: string;
  description: string;
  url: string;
  poster: string;
  /** internal case-study route, shown as a second link when set */
  caseStudy?: string;
};

export const WORK_HEADER = {
  eyebrow: "Selected work",
  title: "Nine live sites. Open any of them.",
} as const;

export const WORK_GROUPS: { kind: ProjectKind; title: string; note: string }[] = [
  { kind: "client", title: "Client work", note: "Real businesses and people, live today." },
  { kind: "product", title: "Product", note: "The studio's own SaaS, in public beta." },
  {
    kind: "concept",
    title: "Concept builds",
    note: "Self-initiated sites that show range. The brands are fictional, the builds are real and live.",
  },
];

export const WORK: LiveProject[] = [
  {
    id: "suri",
    kind: "client",
    client: "Suri Mansoor Ali Khan",
    category: "Public figure · Kurnool",
    description:
      "A public record of a community leader's work, with every entry linked to the press that reported it.",
    url: "https://suri-mansoor-ali-khan.vercel.app/",
    poster: "/work/suri.webp",
  },
  {
    id: "asrg",
    kind: "client",
    client: "ASRG Construction",
    category: "Construction & civil · Kurnool",
    description:
      "Brand site, SEO and Google Business Profile for a 46-year civil contracting firm. Projects, process and enquiry in one place.",
    url: "https://www.asrgcontruction.com/",
    poster: "/work/asrg.webp",
    caseStudy: "/work/asrg",
  },
  {
    id: "maa",
    kind: "client",
    client: "MAA Furniture",
    category: "Furniture retail · Kurnool",
    description:
      "Online store and showroom site for a handcrafted furniture maker. Shop the range, design a custom piece, plan a visit.",
    url: "https://www.maafurniture.shop/",
    poster: "/work/maa.webp",
  },
  {
    id: "business-sos",
    kind: "product",
    client: "Business SOS",
    category: "SaaS · Content & business OS",
    description:
      "The studio's own product. It audits a brand's Instagram and LinkedIn, plans and scripts the content, briefs the crew on WhatsApp, and keeps GST invoices and stock in order.",
    url: "https://social-business-ruby.vercel.app/",
    poster: "/work/business-sos.webp",
  },
  {
    id: "aurum",
    kind: "concept",
    client: "Aurum Resorts",
    category: "Luxury hospitality",
    description: "A private-island resort experience told in stillness. Villas, dining, and the sea.",
    url: "https://luxury-hotel-sooty.vercel.app/",
    poster: "/work/aurum.webp",
    caseStudy: "/work/aurum",
  },
  {
    id: "liftx",
    kind: "concept",
    client: "LIFT-X",
    category: "Fitness",
    description: "A premium unisex gym site built on bold type and one decision: start.",
    url: "https://lift-x-ten.vercel.app/",
    poster: "/work/liftx.webp",
    caseStudy: "/work/liftx",
  },
  {
    id: "vantara",
    kind: "concept",
    client: "Vantara & Rao",
    category: "Corporate law",
    description: "A corporate law firm positioned as a strategic partner, not a reactive counsel.",
    url: "https://law-firm-eight-livid.vercel.app/",
    poster: "/work/vantara.webp",
    caseStudy: "/work/vantara",
  },
  {
    id: "novacare",
    kind: "concept",
    client: "NovaCare Medical Center",
    category: "Healthcare",
    description: "A multi-specialty hospital site that makes fifty departments feel human.",
    url: "https://healthcare-ten-orcin.vercel.app/",
    poster: "/work/novacare.webp",
    caseStudy: "/work/novacare",
  },
  {
    id: "uniquirk",
    kind: "concept",
    client: "Uniquirk Solutions",
    category: "Personal branding, B2B",
    description: "LinkedIn authority engineering for CXOs, with a dark, sharp site to match the pitch.",
    url: "https://uniquirk.vercel.app/",
    poster: "/work/uniquirk.webp",
    caseStudy: "/work/uniquirk",
  },
];

/* -------------------------------------------------------- case study */
/* §04a Case studies, data-driven. One shape, two visual variants:
 *  - `gallery`, real on-site photos (ASRG only, a real client).
 *  - `shots`  , desktop + mobile captures of the live site (the five concept
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
    /** `w`/`h` are the file's real pixel dimensions; the grid gives each figure
     *  that exact ratio so `object-cover` has nothing to crop. */
    photos: { src: string; w: number; h: number; alt: string; caption: string }[];
  };
  /** live-site proof, desktop still (the poster) + a live phone-frame render.
   *  Both are derived from existing fields (poster, liveUrl); this only carries
   *  the section's copy, so there are no separate capture files to source. */
  shots?: {
    title: string;
    caption: string;
  };
};

/* ASRG Construction, the first full case study. Real client, real on-site
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
    /* `w`/`h` are the files' real pixel dimensions, and the grid sizes each
       figure from them. The gallery used to force every photo into one 4:5
       portrait box with object-cover, which is fine while every photo is
       portrait and silently amputates people the moment one is not. */
    photos: [
      { src: "/asrg-client.webp", w: 900, h: 1125, alt: "Syed Mukheeth shaking hands with the ASRG Construction owner", caption: "Sealing the project" },
      { src: "/asrg-team.webp", w: 1072, h: 1200, alt: "Syed Mukheeth with the ASRG Construction owner at his office in Kurnool", caption: "With the owner, Kurnool" },
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
 * testimonials. The challenge/solution read as design rationale, the problem
 * the *category* faces, and the decision the build makes about it. Visual proof
 * is the local poster plus the live embedded site. */

export const CASE_AURUM: CaseStudyData = {
  slug: "aurum",
  eyebrow: "Concept build",
  client: "Aurum Resorts",
  tagline: "A private-island resort concept told in stillness, where the design does the selling by getting out of the way.",
  liveUrl: "https://luxury-hotel-sooty.vercel.app/",
  poster: "/work/aurum.webp",
  meta: [
    { label: "Industry", value: "Luxury Hospitality" },
    { label: "Focus", value: "Brand & booking experience" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "Most resort sites shout: carousels, badges, ten offers above the fold. Luxury reads as restraint, and the louder a site is, the cheaper the room feels. The problem to solve was making a screen feel expensive.",
  },
  solution: {
    title: "The approach",
    body: "One image at a time, generous negative space, and type that never hurries. The villas, the dining, and the sea each get room to breathe, so the site sells the way a private island does, by slowing you down.",
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
    body: "A concept piece that proves a hospitality brand can feel five-star on the first scroll, the studio's case for stillness as a sales tool, not a compromise.",
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
    body: "Gym sites bury the one action that matters, joining, under class timetables, pricing tiers, and stock photos of equipment. The visitor already knows they should train. They need a reason to act today.",
  },
  solution: {
    title: "The approach",
    body: "Oversized, confident type carries the whole site, and every section funnels toward one CTA. No hedging, no ten menu items, just momentum and a single decision made easy.",
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
    body: "A concept piece showing how far a fitness brand gets on type and focus alone, proof the studio can build energy without clutter.",
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
    body: "A restrained, confident identity, serious typography, deliberate structure, and copy that speaks like a partner across the table. The design signals judgment before a single case is read.",
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
    body: "A concept piece proving a professional-services firm can look like the partner it claims to be, the studio's case for positioning over decoration.",
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
    body: "A warm, human hero and a quiet information hierarchy that leads with reassurance, then reveals depth on demand. Care comes first, the fifty specialties come second, findable, not overwhelming.",
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
    body: "A concept piece showing a large hospital can feel personal and calm online, the studio's case for designing around the patient's state of mind, not the org chart.",
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
  tagline: "A personal-branding concept for CXOs, a dark, sharp site that matches the pitch it sells.",
  liveUrl: "https://uniquirk.vercel.app/",
  poster: "/work/uniquirk.webp",
  meta: [
    { label: "Industry", value: "Personal Branding, B2B" },
    { label: "Focus", value: "Positioning & credibility" },
    { label: "Type", value: "Concept site" },
  ],
  challenge: {
    title: "The challenge",
    body: "A brand that sells authority engineering can't look generic, the site is the proof of the service. A soft, templated page quietly undercuts every promise made on it.",
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
    body: "A concept piece where the site itself demonstrates the service, the studio's case for a brand that practices what it sells.",
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

/* --------------------------------------------------------- automation */
/* Four signature systems, one live Flow diagram at a time. `href` deep-links
 * into the real, running console so a visitor can open the actual tool.
 * Metas are generic-but-true system states; no invented client numbers. */
export const HOME_AUTOMATION_STORY = {
  eyebrow: "Growth systems",
  title: "A site brings them in. A system keeps them.",
  sub: "Behind the site we wire the follow-up, qualification, invoicing and reporting that used to depend on someone remembering. Here are four of them, built and running.",
  beats: [
    {
      id: "lead-capture",
      name: "Lead capture",
      outcome: "A form fill becomes a booked call, captured, scored and followed up while you sleep.",
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
      outcome: "Order to paid to reconciled, no spreadsheet in the middle, no month-end scramble.",
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
      outcome: "A cold list becomes warm conversations, personalized, sent and booked without a rep touching it.",
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
      outcome: "Six tabs and a guess become one live dashboard that shows the single number that matters.",
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
  cta: {
    line: "Sixteen of these are already running. Go open one.",
    live: { label: "See all 16 systems running live", href: A_CONSOLE_URL },
    lab: { label: "Step inside the Lab", href: "/automations" },
    tryIt: "Try it live",
  },
} as const;

/* ------------------------------------------------------ founder brand */
export const BRANDING = {
  eyebrow: "Founder brand",
  title: "Your name should open doors before you do.",
  sub: "Founders are the new media companies. Syed builds his in public, and we build yours the same way.",
  moves: [
    {
      title: "Positioning",
      body: "One sharp point of view, said the same way everywhere, until the niche repeats it back.",
    },
    {
      title: "Content system",
      body: "A weekly cadence of posts and reels written from your work, not around it. You approve, we ship.",
    },
    {
      title: "Distribution",
      body: "Comments, DMs and the follow-up loop that turns readers into booked calls.",
    },
  ],
  linkedin: {
    headline: "Founder, SAMPeer Studio · Storytelling websites, growth systems & AI automation",
    stats: [
      { value: "8.7K+", label: "followers" },
      { value: "350K+", label: "monthly views" },
    ],
  },
} as const;

/** Instagram reels, newest first. Add one by pasting its code from the reel
 *  URL (instagram.com/reel/<code>/) and dropping a 9:16 still at
 *  public/reels/<code>.webp. */
export const REELS = [
  {
    code: "Dd6zBdJSP-G",
    account: "@syedmukheeth.29",
    caption: "One client. Still in college. Here's how.",
    poster: "/reels/Dd6zBdJSP-G.webp",
  },
] as const;

/* ------------------------------------------------- home case study */
/* The one case study the home page goes deep on. Challenge and solution come
 * from CASE_ASRG, the quote and photos from TESTIMONIAL; this only carries the
 * block's own labels. */
export const HOME_CASE = {
  eyebrow: "Case study",
  challengeLabel: "Where they were",
  solutionLabel: "What we built",
  link: { label: "Read the case study", href: "/work/asrg" },
} as const;

/* -------------------------------------------------------- testimonial */
export const TESTIMONIAL = {
  quote:
    "SAMPeer Studio gave us a premium storytelling website and handled our SEO and Google Business Profile professionally. Our online presence finally matches the work we do.",
  name: "ASRG Construction",
  role: "Construction & civil · Kurnool",
  photo: "/client-asrg.webp",
  photoAlt: "Syed Mukheeth with the ASRG Construction owner at his office in Kurnool",
  photoSecondary: "/asrg-client.webp",
  photoSecondaryAlt: "Syed Mukheeth shaking hands with the ASRG Construction owner",
} as const;

/* ------------------------------------------------------------ clients */
/* What two clients told us on camera, condensed and translated from Urdu.
 * Each statement keeps only what they actually said (checked against the
 * transcripts); nothing is added. The loops are four silent seconds of each
 * client, cropped to the client and Syed, with no audio track and no
 * location metadata. */
export type ClientWord = {
  slug: string;
  name: string;
  role: string;
  place: string;
  statement: string;
  loop: string;
  poster: string;
  /** links the client to a project in WORK */
  workId: string;
};

export const CLIENTS_HEADER = {
  title: "Clients, in their words.",
  sub: "What they told us on camera, in Kurnool.",
  note: "Condensed and translated from Urdu.",
} as const;

export const CLIENTS: ClientWord[] = [
  {
    slug: "maa",
    name: "MAA Furniture",
    role: "Owners, furniture retail",
    place: "Kurnool",
    statement:
      "Since the website went live, more customers come in and business has grown. SAMPeer took our second branch online, put our furniture in the store and made our video.",
    loop: "/clients/maa.v1.mp4",
    poster: "/clients/maa.v1.webp",
    workId: "maa",
  },
  {
    slug: "asrg",
    name: "S. Gilani",
    role: "Owner, ASRG Construction",
    place: "Kurnool",
    statement:
      "They set up our SEO properly. Now every project we have built shows up on Google. I tell everyone to use them.",
    loop: "/clients/asrg.v1.mp4",
    poster: "/clients/asrg.v1.webp",
    workId: "asrg",
  },
];

/* ------------------------------------------------------------ process */
export const PROCESS_HEADER = {
  label: "What happens next",
  title: "Diagnose. Build. Grow.",
  sub: "Every engagement runs the same three steps, whichever service you start with.",
} as const;

export const PROCESS = [
  { id: "diagnose", title: "Diagnose", body: "We find why you're being overlooked: the gap between what you do and what people see." },
  { id: "build", title: "Build", body: "Website, growth system and founder presence, built as one connected engine, not three projects." },
  { id: "grow", title: "Grow", body: "Attention turns into trust, trust into leads, leads into revenue. We tune whatever the data says." },
] as const;

/* -------------------------------------------------------------- about */
export const FOUNDER = {
  name: "Syed Abdul Mukheeth Peer",
  role: "Founder, SAMPeer Studio",
  photo: "/founder.webp",
  photoPosition: "center 30%",
} as const;

/** The founder chapter's photographs and film tile. Picked from Syed's own
 *  shoot; every file was re-encoded with its location metadata stripped. */
export const FOUNDER_MEDIA = {
  portrait: {
    src: "/founder/portrait.v1.webp",
    w: 1350,
    h: 1800,
    alt: "Syed Mukheeth in a white shirt against a flowering hedge",
  },
  wide: {
    src: "/founder/headphones.v1.webp",
    w: 1800,
    h: 1350,
    alt: "Syed Mukheeth outdoors, headphones around his neck, looking up at the sky",
  },
  film: { src: "/founder/night.v1.mp4", poster: "/founder/night.v1.webp", label: "Syed Mukheeth at night" },
} as const;

/** The one section in Syed's own voice. */
export const ABOUT = {
  title: "The founder behind SAMPeer.",
  body: [
    "I'm Syed Mukheeth. I started SAMPeer Studio in Kurnool to make good businesses impossible to overlook.",
    "I lead every project personally: the strategy, the story, the build and the systems behind it. You talk to me from the first call to launch day.",
    "Do it right, and a business stops asking for attention and starts earning it.",
  ],
} as const;

/** The problem chapter: the reader's situation, said plainly, then the turn. */
export const PROBLEM = {
  statement: "Your product is good. Nobody has heard of it yet.",
  turn: "That was never a product problem. We fix it three ways, and each one works on its own.",
} as const;

/* -------------------------------------------------------------- offer */
/* What the studio sells, said plainly enough to buy from. Built from the
 * S, A and M of the name; every deliverable is something the studio already
 * ships (see the work, the automation console and the founder brand). No
 * prices and no invented timelines: both are agreed on the first call. */
export const OFFER = {
  labels: {
    get: "What you get",
    timeline: "Timeline",
    need: "What we need from you",
    start: "Start with this",
  },
  packages: [
    {
      id: "websites",
      letter: "S",
      name: "Storytelling website",
      outcome: "A site that earns a stranger's trust in ninety seconds.",
      deliverables: [
        "Positioning and the story the whole site tells",
        "Design and build, fast and clear on every screen",
        "Copy written with you, not handed to you",
        "SEO and Google Business Profile, set up properly",
        "Launch, domain and analytics wired in",
      ],
      timeline: "Agreed on the first call and written down before we start.",
      need: ["Your logo and photos of your work", "One call about who your customers are"],
      proof: { label: "See the sites", href: "#work" },
      prefill: "I'd like a storytelling website.",
    },
    {
      id: "automation",
      letter: "A",
      name: "Growth systems and automation",
      outcome: "Leads followed up while you sleep. Admin that runs itself.",
      deliverables: [
        "Lead capture that qualifies and follows up on its own",
        "Invoicing and payments without the spreadsheet",
        "Cold outreach, personalised and booked",
        "One live dashboard with the number that matters",
      ],
      timeline: "Scoped per system on the first call.",
      need: ["A walk through how work moves today", "Access to the tools you already use"],
      proof: { label: "Watch one run", href: "#automation" },
      prefill: "I'd like a growth system or automation.",
    },
    {
      id: "brand",
      letter: "M",
      name: "Founder brand",
      outcome: "Your name opens doors before you do.",
      deliverables: [
        "Positioning: one sharp point of view, said everywhere",
        "A weekly content system of posts and reels from your work",
        "You approve, we ship",
        "Distribution: comments, DMs and the follow-up loop",
      ],
      timeline: "A monthly rhythm, set together on the first call.",
      need: ["Your opinions and your stories", "A little time on camera"],
      proof: { label: "Follow the build on LinkedIn", href: SOCIALS.linkedin.href },
      prefill: "I'd like help building my founder brand.",
    },
  ],
  peer: {
    word: "Peer",
    title: "We stay after launch.",
    body: "Not a vendor you brief. A peer: in it with you, straight with you, and still answering after the site is live.",
    photo: "/asrg-client.webp",
    photoAlt: "Syed Mukheeth shaking hands with the ASRG Construction owner",
  },
} as const;

export type OfferPackage = (typeof OFFER.packages)[number];

/* ---------------------------------------------------------------- cta */
/* The resolution of the hero's three beats: noticed, remembered, chosen. */
export const CTA = {
  heading: "Ready to be chosen?",
  sub: "Tell us what you need. It goes straight to the founder.",
  placeholder: "you@company.com",
  /** Required. Email is the reply path, the number is the one that gets a
   *  lead called the same day. */
  phonePlaceholder: "Phone or WhatsApp",
  messagePlaceholder: "What do you need built?",
  button: "Send",
  /** where the form falls back if the send endpoint isn't configured */
  fallbackEmail: "sampeerstudio@gmail.com",
  /** the way out for people who will never fill a form */
  direct: "Or email the studio at",
  /** beside the form on home: the direct ways in */
  details: [
    { label: "Email", value: "sampeerstudio@gmail.com", href: "mailto:sampeerstudio@gmail.com" },
    { label: "Instagram", value: "@sampeer.studio", href: "https://www.instagram.com/sampeer.studio/" },
    { label: "Studio", value: "Kurnool, Andhra Pradesh" },
    { label: "Clients in", value: "India and the UK" },
  ],
} as const;

/* ------------------------------------------------------------- footer */
/* The curtain footer, after the Suri Mansoor Ali Khan site: a top row, the
 * wordmark rising into view, then the credit row. */
export const FOOTER = {
  brand: "SAMPeer Studio",
  /** the wordmark splits so the second word can sit a tone down */
  mark: ["SAMPeer", "Studio"],
  location: "Kurnool, Andhra Pradesh",
  line: "Let's make you impossible to overlook.",
  email: "sampeerstudio@gmail.com",
  top: "Back to top",
  credit: { kicker: "Designed and built by", name: "Syed Mukheeth" },
  buttons: [
    { id: "linkedin", label: SOCIALS.linkedin.label, href: SOCIALS.linkedin.href, accent: true },
    { id: "instagram", label: SOCIALS.instagram.label, href: SOCIALS.instagram.href, accent: false },
  ],
  links: [
    { label: "Automations", href: "/automations", external: false },
    { label: SOCIALS.studioInstagram.handle, href: SOCIALS.studioInstagram.href, external: true },
  ],
  year: new Date().getFullYear(),
} as const;
