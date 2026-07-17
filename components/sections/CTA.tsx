"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CTA as C } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";
import { MaskText } from "@/components/ui/MaskText";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { Section } from "@/components/ui/Section";
import { EASE, DUR, RISE, VIEWPORT } from "@/lib/constants";

/** §08 Dead-simple CTA. One input, one button. Single CTA intent page-wide.
 *  The ask arrives the way the verdict did: the hero's mask-reveal returns
 *  for the heading, a hairline threshold draws itself, and the form rises
 *  across it. The narrative's open and close speak in the same voice. */
export function CTA() {
  const reduce = useReducedMotion();

  return (
    <Section id="contact" size="lg">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
          <MaskText text={C.heading} />
        </h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.35, ease: EASE.out }}
          className="mt-5 font-sans text-base text-muted md:text-lg"
        >
          {C.sub}
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

        <motion.form
          action={C.action}
          initial={reduce ? false : { opacity: 0, y: RISE }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.6, ease: EASE.out }}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="email" className="sr-only">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={C.placeholder}
            className="h-12 flex-1 rounded-md border border-line bg-elevated px-4 font-sans text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <TrackClick event={EVENTS.ctaSubmit}>
            <Magnetic strength={0.3}>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md bg-accent px-6 font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98]"
              >
                {C.button}
                <ArrowUpRight size={16} weight="bold" />
              </button>
            </Magnetic>
          </TrackClick>
        </motion.form>
      </div>
    </Section>
  );
}
