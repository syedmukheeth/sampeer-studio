"use client";

import { motion } from "motion/react";
import { PROBLEM } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SplitText } from "@/components/ui/SplitText";
import { GlitchText } from "@/components/ui/GlitchText";
import { EASE } from "@/lib/constants";

const TYPE = "font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl";

/** ms between chars, also the number the glitch word waits on, so keep them
 *  reading from one place. */
const STAGGER_MS = 18;

/** §02 Brutal prose, set char by char (gsap SplitText) as each line scrolls in.
 *  The word "invisible" is the one that breaks the grammar: it keeps the accent
 *  colour and tears itself apart. The line is cut around that word, SplitText
 *  owns plain text only, and letting it chew the glitch span would eat its
 *  data-text channels, and the word is held back until the chars ahead of it
 *  have landed, so the sentence still reads left to right. */
function Line({ text, order }: { text: string; order: number }) {
  const word = PROBLEM.emphasis;
  const at = text.indexOf(word);
  const start = order * 0.15;

  if (at === -1) {
    return (
      <p className={TYPE}>
        <SplitText text={text} delay={STAGGER_MS} startDelay={start} />
      </p>
    );
  }

  const before = text.slice(0, at);
  // last char of `before` lands at start + (n - 1) * stagger + its own duration;
  // the word arrives just after it
  const afterBefore = start + (before.length - 1) * (STAGGER_MS / 1000) + 0.35;

  return (
    <p className={TYPE}>
      <SplitText text={before} delay={STAGGER_MS} startDelay={start} />
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay: afterBefore, ease: EASE.out }}
      >
        <GlitchText className="text-accent-text" speed={0.8}>
          {word}
        </GlitchText>
      </motion.span>
      <SplitText text={text.slice(at + word.length)} delay={STAGGER_MS} startDelay={afterBefore + 0.3} />
    </p>
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
