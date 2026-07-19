"use client";

import { motion, useReducedMotion } from "motion/react";
import { BRANDING } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { EASE, DUR, STAGGER } from "@/lib/constants";
import { track, EVENTS } from "@/lib/analytics";

/** §04c Founder brand — the third service gets its own room. Editorial split:
 *  the claim owns the left column, the three moves stack on the right behind
 *  self-fading hairlines. The Stats band directly below carries the numbers,
 *  so this section stays words-only and doesn't double-print the proof. */
export function Branding() {
  const reduce = useReducedMotion();

  return (
    <Section id="branding">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 lg:col-span-5">
          <SectionHeader title={BRANDING.title} />
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted">
            {BRANDING.sub}
          </p>
          <Reveal delay={STAGGER.loose} className="mt-10">
            <a
              href={BRANDING.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.ctaClickNav, { source: "branding" })}
              className="group inline-flex items-center gap-1 font-sans text-sm font-medium text-ink"
            >
              <span className="border-b border-line pb-1 transition-colors duration-300 group-hover:border-accent">
                {BRANDING.cta.label}
              </span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          {BRANDING.moves.map((m, i) => (
            <div key={m.title} className="relative py-8 first:pt-0 last:pb-0 md:py-10">
              {i > 0 && (
                <motion.span
                  aria-hidden
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: reduce ? 0 : DUR.slow,
                    ease: EASE.inOut,
                  }}
                  className="absolute inset-x-0 top-0 h-px origin-left bg-line"
                />
              )}
              <Reveal delay={i * STAGGER.base}>
                <h3 className="font-display text-xl font-medium text-ink md:text-2xl">
                  {m.title}
                </h3>
                <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-muted md:text-base">
                  {m.body}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
