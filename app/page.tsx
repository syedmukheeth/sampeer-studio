import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Build } from "@/components/sections/Build";
import { Work } from "@/components/sections/Work";
import { AutomationLab } from "@/components/sections/AutomationLab";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Build />
        <Work />
        <AutomationLab />
        <Stats />
        <Testimonials />
        <Process />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
