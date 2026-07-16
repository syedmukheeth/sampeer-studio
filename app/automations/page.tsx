import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/automations/Hero";
import { Transform } from "@/components/automations/Transform";
import { Catalog } from "@/components/automations/Catalog";
import { BeforeAfter } from "@/components/automations/BeforeAfter";
import { Industries } from "@/components/automations/Industries";
import { Impact } from "@/components/automations/Impact";
import { CTA } from "@/components/automations/CTA";

const TITLE = "Growth Automation Lab | Sampeer Studio";
const DESCRIPTION =
  "Watch a business get wired. Lead capture, AI qualification, follow-up, booking, and reporting — the systems that let a company grow without adding headcount.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/automations" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sampeer Studio",
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
      <main>
        <Hero />
        <Transform />
        <Catalog />
        <BeforeAfter />
        <Industries />
        <Impact />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
