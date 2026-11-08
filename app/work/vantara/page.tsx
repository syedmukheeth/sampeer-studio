import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_VANTARA } from "@/lib/content";

const TITLE = "Vantara & Rao - Concept Build | SAMPeer Studio";
const DESCRIPTION =
  "A corporate law firm website concept by SAMPeer Studio - authority-led identity that positions counsel as a strategic partner.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/vantara" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
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
