import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Offer } from "@/components/sections/Offer";
import { Work } from "@/components/sections/Work";
import { Clients } from "@/components/sections/Clients";
import { AutomationShowcase } from "@/components/sections/AutomationShowcase";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/ui/CtaSection";
import { CHAPTERS, CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { Footer } from "@/components/sections/Footer";

/* The argument, as a run of diptychs (claim on one half, proof on the
   other). The night hero with the film; the trust bar; what we sell, said
   plainly enough to buy from; the work (evidence before any further claim,
   for a buyer who fears a template); the clients in their own words and the
   one case study; the systems running; how we work; the founder; and the
   ask. Night opens the page, folds into a card, returns as proof cards and
   the automation chapter, and closes it as the footer. */
export default function Home() {
  return (
    <>
      <Nav overHero />
      <main id="main">
        <Hero />
        <Stats />
        <Offer />
        <Work />
        <Clients />
        <AutomationShowcase />
        <HowWeWork />
        <About />
        <CtaSection
          id="contact"
          idPrefix="contact"
          submitEvent={EVENTS.ctaSubmit}
          source="home"
          content={CTA_CONTENT}
          chapter={CHAPTERS.contact}
          details={CTA_CONTENT.details}
        />
      </main>
      <Footer />
    </>
  );
}
