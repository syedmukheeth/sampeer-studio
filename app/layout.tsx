import type { Metadata, Viewport } from "next";
import { Google_Sans_Code, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ScrollDepth } from "@/components/analytics/ScrollDepth";
import { SITE_URL } from "@/lib/constants";

// The logo's wordmark is set in the Product Sans family, which Google has since
// released as Google Sans Flex under the OFL. One variable file carries both
// display and body: headlines stretch along the width axis, body copy sits at
// normal width. Only `wdth` is added beyond weight; the full axis set (opsz,
// ROND, GRAD, slnt) would take the file from ~120 KB to ~560 KB.
// `adjustFontFallback: false` on both: next/font has no metric overrides for
// these two families yet, so it cannot size-match a fallback and says so on
// every build. The headline lines are nowrap and the font is preloaded, so the
// swap cannot change the hero's line count.
const sans = Google_Sans_Flex({
  variable: "--font-gsf",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  adjustFontFallback: false,
});

// Its monospace sibling, for numbers, labels, filters and diagram meta.
const mono = Google_Sans_Code({
  variable: "--font-gsc",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
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

// Mirrors --color-canvas (oklch(0.14 0.03 290)). Metadata is emitted as HTML
// attributes and cannot read a CSS custom property, so this literal is the one
// sanctioned copy; change both together.
export const viewport: Viewport = {
  themeColor: "#090715",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
    >
      <head>
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
        <LenisProvider>{children}</LenisProvider>
        <ScrollDepth />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
