import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Work } from "@/components/sections/Work";
import { Reviews } from "@/components/sections/Reviews";
import { CaseFeature } from "@/components/sections/CaseFeature";
import { Problem } from "@/components/sections/Problem";
import { Services } from "@/components/sections/Services";
import { AutomationShowcase } from "@/components/sections/AutomationShowcase";
import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/ui/CtaSection";
import { CHAPTERS, CTA as CTA_CONTENT, PROCESS, PROCESS_HEADER } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { Footer } from "@/components/sections/Footer";

/* The argument, as chapters. The film and the statement; the proof strip;
   the work (evidence before any claim, for a buyer who fears a template);
   clients on camera and the one case study (the fear spikes right after the
   work, so the proof sits there); then the problem said plainly, the three
   pillars that answer it, one of them running live; the founder; and the ask,
   with what happens after it. Each chapter opens on the ribbon rule. */
export default function Home() {
  return (
    <>
      <Nav overHero />
      <main id="main">
        <Hero />
        <Stats />
        <Work />
        <Reviews />
        <CaseFeature />
        <Problem />
        <Services />
        <AutomationShowcase />
        <About />
        <CtaSection
          id="contact"
          idPrefix="contact"
          submitEvent={EVENTS.ctaSubmit}
          source="home"
          content={CTA_CONTENT}
          chapter={CHAPTERS.contact}
          next={{ label: PROCESS_HEADER.label, steps: PROCESS }}
        />
      </main>
      <Footer />
    </>
  );
}
