"use client";

import { motion, useReducedMotion } from "motion/react";
import { HERO } from "@/lib/content";
import { EASE_OUT } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const word = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

/** Words mask-reveal up on load. Storytelling: the verdict assembles itself. */
function MaskLine({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <motion.h1
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "show"}
        className="max-w-5xl font-display text-5xl font-semibold leading-[1.02] tracking-tighter sm:text-6xl md:text-7xl lg:text-[7.5rem]"
      >
        <MaskLine text={HERO.lead} />
        <br />
        <MaskLine text={HERO.accent} className="text-accent" />
      </motion.h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={reduce ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
        className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg"
      >
        {HERO.sub}
      </motion.p>
    </section>
  );
}
