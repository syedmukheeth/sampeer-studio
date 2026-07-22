import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CTA } from "@/components/sections/CTA";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_VANTARA } from "@/lib/content";

const TITLE = "Vantara & Rao - Concept Build | Sampeer Studio";
const DESCRIPTION =
  "A corporate law firm website concept by Sampeer Studio - authority-led identity that positions counsel as a strategic partner.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/vantara" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sampeer Studio",
    type: "article",
    url: "/work/vantara",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function VantaraCaseStudyPage() {
  return (
    <>
      <Nav />
      <CaseStudy data={CASE_VANTARA} />
      <CTA />
      <Footer />
    </>
  );
}
