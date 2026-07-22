import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CTA } from "@/components/sections/CTA";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_NOVACARE } from "@/lib/content";

const TITLE = "NovaCare Medical Center - Concept Build | Sampeer Studio";
const DESCRIPTION =
  "A multi-specialty hospital website concept by Sampeer Studio - a calm, human front door that makes fifty departments findable, not overwhelming.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/novacare" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sampeer Studio",
    type: "article",
    url: "/work/novacare",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function NovacareCaseStudyPage() {
  return (
    <>
      <Nav />
      <CaseStudy data={CASE_NOVACARE} />
      <CTA />
      <Footer />
    </>
  );
}
