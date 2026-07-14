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
/* §04 Real work, horizontal scroll. Each card embeds the live site itself
 * (scaled iframe) — the project's own hero animation is the showcase.
 * Descriptions state what the site is; no invented metrics. */
export type LiveProject = {
  id: string;
  client: string;
  industry: string;
  description: string;
  url: string;
};

export const WORK_HEADER = {
  eyebrow: "Real work",
  title: "Six live sites. Step inside any of them.",
} as const;

export const WORK: LiveProject[] = [
  {
    id: "asrg",
    client: "ASRG Construction",
    industry: "Construction & Civil — Kurnool",
    description: "Full brand site for a 46-year civil contracting firm — projects, process, and enquiry in one place.",
    url: "https://www.asrgcontruction.com/",
  },
  {
    id: "aurum",
    client: "Aurum Resorts",
    industry: "Luxury Hospitality — Maldives",
    description: "A private-island resort experience told in stillness — villas, dining, and the sea.",
    url: "https://luxury-hotel-sooty.vercel.app/",
  },
  {
    id: "liftx",
    client: "LIFT-X",
    industry: "Fitness — Kurnool",
    description: "A premium unisex gym site built on bold type and one decision: start.",
    url: "https://lift-x-ten.vercel.app/",
  },
  {
    id: "vantara",
    client: "Vantara & Rao",
    industry: "Corporate Law — Hyderabad",
    description: "A corporate law firm positioned as a strategic partner, not a reactive counsel.",
    url: "https://law-firm-eight-livid.vercel.app/",
  },
  {
    id: "novacare",
    client: "NovaCare Medical Center",
    industry: "Healthcare — Hyderabad",
    description: "A multi-specialty hospital site that makes fifty departments feel human.",
    url: "https://healthcare-ten-orcin.vercel.app/",
  },
  {
    id: "uniquirk",
    client: "Uniquirk Solutions",
    industry: "Personal Branding — B2B",
    description: "LinkedIn authority engineering for CXOs — a dark, sharp site to match the pitch.",
    url: "https://uniquirk.vercel.app/",
  },
];

/* -------------------------------------------------------------- stats */
/* §05 Proof numbers, count-up. LinkedIn-led social proof — the audience is
 * the asset. Only `followers` is real today; the rest are tagged TODO and are
 * a one-line swap once you send the real figures from LinkedIn analytics. */
export type Stat = { value: number; suffix?: string; decimals?: number; label: string };

export const STATS: Stat[] = [
  { value: 8.6, decimals: 1, suffix: "K+", label: "LinkedIn followers" }, // REAL
  { value: 250, suffix: "K+", label: "Monthly impressions" }, // TODO real (LinkedIn analytics)
  { value: 40, suffix: "+", label: "Posts that landed" }, // TODO real
  { value: 30, suffix: "+", label: "Founders in the DMs" }, // TODO real
];

/** Eyebrow for the proof band — frames the numbers as reach, not vanity. */
export const STATS_EYEBROW = "The audience";

/* ------------------------------------------------------ testimonials */
/* §05.5 Founder voices. Editorial pull-quotes, not cards. Placeholder copy +
 * names (mock) — swap for real founder quotes here; component does not change. */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const TESTIMONIALS_EYEBROW = "In their words";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We had the product. We didn't have the words. Sampeer found them, and suddenly the right people were paying attention.",
    name: "Maya Okafor", // mock
    role: "Founder, Hearthwell",
  },
  {
    id: "t2",
    quote:
      "Leads used to sit for days. Now they qualify and book themselves before I'm even at my desk.",
    name: "Daniel Rhee", // mock
    role: "CEO, Cadence Labs",
  },
  {
    id: "t3",
    quote:
      "I went from invisible to the name people drop in the niche. That's not marketing. That's leverage.",
    name: "Priya Nair", // mock
    role: "Founder, Northbeam",
  },
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
