import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { CtaSection } from "@/components/ui/CtaSection";
import { CTA as CTA_CONTENT } from "@/lib/content";
import { EVENTS } from "@/lib/analytics";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Testimonials />
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
