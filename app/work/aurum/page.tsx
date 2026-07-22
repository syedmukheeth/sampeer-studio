import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CTA } from "@/components/sections/CTA";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_AURUM } from "@/lib/content";

const TITLE = "Aurum Resorts - Concept Build | Sampeer Studio";
const DESCRIPTION =
  "A luxury private-island resort website concept by Sampeer Studio - stillness, cinematic imagery, and restraint as a sales tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/aurum" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sampeer Studio",
    type: "article",
    url: "/work/aurum",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AurumCaseStudyPage() {
  return (
    <>
      <Nav />
      <CaseStudy data={CASE_AURUM} />
      <CTA />
      <Footer />
    </>
  );
}
