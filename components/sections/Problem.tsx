"use client";

import { motion, useReducedMotion } from "motion/react";
import { PROBLEM } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { EASE, DUR, VIEWPORT } from "@/lib/constants";

const TYPE =
  "font-display text-2xl font-semibold leading-snug tracking-tight text-ink md:text-4xl";

/** §02 Brutal prose. Three lines, each arriving as one block.
 *
 *  This used to set every line character by character (gsap SplitText) and tear
 *  the word "invisible" apart with a chromatic-channel glitch. Both were cut:
 *  the per-character stagger meant the reader watched a line assemble instead
 *  of reading it, and the glitch, at body size on a light ground, did not read
 *  as a deliberate effect at all, it read as a font failing to load. The
 *  argument in this section is the product; anything that delays it is working
 *  against the page.
 *
 *  What is left is one fade-and-rise per line. The emphasis word keeps the
 *  accent and gains weight, so it still lands as the sentence's one strike,
 *  and it is legible the entire time. */
function Line({ text, order }: { text: string; order: number }) {
  const reduce = useReducedMotion();
  const word = PROBLEM.emphasis;
  const at = text.indexOf(word);

  const content =
    at === -1 ? (
      text
    ) : (
      <>
        {text.slice(0, at)}
        <strong className="font-semibold text-accent-text">{word}</strong>
        {text.slice(at + word.length)}
      </>
    );

  return (
    <motion.p
      className={TYPE}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.base, delay: order * 0.08, ease: EASE.out }}
    >
      {content}
    </motion.p>
  );
}

export function Problem() {
  return (
    <Section id="problem">
      <div className="max-w-4xl space-y-6">
        {PROBLEM.lines.map((l, i) => (
          <Line key={i} text={l} order={i} />
        ))}
      </div>
    </Section>
  );
}
