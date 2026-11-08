import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ScrollDepth } from "@/components/analytics/ScrollDepth";
import { CursorLabel } from "@/components/ui/CursorLabel";
import { INTRO_SCRIPT, Intro } from "@/components/ui/Intro";
import { SITE_URL } from "@/lib/constants";

// Geist for display and body, Geist Mono for labels, numbers and diagram meta.
// One variable file each; next/font self-hosts them and size-matches a
// fallback, so the swap cannot shift the layout.
const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "SAMPeer Studio by Syed Mukheeth - Websites, Automation & Founder Branding";
const DESCRIPTION =
  "Syed Mukheeth designs and builds storytelling websites, growth automation systems and founder brands. Work for ASRG Construction, MAA Furniture, Suri Mansoor Ali Khan and more.";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/** Structured data, lets Google render SAMPeer as a real org, not a page. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SAMPeer Studio",
  description: DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  slogan: "Get noticed. Remembered. Chosen",
  founder: {
    "@type": "Person",
    name: "Syed Abdul Mukheeth Peer",
    jobTitle: "Founder",
    sameAs: [
      "https://www.linkedin.com/in/syedmukheeth/",
      "https://www.instagram.com/syedmukheeth.29/",
      "https://www.syedmukheeth.is-a.dev/",
    ],
  },
  sameAs: [
    "https://www.linkedin.com/in/syedmukheeth/",
    "https://www.instagram.com/sampeer.studio/",
  ],
};

/**
 * JSON.stringify does NOT escape `<`, so a value containing `</script>` would
 * close the tag early and turn the rest into live markup. Everything above is
 * a hardcoded constant today, so nothing is injectable, but this block is one
 * careless edit (a CMS field, a prop, a templated description) away from being
 * an XSS sink, and the escape costs nothing.
 */
function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Mirrors the night canvas (.night --color-canvas, oklch(0.145 0.002 270)): the
// browser chrome sits against the night hero. Metadata is emitted as HTML
// attributes and cannot read a CSS custom property, so this literal is the one
// sanctioned copy; change both together.
export const viewport: Viewport = {
  themeColor: "#0e0f11",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the intro script below sets data-intro on <html>
    // before React hydrates; that attribute is the only expected difference
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD) }}
        />
      </head>
      <body className="relative min-h-dvh bg-canvas text-ink antialiased">
        {/* First stop in the tab order; hidden until focused. */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Intro />
        <LenisProvider>{children}</LenisProvider>
        <CursorLabel />
        <ScrollDepth />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
