"use client";

import { motion, useReducedMotion } from "motion/react";
import { STATS } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/** §05 Proof numbers. LinkedIn-led: the audience is the asset. No cards,
 *  hairline dividers, big display numerals. The band assembles as it enters:
 *  the top and bottom rules draw themselves in, the internal dividers fade up,
 *  and the numbers count — arrival instead of furniture. */
export function Stats() {
  const reduce = useReducedMotion();

  const rule = {
    initial: reduce ? false : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reduce ? 0 : DUR.slow, ease: EASE.inOut },
  } as const;

  return (
    <section id="stats" className="relative">
      {/* the band's frame draws itself — replaces a passive border-y */}
      <motion.span
        aria-hidden
        {...rule}
        className="absolute inset-x-0 top-0 h-px origin-left bg-line"
      />
      <motion.span
        aria-hidden
        {...rule}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
      />

      <div className="mx-auto grid max-w-(--max-shell) grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * STAGGER.base}
            className="relative px-6 py-12 md:px-10 md:py-16"
          >
            {/* internal dividers fade in after the frame has drawn */}
            {i % 2 !== 0 && (
              <motion.span
                aria-hidden
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.4 }}
                className={`absolute inset-y-0 left-0 w-px bg-line ${
                  i % 4 === 0 ? "md:hidden" : ""
                }`}
              />
            )}
            {i >= 2 && (
              <motion.span
                aria-hidden
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.4 }}
                className="absolute inset-x-0 top-0 h-px bg-line md:hidden"
              />
            )}
            {i % 4 !== 0 && i % 2 === 0 && (
              <motion.span
                aria-hidden
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0 : DUR.base, delay: reduce ? 0 : 0.4 }}
                className="absolute inset-y-0 left-0 hidden w-px bg-line md:block"
              />
            )}
            <CountUp
              value={s.value}
              suffix={s.suffix}
              decimals={s.decimals}
              className="block font-display text-5xl font-semibold tracking-tight tabular-nums md:text-7xl"
            />
            <div className="mt-3 font-sans text-sm text-muted">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
