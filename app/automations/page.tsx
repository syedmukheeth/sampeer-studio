import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/automations/Hero";
import { Transform } from "@/components/automations/Transform";
import { Catalog } from "@/components/automations/Catalog";
import { BeforeAfter } from "@/components/automations/BeforeAfter";
import { Industries } from "@/components/automations/Industries";
import { Impact } from "@/components/automations/Impact";
import { CtaSection } from "@/components/ui/CtaSection";
import { A_CTA } from "@/lib/content-automations";
import { EVENTS } from "@/lib/analytics";

const TITLE = "Growth Automation Lab | SAMPeer Studio";
const DESCRIPTION =
  "Watch a business get wired. Lead capture, AI qualification, follow-up, booking, and reporting. The systems that let a company grow without adding headcount.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/automations" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "SAMPeer Studio",
    type: "website",
    url: "/automations",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** §A The Growth Automation Lab. Ordered as an argument, not a feature list:
 *  promise -> what it actually is -> the pieces -> the difference -> your
 *  industry -> what it's worth -> the ask. */
export default function AutomationsPage() {
  return (
    <>
      <Nav />
      {/* Paper, like every other page. The dark `.stage` cut is gone: it was
          the last inversion left on the site and read as a different product. */}
      <main id="main">
        <Hero />
        <Transform />
        <Catalog />
        <BeforeAfter />
        <Industries />
        <Impact />
        <CtaSection
          id="audit"
          idPrefix="audit"
          submitEvent={EVENTS.auditSubmit}
          source="automations"
          content={A_CTA}
        />
      </main>
      <Footer />
    </>
  );
}
