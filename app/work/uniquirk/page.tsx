import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CTA } from "@/components/sections/CTA";
import { CaseStudy } from "@/components/case/CaseStudy";
import { CASE_UNIQUIRK } from "@/lib/content";

const TITLE = "Uniquirk Solutions - Concept Build | SAMPeer Studio";
const DESCRIPTION =
  "A personal-branding website concept for CXOs by SAMPeer Studio - a dark, sharp interface where the site itself is the proof of the pitch.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work/uniquirk" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
    type: "article",
    url: "/work/uniquirk",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function UniquirkCaseStudyPage() {
  return (
    <>
      <Nav />
      <CaseStudy data={CASE_UNIQUIRK} />
      <CTA />
      <Footer />
    </>
  );
}
