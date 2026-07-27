import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_ASRG } from "@/lib/content";

const TITLE = "ASRG Construction - Case Study | SAMPeer Studio";
const DESCRIPTION =
  "How SAMPeer Studio gave a 46-year civil contracting firm a premium storytelling website, SEO, and an optimized Google Business Profile.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/asrg" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
    type: "article",
    url: "/work/asrg",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AsrgCaseStudyPage() {
  return (
    <>
      <Nav />
      <CaseStudy data={CASE_ASRG} />
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
