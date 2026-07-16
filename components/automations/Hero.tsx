"use client";

import { motion, useReducedMotion } from "motion/react";
import { A_HERO, A_HERO_FLOW } from "@/lib/content-automations";
import { EASE, DUR } from "@/lib/constants";
import { Flow } from "@/components/ui/Flow";
import { Magnetic } from "@/components/ui/Magnetic";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/** §A1 The promise. The home hero's signature is "noise -> signal" (a WebGL
 *  grain field). This page's signature is different on purpose: a machine
 *  already running behind the words, before you've read them. Grid lines are
 *  a CSS gradient, not a particle system — the brand bans glow, and the
 *  ambient Flow is the only thing that needs to move. */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="lab"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center"
    >
      {/* graph paper — one repeating-linear-gradient per axis, in `line` */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(to_right,var(--color-line)_0_1px,transparent_1px_88px),repeating-linear-gradient(to_bottom,var(--color-line)_0_1px,transparent_1px_88px)]"
      />

      {/* The machine, always running, never louder than the headline. It sits
          below the type rather than behind it: at any opacity where the nodes
          were legible through the H1, you were reading two words at once. Down
          here it's texture you can actually resolve if you look. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden w-full max-w-4xl translate-y-[38%] px-6 opacity-25 md:block"
      >
        <Flow
          {...A_HERO_FLOW}
          mode="loop"
          ambient
          step={1100}
          label={A_HERO.eyebrow}
        />
      </div>

      {/* seat the type over the graph paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_45%,rgba(10,10,10,0.9)_30%,rgba(10,10,10,0.45)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Reduced motion collapses the DURATION rather than skipping the
            `initial` frame. `initial={reduce ? false : ...}` would render
            different markup on a reduced client than the server produced —
            the server has no matchMedia — and that's a hydration mismatch. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
          className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.22em] text-faint"
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {A_HERO.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : DUR.hero,
            delay: reduce ? 0 : 0.1,
            ease: EASE.out,
          }}
          className="mt-6 max-w-4xl font-display font-semibold leading-[1.05] tracking-tighter text-[clamp(2.25rem,7vw,5.5rem)]"
        >
          {A_HERO.lead} <span className="text-accent">{A_HERO.accent}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : DUR.base,
            delay: reduce ? 0 : 0.35,
            ease: EASE.out,
          }}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg"
        >
          {A_HERO.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : DUR.base,
            delay: reduce ? 0 : 0.5,
            ease: EASE.out,
          }}
          className="mt-10"
        >
          <TrackClick event={EVENTS.auditClickHero}>
            <Magnetic>
              <a
                href={A_HERO.cta.href}
                className="inline-block rounded-md border border-line px-6 py-3 font-sans text-sm font-medium text-ink transition-colors hover:border-accent"
              >
                {A_HERO.cta.label}
              </a>
            </Magnetic>
          </TrackClick>
        </motion.div>
      </div>
    </section>
  );
}
