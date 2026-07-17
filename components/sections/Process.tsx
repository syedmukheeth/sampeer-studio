"use client";

import { motion, useReducedMotion } from "motion/react";
import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE, DUR, STAGGER, VIEWPORT } from "@/lib/constants";

/** §06 How It Works. The timeline draws itself: the spine fills top-to-bottom,
 *  each node pops, each step rises — the process literally building in front of
 *  you. Verb-noun labels, no "Stage 1". */
export function Process() {
  const reduce = useReducedMotion();

  return (
    <Section id="process">
      <div className="mx-auto max-w-3xl">
        <SectionHeader title={PROCESS_HEADER.title} />

        <motion.ol
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={VIEWPORT}
          variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER.loose } } }}
          className="relative mt-16"
        >
          {/* track */}
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-line" />
          {/* drawing fill */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={reduce ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: DUR.slow * 1.4, ease: EASE.inOut }}
          />

          {PROCESS.map((step) => (
            <motion.li
              key={step.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.out } },
              }}
              className="relative pb-14 pl-10 last:pb-0"
            >
              <motion.span
                aria-hidden
                className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent"
                variants={{
                  hidden: { scale: 0 },
                  show: { scale: 1, transition: { duration: DUR.fast, ease: EASE.pop } },
                }}
              />
              <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-lg font-sans text-base leading-relaxed text-muted">
                {step.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </Section>
  );
}
