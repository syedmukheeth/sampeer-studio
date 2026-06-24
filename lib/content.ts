/**
 * SINGLE SOURCE OF CONTENT for the whole page.
 * Components read from here — no copy hardcoded in JSX.
 *
 * PLACEHOLDER STATUS (Phase 1): client names, outcomes, numbers, and images
 * are stand-ins. All mock numbers are tagged `// mock`. All images use
 * Picsum seeds. Swap real assets/data here later; components do not change.
 *
 * Image helper: stockImg(seed, w, h) -> deterministic Picsum URL.
 */

export function stockImg(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/* ---------------------------------------------------------------- nav */
export const NAV = {
  brand: "Sampeer Studio",
  links: [
    { label: "Work", href: "#work" },
    { label: "Approach", href: "#build" },
    { label: "About", href: "#about" },
  ],
  cta: { label: "Start", href: "#contact" },
} as const;

/* --------------------------------------------------------------- hero */
/* §01 The Verdict — one statement, no CTA, demands the scroll. */
export const HERO = {
  // headline split so the accent word can be styled in JSX
  lead: "Most startups don't fail.",
  accent: "They go unnoticed.",
  // quiet follow line, kept under the 20-word cap
  sub: "We build the growth layer that makes founders impossible to ignore.",
} as const;

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
/* §03 Three pillars as outcomes, not deliverables. Sticky-stack. */
export type Pillar = {
  id: string;
  index: string;
  title: string;
  outcome: string;
  body: string;
  image: string;
};

export const PILLARS: Pillar[] = [
  {
    id: "story",
    index: "01",
    title: "Storytelling Website",
    outcome: "Strangers start trusting you in ninety seconds.",
    body: "Not a template. An experience that carries your vision, earns belief, and turns visitors into believers before they ever talk to you.",
    image: stockImg("sampeer-story", 1200, 1400),
  },
  {
    id: "growth",
    index: "02",
    title: "Growth System",
    outcome: "Leads arrive, qualify, and book themselves.",
    body: "Capture, CRM, AI qualification, follow-up, and booking wired into one engine. Automation is a part of it. Revenue is the point.",
    image: stockImg("sampeer-growth", 1200, 1400),
  },
  {
    id: "founder",
    index: "03",
    title: "Founder Brand",
    outcome: "Your name opens doors before you do.",
    body: "Founders are the new media companies. We build the presence and authority that pull opportunities toward you instead of chasing them.",
    image: stockImg("sampeer-founder", 1200, 1400),
  },
];

/* --------------------------------------------------------------- work */
/* §04 Real work, horizontal scroll. Featured + grid. */
export type CaseStudy = {
  id: string;
  client: string;
  category: string;
  outcome: string;
  image: string;
  featured: boolean;
};

export const WORK: CaseStudy[] = [
  { id: "w1", client: "Hearthwell", category: "Storytelling Website", outcome: "Rebuilt the story. Demo requests tripled in six weeks.", image: stockImg("work-hearthwell", 1400, 1000), featured: true }, // mock outcome
  { id: "w2", client: "Cadence Labs", category: "Growth System", outcome: "Lead-to-call time dropped from days to minutes.", image: stockImg("work-cadence", 1400, 1000), featured: true }, // mock
  { id: "w3", client: "Northbeam", category: "Founder Brand", outcome: "Founder went from silent to a known voice in the niche.", image: stockImg("work-northbeam", 1400, 1000), featured: true }, // mock
  { id: "w4", client: "Pendel", category: "Storytelling Website", outcome: "A site that finally felt as serious as the product.", image: stockImg("work-pendel", 1200, 900), featured: false },
  { id: "w5", client: "Vellum", category: "Growth System", outcome: "Booking and follow-up running without a human in the loop.", image: stockImg("work-vellum", 1200, 900), featured: false },
  { id: "w6", client: "Studio Mora", category: "Storytelling Website", outcome: "Cut the bounce, kept the visitors reading.", image: stockImg("work-mora", 1200, 900), featured: false },
  { id: "w7", client: "Riverforge", category: "Growth System", outcome: "Every lead scored and routed automatically.", image: stockImg("work-riverforge", 1200, 900), featured: false },
  { id: "w8", client: "Atlas Owl", category: "Founder Brand", outcome: "Inbound that used to take cold outreach.", image: stockImg("work-atlasowl", 1200, 900), featured: false },
  { id: "w9", client: "Lumen Cooperative", category: "Storytelling Website", outcome: "A homepage that closes before the call.", image: stockImg("work-lumen", 1200, 900), featured: false },
  { id: "w10", client: "Tideglass", category: "Growth System", outcome: "One dashboard for the whole funnel.", image: stockImg("work-tideglass", 1200, 900), featured: false },
];

/* -------------------------------------------------------------- stats */
/* §05 Proof numbers, count-up. All mock until real data lands. */
export type Stat = { value: number; suffix?: string; label: string };

export const STATS: Stat[] = [
  { value: 10, label: "Websites shipped" }, // mock
  { value: 10, label: "Growth systems built" }, // mock
  { value: 32, suffix: "+", label: "Automations deployed" }, // mock
  { value: 24, label: "Founders served" }, // mock
];

/* ------------------------------------------------------------ process */
/* §06 Diagnose -> Build -> Grow. Verb-noun, no "Stage 1". */
export type Step = { id: string; title: string; body: string };

export const PROCESS: Step[] = [
  { id: "diagnose", title: "Diagnose", body: "We find why you are being overlooked. The gap between what you do and what people perceive." },
  { id: "build", title: "Build", body: "Website, growth system, and founder presence built as one connected engine, not three disconnected projects." },
  { id: "grow", title: "Grow", body: "Attention turns into trust, trust into leads, leads into revenue. We tune what the data tells us." },
];

/* -------------------------------------------------------------- about */
/* §07 Syed POV. Manifesto, not bio. */
export const ABOUT = {
  name: "Syed",
  role: "Founder, Sampeer Studio",
  photo: stockImg("syed-portrait", 900, 1100),
  linkedin: "https://www.linkedin.com/", // TODO: real profile
  manifesto: [
    "I started Sampeer because I watched good startups die quietly.",
    "Not from bad products. From being unseen.",
    "I believe growth is not a hack. It is a story people can trust, a system that never sleeps, and a founder worth following.",
    "Build those three together and a startup stops asking for attention. It starts earning it.",
  ],
} as const;

/* ---------------------------------------------------------------- cta */
/* §08 Dead simple. One input, one button. */
export const CTA = {
  heading: "Tell me about your startup.",
  sub: "One message. No forms, no funnels. It comes straight to me.",
  placeholder: "you@startup.com",
  button: "Start",
  // wire to Calendly or mailto later
  action: "mailto:hello@sampeerstudio.com", // TODO: real endpoint
} as const;

/* ------------------------------------------------------------- footer */
export const FOOTER = {
  brand: "Sampeer Studio",
  line: "The growth layer your startup is missing.",
  email: "hello@sampeerstudio.com", // TODO: real
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // TODO
    { label: "X", href: "https://x.com/" }, // TODO
  ],
  year: new Date().getFullYear(),
} as const;
