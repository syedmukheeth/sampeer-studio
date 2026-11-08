import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_AURUM } from "@/lib/content";

const TITLE = "Aurum Resorts - Concept Build | SAMPeer Studio";
const DESCRIPTION =
  "A luxury private-island resort website concept by SAMPeer Studio - stillness, cinematic imagery, and restraint as a sales tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/aurum" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
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
