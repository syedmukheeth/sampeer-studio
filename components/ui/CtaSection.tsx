"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContactForm } from "@/components/ui/ContactForm";
import { MaskText } from "@/components/ui/MaskText";
import { Section } from "@/components/ui/Section";
import { EASE, DUR, VIEWPORT } from "@/lib/constants";

/** The closing ask, shared by the home CTA and the Automation Lab audit.
 *
 *  The heading and the form are already there when the reader gets here; the
 *  one thing that moves is the hairline threshold drawing itself across the
 *  measure. Nothing between the reader and the ask is ever hidden waiting for
 *  a scroll trigger, which is the whole point of a closing section.
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
    phonePlaceholder: string;
    messagePlaceholder: string;
    button: string;
    fallbackEmail: string;
    /** optional lead-in for a plain mailto line under the form, for the
     *  people who will never fill one in */
    direct?: string;
  };
}) {
  const reduce = useReducedMotion();

  return (
    <Section id={id} size="lg">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-[clamp(2.25rem,5.4vw,4.5rem)] leading-[1.0] font-[680] tracking-[-0.035em] font-stretch-semi-expanded">
          <MaskText text={content.heading} />
        </h2>
        <p className="mt-5 font-sans text-base text-muted md:text-lg">
          {content.sub}
        </p>

        {/* threshold, a hairline the reader crosses to act */}
        <motion.span
          aria-hidden
          data-reveal
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.slow, delay: reduce ? 0 : 0.5, ease: EASE.inOut }}
          className="mx-auto mt-10 block h-px max-w-md origin-center bg-line"
        />

        <ContactForm
          idPrefix={idPrefix}
          emailPlaceholder={content.placeholder}
          phonePlaceholder={content.phonePlaceholder}
          messagePlaceholder={content.messagePlaceholder}
          buttonLabel={content.button}
          submitEvent={submitEvent}
          source={source}
          fallbackEmail={content.fallbackEmail}
        />

        {content.direct && (
          <p className="mt-6 font-sans text-sm text-muted">
            {content.direct}{" "}
            <a href={`mailto:${content.fallbackEmail}`} className="link-wipe text-ink">
              {content.fallbackEmail}
            </a>
          </p>
        )}
      </div>
    </Section>
  );
}
