"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIALS, TESTIMONIALS_EYEBROW } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE, DUR } from "@/lib/constants";

/** §05.5 Founder voices. One large editorial pull-quote at a time; the words
 *  crossfade as the speaker changes. Selectable name list doubles as a quiet
 *  progress rail — the active speaker carries the single indigo strike.
 *  Auto-advances on a calm cadence; pauses to nothing under reduced-motion. */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % TESTIMONIALS.length),
      6500,
    );
    return () => clearInterval(id);
  }, [reduce]);

  const t = TESTIMONIALS[active];

  return (
    <Section id="testimonials">
      <SectionHeader eyebrow={TESTIMONIALS_EYEBROW} title="Founders, after." />

      <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
        {/* the quote — fills the measure, oversized, editorial */}
        <div className="md:col-span-8">
          {/* indigo open-quote — the one accent strike here */}
          <span
            aria-hidden
            className="block font-display text-7xl leading-none text-accent md:text-8xl"
          >
            &ldquo;
          </span>

          <div className="relative -mt-4 min-h-[7.5em] md:min-h-[5.5em]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={t.id}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -18 }}
                transition={{ duration: DUR.base, ease: EASE.out }}
                className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl"
              >
                {t.quote}
                <footer className="mt-7 font-sans text-sm not-italic text-muted">
                  <span className="text-ink">{t.name}</span> — {t.role}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>

        {/* speaker rail — click to jump, active line drawn in indigo */}
        <ul className="flex flex-row gap-6 md:col-span-4 md:flex-col md:gap-5 md:border-l md:border-line md:pl-8">
          {TESTIMONIALS.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative block text-left"
                  aria-current={on}
                >
                  <span
                    className={`font-display text-base font-medium tracking-tight transition-colors md:text-lg ${
                      on ? "text-ink" : "text-faint group-hover:text-muted"
                    }`}
                  >
                    {item.name}
                  </span>
                  {/* active underline draws in */}
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent"
                    initial={false}
                    animate={{ scaleX: on ? 1 : 0 }}
                    transition={{ duration: DUR.fast, ease: EASE.out }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
