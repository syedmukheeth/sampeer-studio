import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CTA } from "@/components/sections/CTA";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_LIFTX } from "@/lib/content";

const TITLE = "LIFT-X - Concept Build | Sampeer Studio";
const DESCRIPTION =
  "A premium gym website concept by Sampeer Studio - bold type, a single call to action, and momentum built to convert.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/liftx" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sampeer Studio",
    type: "article",
    url: "/work/liftx",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LiftxCaseStudyPage() {
  return (
    <>
      <Nav />
      <CaseStudy data={CASE_LIFTX} />
      <CTA />
      <Footer />
    </>
  );
}
