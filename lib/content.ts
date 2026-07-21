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
  /** Quiet anchor, not a button: the Nav "Start" already owns conversion, and
   *  a hero button would be a second accent strike in the same viewport. This
   *  link doubles as the scroll affordance and a 4-viewport skip to proof. */
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
    { label: "AI qualify", icon: "ai", kind: "ai", meta: "score —", activeMeta: "thinking…", doneMeta: "score 87" },
    { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", activeMeta: "+1 row", doneMeta: "2,419 rows" },
    { label: "Follow-up", icon: "email", kind: "action", meta: "queued", activeMeta: "sending…", doneMeta: "sent ✓" },
    { label: "Booked", icon: "calendar", kind: "outcome", meta: "—", activeMeta: "confirming…", doneMeta: "Tue 10:00" },
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
  },
  {
    id: "aurum",
    poster: "/work/aurum.webp",
    client: "Aurum Resorts",
    industry: "Luxury Hospitality, Maldives",
    description: "A private-island resort experience told in stillness. Villas, dining, and the sea.",
    url: "https://luxury-hotel-sooty.vercel.app/",
  },
  {
    id: "liftx",
    poster: "/work/liftx.webp",
    client: "LIFT-X",
    industry: "Fitness, Kurnool",
    description: "A premium unisex gym site built on bold type and one decision: start.",
    url: "https://lift-x-ten.vercel.app/",
  },
  {
    id: "vantara",
    poster: "/work/vantara.webp",
    client: "Vantara & Rao",
    industry: "Corporate Law, Hyderabad",
    description: "A corporate law firm positioned as a strategic partner, not a reactive counsel.",
    url: "https://law-firm-eight-livid.vercel.app/",
  },
  {
    id: "novacare",
    poster: "/work/novacare.webp",
    client: "NovaCare Medical Center",
    industry: "Healthcare, Hyderabad",
    description: "A multi-specialty hospital site that makes fifty departments feel human.",
    url: "https://healthcare-ten-orcin.vercel.app/",
  },
  {
    id: "uniquirk",
    poster: "/work/uniquirk.webp",
    client: "Uniquirk Solutions",
    industry: "Personal Branding, B2B",
    description: "LinkedIn authority engineering for CXOs, with a dark, sharp site to match the pitch.",
    url: "https://uniquirk.vercel.app/",
  },
];

/* -------------------------------------------------------- case study */
/* §04a ASRG Construction — the first full case study. Real client, real
 * on-site photos (public/asrg-client*.webp), real live site. Rendered at
 * /work/asrg; the WORK card above links here instead of straight to the
 * live site. Copy is the owner's, lightly shaped. */
export const CASE_ASRG = {
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
    body: "A premium storytelling website that puts the firm's history, projects, and process in one place — fast to load, clear on every device, and built to rank. Paired with SEO groundwork and a fully optimized Google Business Profile so ASRG shows up when Kurnool searches for a civil contractor.",
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
    caption: "On-site with the ASRG Construction team, Kurnool — where the project was signed.",
    photos: [
      { src: "/asrg-client.webp", alt: "Sampeer Studio founder shaking hands with the ASRG Construction owner" },
      { src: "/asrg-client-2.webp", alt: "Sampeer Studio founder with the ASRG Construction owner at their office" },
    ],
  },
  outcome: {
    title: "The outcome",
    body: "A modern, professional digital presence that finally matches the work — one that earns trust on first impression and lays the foundation for organic search visibility and inbound leads.",
  },
  visit: "Visit the live site",
} as const;

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
    { label: "Lost lead", icon: "user-minus", meta: "—" },
  ],
  3,
);
export const AUTOMATION_TEASER_ORDER = serpentine(
  [
    { label: "New lead", icon: "lead", kind: "trigger", meta: "just now", activeMeta: "capturing…", doneMeta: "captured" },
    { label: "AI qualify", icon: "ai", kind: "ai", meta: "score —", activeMeta: "thinking…", doneMeta: "score 87" },
    { label: "CRM", icon: "crm", kind: "metric", meta: "2,418 rows", activeMeta: "+1 row", doneMeta: "2,419 rows" },
    { label: "Auto follow-up", icon: "email", kind: "action", meta: "queued", activeMeta: "sending…", doneMeta: "sent ✓" },
    { label: "Booked", icon: "calendar", kind: "outcome", meta: "—", activeMeta: "confirming…", doneMeta: "Tue 10:00" },
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
