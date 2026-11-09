import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Offer } from "@/components/sections/Offer";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT, FOUNDER } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { Footer } from "@/components/sections/Footer";

/* The argument, as a run of photographs with captions under them. The night
   hero: the promise, the real client names and the founder's face. Then the
   evidence before any further claim (the live work, each client's own words
   beside it); what we sell, one service at a time; how we work, staying
   included; the founder; the questions a buyer asks; and the ask. Night opens
   the page, folds into a card, returns as the proof cards in Services and
   closes it as the footer. */
export default function Home() {
  return (
    <>
      <Nav overHero />
      <main id="main">
        <Hero />
        <Work />
        <Offer />
        <HowWeWork />
        <About />
        <Faq />
        <CtaSection
          id="contact"
          idPrefix="contact"
          submitEvent={EVENTS.ctaSubmit}
          source="home"
          content={CTA_CONTENT}
          details={CTA_CONTENT.details}
          founder={{ avatar: FOUNDER.avatar, alt: FOUNDER.avatarAlt, name: FOUNDER.name, role: FOUNDER.role }}
        />
      </main>
      <Footer />
    </>
  );
}
