/**
 * SINGLE SOURCE OF CONTENT for the whole page.
 * Components read from here, no copy hardcoded in JSX.
 * Launch content lives here so components stay focused on presentation.
 *
 * Every image referenced here is a local /public asset, no remote hosts, so
 * next/image needs no remotePatterns and never fetches third-party bytes.
 */

/* ---------------------------------------------------------------- nav */
/* Root-relative hashes so the same links work from /work/* and /automations. */
export const NAV = {
  brand: "SAMPeer Studio",
  links: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
  ],
  cta: { label: "Contact", href: "/#contact" },
} as const;

/* --------------------------------------------------------------- hero */
export const HERO = {
  eyebrow: "SAMPeer Studio · Kurnool, India",
  title: "Websites that do the work justice.",
  sub: "We design and build websites for businesses and public figures. Here is what we've shipped.",
  ctaPrimary: { label: "Start a project", href: "#contact" },
  cta: { label: "See the work", href: "#work" },
} as const;

/* --------------------------------------------------------------- work */
/* Real, live client sites only. Descriptions state what the site is; no
 * invented metrics. Posters are 1440x900 captures in public/work/. */
export type LiveProject = {
  id: string;
  client: string;
  category: string;
  description: string;
  url: string;
  poster: string;
  /** internal case-study route, shown as a second link when set */
  caseStudy?: string;
};

export const WORK_HEADER = {
  title: "Selected work",
} as const;

export const WORK: LiveProject[] = [
  {
    id: "suri",
    client: "Suri Mansoor Ali Khan",
    category: "Public figure · Kurnool",
    description:
      "A public record of a community leader's work, with every entry linked to the press that reported it.",
    url: "https://suri-mansoor-ali-khan.vercel.app/",
    poster: "/work/suri.webp",
  },
  {
    id: "asrg",
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
    client: "MAA Furniture",
    category: "Furniture retail · Kurnool",
    description:
      "Online store and showroom site for a handcrafted furniture maker. Shop the range, design a custom piece, plan a visit.",
    url: "https://www.maafurniture.shop/",
    poster: "/work/maa.webp",
  },
];

/* -------------------------------------------------------- case study */
/* Case studies, data-driven. Each object gets a route at /work/<slug>; the
 * matching WORK card links there. */
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
      { src: "/asrg-client.webp", w: 900, h: 1125, alt: "SAMPeer Studio founder shaking hands with the ASRG Construction owner", caption: "Sealing the project" },
      { src: "/asrg-team.webp", w: 1600, h: 1200, alt: "The SAMPeer Studio team with the ASRG Construction owner at their office in Kurnool", caption: "With the ASRG team, Kurnool" },
    ],
  },
  outcome: {
    title: "The outcome",
    body: "A modern, professional digital presence that finally matches the work - one that earns trust on first impression and lays the foundation for organic search visibility and inbound leads.",
  },
  visit: "Visit the live site",
};

/* --------------------------------------------- case study registry */
/* slug -> data, so a single dynamic route or lookup can resolve any of them. */
export const CASE_STUDIES: Record<string, CaseStudyData> = {
  asrg: CASE_ASRG,
};

/* ------------------------------------------------------ testimonial */
/* One real, verified client voice. */
export const TESTIMONIAL = {
  quote:
    "SAMPeer Studio gave us a premium storytelling website and handled our SEO and Google Business Profile professionally. Our online presence finally matches the work we do.",
  name: "ASRG Construction",
  role: "Construction & civil · Kurnool",
  photo: "/client-asrg.webp",
} as const;

/* -------------------------------------------------------------- about */
export const ABOUT = {
  title: "Two people, every project.",
  body: "SAMPeer Studio is a small studio in Kurnool. We plan, design, build and launch every site ourselves, and stay on after launch to keep it running.",
} as const;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoPosition?: string;
  line: string;
  linkedin?: string;
};

export const TEAM: TeamMember[] = [
  {
    id: "mukheeth",
    name: "Syed Abdul Mukheeth Peer",
    role: "CEO",
    photo: "/founder.webp",
    photoPosition: "center 30%",
    line: "Plans and designs every site, and writes the backend behind it.",
    linkedin: "https://www.linkedin.com/in/syedmukheeth/",
  },
  {
    id: "faisal",
    name: "Shaik Faisal Ahmed",
    role: "CTO",
    photo: "/faisal.webp",
    photoPosition: "center",
    line: "Builds the front end and keeps every site fast and running after launch.",
  },
];

/* ---------------------------------------------------------------- cta */
export const CTA = {
  heading: "Have a project in mind?",
  sub: "Tell us what you need. It comes straight to us.",
  placeholder: "you@company.com",
  /** Required. Email is the reply path, the number is the one that gets a
   *  lead called the same day. */
  phonePlaceholder: "Phone or WhatsApp",
  messagePlaceholder: "What do you need built?",
  button: "Send",
  /** where the form falls back if the send endpoint isn't configured */
  fallbackEmail: "sampeerstudio@gmail.com",
} as const;

/* ------------------------------------------------------------- footer */
export const FOOTER = {
  brand: "SAMPeer Studio",
  line: "Websites that do the work justice.",
  email: "sampeerstudio@gmail.com",
  links: [
    { label: "Automations", href: "/automations", external: false },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/syedmukheeth/", external: true },
  ],
  year: new Date().getFullYear(),
  rights: "All rights reserved.",
} as const;
