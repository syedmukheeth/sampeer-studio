import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Build } from "@/components/sections/Build";
import { Work } from "@/components/sections/Work";
import { AutomationLab } from "@/components/sections/AutomationLab";
import { Branding } from "@/components/sections/Branding";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Process } from "@/components/sections/Process";
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
        <Problem />
        <Build />
        <Work />
        <AutomationLab />
        <Branding />
        <Stats />
        <Testimonials />
        <Process />
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
