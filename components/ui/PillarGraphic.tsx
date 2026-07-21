"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Heart, ChatCircle } from "@phosphor-icons/react/dist/ssr";
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
    // Real proof, not a wireframe: a live client site (ASRG Construction)
    // framed in a browser. The work is the imagery.
    return (
      <motion.div
        aria-hidden
        variants={parent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex h-full w-full flex-col bg-elevated"
      >
        {/* browser chrome — real domain */}
        <motion.div
          variants={rise}
          className="flex items-center gap-2 border-b border-line px-4 py-2.5"
        >
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
          </span>
          <span className="ml-2 flex-1 truncate rounded-full bg-canvas/70 px-2.5 py-1 text-[8px] text-faint">
            asrgcontruction.com
          </span>
        </motion.div>

        {/* the live site screenshot fills the frame */}
        <motion.div variants={rise} className="relative flex-1 overflow-hidden">
          <Image
            src="/work/asrg.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-top"
          />
          {/* live badge */}
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-sm border border-line bg-canvas/80 px-2 py-1 text-[8px] text-ink backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Live client site
          </span>
        </motion.div>
      </motion.div>
    );
  }

  // founder — a real LinkedIn post, authority compounding
  return (
    <motion.div
      aria-hidden
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="relative flex h-full w-full items-center justify-center bg-elevated p-6"
    >
      {/* an earlier post, receded behind — the stack of authority */}
      <motion.div
        variants={rise}
        className="absolute right-8 top-8 h-2/5 w-3/5 rounded-md border border-line/60 bg-canvas/60"
      />

      {/* the post in front, filled */}
      <motion.div
        variants={rise}
        className="relative flex w-[86%] flex-col gap-2.5 rounded-md border border-line bg-canvas p-4"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-line">
            <Image src="/founder.webp" alt="" fill sizes="32px" className="object-cover" />
          </span>
          <span className="flex flex-col">
            <span className="text-[9px] font-semibold text-ink">Syed A. M. Peer</span>
            <span className="text-[8px] text-muted">Founder, Sampeer Studio · 2d</span>
          </span>
        </div>

        <p className="mt-1 text-[9px] leading-relaxed text-ink/90">
          Most startups don&apos;t fail from bad products. They fail from being
          invisible. Fix the story first.
        </p>

        <div className="flex gap-1.5">
          <span className="text-[8px] text-accent/80">#founderbrand</span>
          <span className="text-[8px] text-accent/80">#growth</span>
        </div>

        {/* engagement row — the one accent element (the reaction that lands) */}
        <div className="mt-1 flex items-center gap-3 border-t border-line pt-2.5">
          <span className="flex items-center gap-1">
            <motion.span
              variants={{
                hidden: { scale: 0 },
                show: {
                  scale: 1,
                  transition: { duration: reduce ? 0 : DUR.fast, ease: EASE.pop },
                },
              }}
              className="grid h-3.5 w-3.5 place-items-center rounded-full bg-accent text-accent-ink"
            >
              <Heart size={8} weight="fill" />
            </motion.span>
            <span className="text-[8px] text-muted">128</span>
          </span>
          <span className="flex items-center gap-1 text-muted">
            <ChatCircle size={10} />
            <span className="text-[8px]">24</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
