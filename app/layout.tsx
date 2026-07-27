import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Flex, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ScrollDepth } from "@/components/analytics/ScrollDepth";
import { Spine } from "@/components/ui/Spine";
import { Grain } from "@/components/ui/Grain";
import { ShapeGrid } from "@/components/ui/ShapeGrid";
import { SITE_URL } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display face — Space Grotesk. Geometric, engineered, sharp at huge sizes;
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

const TITLE = "Sampeer Studio - Storytelling Websites, Growth Systems & AI Automation";
const DESCRIPTION =
  "We help startups and ambitious businesses become impossible to ignore through premium storytelling websites, AI-powered growth systems, founder branding, and automation.";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sampeer Studio",
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

/** Structured data — lets Google render Sampeer as a real org, not a page. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Sampeer Studio",
  description: DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  slogan: "Get noticed. Remembered. Chosen.",
  sameAs: ["https://www.linkedin.com/in/syedmukheeth/"],
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${robotoFlex.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="relative min-h-dvh bg-canvas text-ink antialiased">
        <ShapeGrid
          // desktop only: a full-viewport canvas animating for the life of the
          // session is a real frame budget on a phone, and it is background
          // texture — the least valuable thing competing with a touch scroll
          className="pointer-events-none fixed inset-0 z-0 hidden h-dvh w-dvw opacity-25 [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)] md:block"
          speed={0.12}
          squareSize={76}
          direction="diagonal"
          borderColor="rgba(63, 97, 82, 0.12)"
          hoverFillColor="rgba(63, 97, 82, 0.18)"
          shape="square"
        />
        {/* First stop in the tab order; hidden until focused. */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LenisProvider>{children}</LenisProvider>
        <Grain />
        <Spine />
        <ScrollDepth />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
