"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContactForm } from "@/components/ui/ContactForm";
import { MaskText } from "@/components/ui/MaskText";
import { Section } from "@/components/ui/Section";
import { EASE, DUR, RISE, VIEWPORT } from "@/lib/constants";

/** The closing ask, shared by the home CTA and the Automation Lab audit.
 *
 *  The ask arrives the way the verdict did: the hero's mask-reveal returns for
 *  the heading, a hairline threshold draws itself, and the form rises across
 *  it. The narrative's open and close speak in the same voice.
 *
 *  Both pages ran a byte-identical copy of this markup and drifted apart only
 *  in their copy, their section id and which event they track, so those are the
 *  props. The content object stays whole rather than being spread into six
 *  fields: it is already the shape both content files export. */
export function CtaSection({
  id,
  idPrefix,
  submitEvent,
  source,
  content,
}: {
  /** the section anchor, `contact` on home, `audit` on the Lab */
  id: string;
  /** namespaces the two form controls' ids, since both can exist per route */
  idPrefix: string;
  submitEvent: string;
  source: string;
  content: {
    heading: string;
    sub: string;
    placeholder: string;
    messagePlaceholder: string;
    button: string;
    fallbackEmail: string;
  };
}) {
  const reduce = useReducedMotion();

  return (
    <Section id={id} size="lg">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
          <MaskText text={content.heading} />
        </h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.35, ease: EASE.out }}
          className="mt-5 font-sans text-base text-muted md:text-lg"
        >
          {content.sub}
        </motion.p>

        {/* threshold, a hairline the reader crosses to act */}
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
            idPrefix={idPrefix}
            emailPlaceholder={content.placeholder}
            messagePlaceholder={content.messagePlaceholder}
            buttonLabel={content.button}
            submitEvent={submitEvent}
            source={source}
            fallbackEmail={content.fallbackEmail}
          />
        </motion.div>
      </div>
    </Section>
  );
}
