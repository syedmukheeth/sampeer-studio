"use client";

import { motion, useReducedMotion } from "motion/react";
import { Flow } from "@/components/ui/Flow";
import { PILLAR_GROWTH_FLOW } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/**
 * PILLAR GRAPHIC — the Build section's visuals, drawn instead of photographed.
 * Stock imagery said nothing; these say exactly what each pillar builds, in
 * the site's own vocabulary: hairlines, one accent element, motion aliveness.
 *
 * story    -> a page-skeleton wireframe assembling (nav, headline, CTA block)
 * growth   -> the live lead machine, straight reuse of the Flow engine
 * founder  -> a LinkedIn-post skeleton stacking up (authority compounding)
 *
 * All three animate whileInView once; reduced motion collapses duration to
 * zero, markup never branches (the site-wide hydration-safe pattern).
 */
export function PillarGraphic({ variant }: { variant: "story" | "growth" | "founder" }) {
  const reduce = useReducedMotion();

  const parent = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : STAGGER.tight },
    },
  };
  const rise = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : DUR.base, ease: EASE.out },
    },
  };

  if (variant === "growth") {
    // NOT ambient: below md the Flow's stepper IS the visual, so the frame
    // never renders empty on phones, and the machine stays in the a11y tree.
    return (
      <div className="flex h-full w-full items-center bg-elevated p-6">
        <Flow
          {...PILLAR_GROWTH_FLOW}
          mode="loop"
          step={1000}
          label="The growth system: lead to booked, automatically"
          className="opacity-90"
        />
      </div>
    );
  }

  if (variant === "story") {
    return (
      <motion.div
        aria-hidden
        variants={parent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex h-full w-full flex-col gap-4 bg-elevated p-7"
      >
        {/* nav bar */}
        <motion.div variants={rise} className="flex items-center justify-between">
          <span className="h-2 w-10 rounded-xs bg-line" />
          <span className="flex gap-2">
            <span className="h-2 w-6 rounded-xs bg-line" />
            <span className="h-2 w-6 rounded-xs bg-line" />
            <span className="h-2 w-6 rounded-xs bg-line" />
          </span>
        </motion.div>
        {/* hero headline bars */}
        <div className="mt-6 flex flex-col gap-3">
          <motion.span variants={rise} className="h-5 w-4/5 rounded-xs bg-line" />
          <motion.span variants={rise} className="h-5 w-3/5 rounded-xs bg-line/70" />
          <motion.span variants={rise} className="mt-2 h-2.5 w-2/3 rounded-xs bg-line/50" />
          <motion.span variants={rise} className="h-2.5 w-1/2 rounded-xs bg-line/50" />
        </div>
        {/* the CTA block — the one accent element */}
        <motion.span variants={rise} className="mt-6 h-8 w-28 rounded-sm bg-accent/80" />
        {/* content blocks below the fold */}
        <div className="mt-auto grid grid-cols-3 gap-3">
          <motion.span variants={rise} className="h-16 rounded-sm border border-line" />
          <motion.span variants={rise} className="h-16 rounded-sm border border-line" />
          <motion.span variants={rise} className="h-16 rounded-sm border border-line" />
        </div>
      </motion.div>
    );
  }

  // founder — a post skeleton stacking authority
  return (
    <motion.div
      aria-hidden
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="relative flex h-full w-full items-center justify-center bg-elevated p-7"
    >
      {/* the post behind — an earlier one, receded */}
      <motion.div
        variants={rise}
        className="absolute right-10 top-10 h-2/5 w-3/5 rounded-md border border-line/60 bg-canvas/60"
      />
      {/* the post in front */}
      <motion.div
        variants={rise}
        className="relative flex w-4/5 flex-col gap-3 rounded-md border border-line bg-canvas p-5"
      >
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 shrink-0 rounded-full bg-line" />
          <span className="flex flex-col gap-1.5">
            <span className="h-2 w-20 rounded-xs bg-line" />
            <span className="h-1.5 w-14 rounded-xs bg-line/60" />
          </span>
        </div>
        <span className="mt-2 h-2 w-full rounded-xs bg-line/70" />
        <span className="h-2 w-11/12 rounded-xs bg-line/70" />
        <span className="h-2 w-4/5 rounded-xs bg-line/70" />
        {/* the one accent element — the reaction that lands */}
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
          <motion.span
            variants={{
              hidden: { scale: 0 },
              show: {
                scale: 1,
                transition: { duration: reduce ? 0 : DUR.fast, ease: EASE.pop },
              },
            }}
            className="h-2.5 w-2.5 rounded-full bg-accent"
          />
          <span className="h-1.5 w-16 rounded-xs bg-line/60" />
        </div>
      </motion.div>
    </motion.div>
  );
}
