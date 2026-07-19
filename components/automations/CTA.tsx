"use client";

import { motion, useReducedMotion } from "motion/react";
import { A_CTA } from "@/lib/content-automations";
import { ContactForm } from "@/components/ui/ContactForm";
import { MaskText } from "@/components/ui/MaskText";
import { EVENTS } from "@/lib/analytics";
import { Section } from "@/components/ui/Section";
import { EASE, DUR, RISE, VIEWPORT } from "@/lib/constants";

/** §A7 The one ask on this page. Deliberately a near-copy of sections/CTA
 *  rather than a shared prop-driven component: that one is the site's single
 *  CTA intent ("tell me about your startup"), this one sells a specific
 *  30-minute audit and tracks its own event. Merging them would mean a
 *  component whose every field is a prop — a template, not an abstraction.
 *  Same arrival choreography as the home CTA, kept in sync by hand. */
export function CTA() {
  const reduce = useReducedMotion();

  return (
    <Section id="audit" size="lg">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
          <MaskText text={A_CTA.heading} />
        </h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.35, ease: EASE.out }}
          className="mt-5 font-sans text-base text-muted md:text-lg"
        >
          {A_CTA.sub}
        </motion.p>

        {/* threshold — a hairline the reader crosses to act */}
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.slow, delay: reduce ? 0 : 0.5, ease: EASE.inOut }}
          className="mx-auto mt-10 block h-px max-w-md origin-center bg-line"
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: RISE }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.6, ease: EASE.out }}
        >
          <ContactForm
            idPrefix="audit"
            emailPlaceholder={A_CTA.placeholder}
            messagePlaceholder={A_CTA.messagePlaceholder}
            buttonLabel={A_CTA.button}
            submitEvent={EVENTS.auditSubmit}
            source="automations"
            fallbackEmail={A_CTA.fallbackEmail}
          />
        </motion.div>
      </div>
    </Section>
  );
}
