"use client";

import { motion, useReducedMotion } from "motion/react";
import { ContactForm } from "@/components/ui/ContactForm";
import { MaskText } from "@/components/ui/MaskText";
import { Section } from "@/components/ui/Section";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { EASE, DUR, STAGGER, VIEWPORT } from "@/lib/constants";

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
  chapter,
  next,
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
  /** Home only: the chapter label on the ribbon rule that opens the section. */
  chapter?: string;
  /** Home only: "what happens next", set beside the form. With these the
   *  section becomes the page's resolution, a split with the last light behind
   *  the heading; without them (the Lab) it stays the centred ask below. */
  next?: { label: string; steps: readonly { id: string; title: string; body: string }[] };
}) {
  const reduce = useReducedMotion();

  if (next) {
    return (
      <Section id={id} size="lg">
        {chapter ? <ChapterRule label={chapter} /> : null}
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <span aria-hidden className="light-climax pointer-events-none absolute -inset-x-24 -inset-y-20 -z-10" />
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] font-[680] tracking-[-0.04em] font-stretch-semi-expanded">
              <MaskText text={content.heading} />
            </h2>
            <p className="mt-6 max-w-md font-sans text-base text-muted md:text-lg">{content.sub}</p>

            <p className="mt-12 font-mono text-xs text-faint">{next.label}</p>
            <ol className="mt-4 border-t border-line">
              {next.steps.map((s, i) => (
                <FadeIn as="li" key={s.id} delay={i * STAGGER.base} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-4">
                  <span className="font-display text-lg font-semibold tracking-[-0.01em] text-ink font-stretch-semi-expanded">
                    {s.title}
                  </span>
                  <span className="font-sans text-sm leading-relaxed text-muted">{s.body}</span>
                </FadeIn>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7 lg:pt-2">
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
        </div>
      </Section>
    );
  }

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
