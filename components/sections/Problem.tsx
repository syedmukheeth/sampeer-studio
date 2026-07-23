"use client";

import { motion, useReducedMotion } from "motion/react";
import { PROBLEM } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { EASE, DUR, STAGGER, VIEWPORT } from "@/lib/constants";

const line = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER.tight } },
};
const word = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: DUR.base, ease: EASE.out } },
};

/** §02 Brutal prose. Words rise into place; the word "invisible" is literally
 *  struck through in indigo — the metaphor performed, not just stated.
 *  Word gaps come from margin on the mask wrapper (a trailing space inside an
 *  inline-block is trimmed and the words jam). */
function Line({ text, reduce }: { text: string; reduce: boolean | null }) {
  const emphasis = PROBLEM.emphasis;
  const words = text.split(" ");

  return (
    <motion.p
      variants={reduce ? undefined : line}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={VIEWPORT}
      className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl"
    >
      {words.map((w, i) => {
        const clean = w.replace(/[.,]/g, "");
        const isEmphasis = clean === emphasis;
        return (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.1em] align-bottom"
            style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}
          >
            <motion.span variants={reduce ? undefined : word} className="inline-block">
              {isEmphasis ? (
                <span className="relative inline-block text-gradient-accent">
                  {w}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-[3px] w-full origin-left -translate-y-1/2 bg-accent"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={reduce ? undefined : { scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: DUR.fast, delay: 0.7, ease: EASE.out }}
                  />
                </span>
              ) : (
                w
              )}
            </motion.span>
          </span>
        );
      })}
    </motion.p>
  );
}

export function Problem() {
  const reduce = useReducedMotion();
  return (
    <Section id="problem">
      <div className="max-w-4xl space-y-6">
        {PROBLEM.lines.map((l, i) => (
          <Line key={i} text={l} reduce={reduce} />
        ))}
      </div>
    </Section>
  );
}
