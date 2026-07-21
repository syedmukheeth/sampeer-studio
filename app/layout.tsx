import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ScrollDepth } from "@/components/analytics/ScrollDepth";
import { Spine } from "@/components/ui/Spine";
import { Grain } from "@/components/ui/Grain";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const clash = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "../public/fonts/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const TITLE = "Sampeer Studio - Storytelling Websites, Growth Systems & AI Automation";
const DESCRIPTION =
  "We help startups and ambitious businesses become impossible to ignore through premium storytelling websites, AI-powered growth systems, founder branding, and automation.";

// live URL today; swap to the custom domain when it's live (one line)
const SITE_URL = "https://sampeer-studio.vercel.app";

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
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${clash.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
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
