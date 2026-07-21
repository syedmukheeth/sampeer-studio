"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIALS, TESTIMONIALS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE, DUR } from "@/lib/constants";

/** §05.5 Founder voices. One full-measure editorial pull-quote at a time; the
 *  words crossfade as the speaker changes. The speaker row below doubles as a
 *  quiet progress rail — the active name carries the single indigo strike.
 *  Auto-advances on a calm cadence; pauses to nothing under reduced-motion.
 *  Deliberately NOT a split grid: Build and About already own that skeleton,
 *  so this one reads as a full-width editorial beat between them. */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || TESTIMONIALS.length <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % TESTIMONIALS.length),
      6500,
    );
    return () => clearInterval(id);
  }, [reduce]);

  const t = TESTIMONIALS[active];

  return (
    <Section id="testimonials">
      <SectionHeader title={TESTIMONIALS_HEADER.title} />

      <div className="mt-14 md:mt-20">
        {/* indigo open-quote — the one accent strike here */}
        <span
          aria-hidden
          className="block font-display text-7xl leading-none text-accent md:text-8xl"
        >
          &ldquo;
        </span>

        <div className="relative -mt-4 min-h-[7.5em] max-w-4xl md:min-h-[4.5em]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: DUR.base, ease: EASE.out }}
              className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-5xl"
            >
              {t.quote}
              <footer className="mt-8 flex items-center gap-4 font-sans text-sm not-italic">
                {t.photo && (
                  <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-line">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      fill
                      sizes="56px"
                      className="object-cover grayscale"
                    />
                  </span>
                )}
                <span>
                  <span className="block text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-muted">{t.role}</span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* speaker rail — only when there's more than one voice to switch */}
        {TESTIMONIALS.length > 1 && (
        <ul className="mt-12 flex flex-row flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
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
        )}
      </div>
    </Section>
  );
}
