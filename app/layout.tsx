import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Roboto_Flex, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ScrollDepth } from "@/components/analytics/ScrollDepth";
import { SITE_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display face, Space Grotesk. Geometric, engineered, sharp at huge sizes;
// weights 400-700 cover every font-display use (semibold headlines, bold hero).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  display: "swap",
});

// The logo lockup's wordmark only. The artwork is set in a geometric sans of
// the Product Sans family, which is not licensed for the web; Poppins is the
// closest freely available match for the circular bowls and the wide, even
// letterfit. Nothing else on the page uses it.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
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

export const viewport: Viewport = {
  themeColor: "#f7f5f9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${robotoFlex.variable} ${poppins.variable}`}
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
