"use client";

import { motion, useReducedMotion } from "motion/react";
import { HERO } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";
import { NoiseField } from "@/components/ui/NoiseField";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER.tight, delayChildren: 0.5 } },
};
const word = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: DUR.hero, ease: EASE.out } },
};

/** Words mask-reveal up on load. Storytelling: the verdict assembles itself
 *  out of the noise behind it. Word spacing comes from margin on the mask
 *  wrapper — a trailing space INSIDE an inline-block gets trimmed and the
 *  words jam together. */
function MaskLine({ text, className }: { text: string; className?: string }) {
  const parts = text.split(" ");
  return (
    <span className={`block ${className ?? ""}`}>
      {parts.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          style={{ marginRight: i < parts.length - 1 ? "0.26em" : 0 }}
        >
          <motion.span variants={word} className="inline-block">
            {w}
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
        <motion.h1
          variants={reduce ? undefined : container}
          initial={reduce ? false : "hidden"}
          animate={reduce ? false : "show"}
          className="max-w-4xl font-display font-semibold leading-[1.05] tracking-tighter text-[clamp(2.5rem,8vw,6.25rem)]"
        >
          <MaskLine text={HERO.lead} />
          <MaskLine text={HERO.accent} className="text-accent" />
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, delay: 1.25, ease: EASE.out }}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg"
        >
          {HERO.sub}
        </motion.p>
      </div>

      {/* scroll cue — invites the journey */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? false : { opacity: 1 }}
        transition={{ duration: DUR.base, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-line/80 p-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-muted"
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
