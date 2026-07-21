"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";
import { NoiseField } from "@/components/ui/NoiseField";
import { MaskText } from "@/components/ui/MaskText";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/** §01 The verdict. Words mask-reveal up out of the noise field; the second
 *  line carries the page's accent strike. The CTA is deliberately a quiet
 *  anchor, not a button — Nav "Start" owns conversion, and this link doubles
 *  as the scroll affordance and a skip straight to the proof. */
export function Hero() {
  const reduce = useReducedMotion();

  // the accent line starts after the lead line's words have cascaded
  const leadWords = HERO.lead.split(" ").length;
  const accentDelay = 0.5 + leadWords * STAGGER.tight;

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* signature noise -> signal field */}
      <NoiseField className="pointer-events-none absolute inset-0 h-full w-full" />
      {/* seat the type: darken centre, fade the field into the page below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_40%,rgba(10,10,10,0.55)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas"
      />

      <div className="relative z-10 flex flex-col items-center">

        <h1 className="max-w-4xl font-display font-semibold leading-[1.05] tracking-tighter text-[clamp(2.5rem,8vw,6.25rem)]">
          <MaskText text={HERO.lead} mode="mount" delay={0.5} />
          <MaskText
            text={HERO.accent}
            mode="mount"
            delay={accentDelay}
            className="text-accent"
          />
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 1.25, ease: EASE.out }}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg"
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 1.6, ease: EASE.out }}
          className="mt-10"
        >
          <TrackClick event={EVENTS.ctaClickHero}>
            <a
              href={HERO.cta.href}
              className="group inline-flex items-center gap-2 font-sans text-sm font-medium text-ink"
            >
              <span className="border-b border-line pb-1 transition-colors duration-300 group-hover:border-accent">
                {HERO.cta.label}
              </span>
              <ArrowDown
                size={16}
                weight="bold"
                aria-hidden
                className="text-muted transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-accent"
              />
            </a>
          </TrackClick>
        </motion.div>
      </div>
    </section>
  );
}
