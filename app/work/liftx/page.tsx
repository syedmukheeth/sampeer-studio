import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_LIFTX } from "@/lib/content";

const TITLE = "LIFT-X - Concept Build | SAMPeer Studio";
const DESCRIPTION =
  "A premium gym website concept by SAMPeer Studio - bold type, a single call to action, and momentum built to convert.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/liftx" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
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
      <CtaSection
        id="contact"
        idPrefix="contact"
        submitEvent={EVENTS.ctaSubmit}
        source="home"
        content={CTA_CONTENT}
      />
      <Footer />
    </>
  );
}
