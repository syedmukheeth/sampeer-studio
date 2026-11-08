import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Work } from "@/components/sections/Work";
import { CaseFeature } from "@/components/sections/CaseFeature";
import { Process } from "@/components/sections/Process";
import { AutomationShowcase } from "@/components/sections/AutomationShowcase";
import { FounderBrand } from "@/components/sections/FounderBrand";
import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { Footer } from "@/components/sections/Footer";

/* The argument, in order: the claim with its evidence, the proof strip, the
   work, the one case study, then how (process), the two systems I sell beside
   the sites (automation, founder brand), who does it, and the ask. Work before
   process, process before services: a buyer who fears a template needs to see
   the work first. */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
        <Work />
        <CaseFeature />
        <Process />
        <AutomationShowcase />
        <FounderBrand />
        <About />
        <CtaSection
          id="contact"
          idPrefix="contact"
          submitEvent={EVENTS.ctaSubmit}
          source="home"
          content={CTA_CONTENT}
        />
      </main>
      <Footer />
    </>
  );
}
