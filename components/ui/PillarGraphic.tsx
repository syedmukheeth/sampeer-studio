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
    return (
      <motion.div
        aria-hidden
        variants={parent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex h-full w-full flex-col bg-elevated"
      >
        {/* browser chrome */}
        <motion.div
          variants={rise}
          className="flex items-center gap-2 border-b border-line px-4 py-2.5"
        >
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="h-2 w-2 rounded-full bg-line" />
          </span>
          <span className="ml-2 flex-1 rounded-full bg-canvas/70 px-2.5 py-1 text-[8px] text-faint">
            sampeerstudio.com
          </span>
        </motion.div>

        {/* the page */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* nav */}
          <motion.div variants={rise} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-accent/80" />
              <span className="text-[9px] font-semibold tracking-tight text-ink">sampeer</span>
            </span>
            <span className="flex gap-2.5 text-[8px] text-muted">
              <span>Work</span>
              <span>About</span>
              <span>Contact</span>
            </span>
          </motion.div>

          {/* hero */}
          <div className="mt-1 flex flex-col gap-2">
            <motion.p
              variants={rise}
              className="font-display text-lg font-semibold leading-[1.1] tracking-tight text-ink"
            >
              Get noticed.
              <br />
              Get chosen.
            </motion.p>
            <motion.p variants={rise} className="max-w-[85%] text-[8.5px] leading-relaxed text-muted">
              A storytelling site that turns first-time visitors into booked calls.
            </motion.p>
            <motion.span
              variants={rise}
              className="mt-1 inline-flex w-fit items-center rounded-sm bg-accent px-3 py-1.5 text-[9px] font-medium text-accent-ink"
            >
              Start your project
            </motion.span>
          </div>

          {/* preview strip — a faux hero image */}
          <motion.div
            variants={rise}
            className="mt-1 h-14 rounded-sm border border-line bg-gradient-to-br from-accent/15 to-canvas"
          />

          {/* three feature cards, filled */}
          <div className="mt-auto grid grid-cols-3 gap-2">
            {["Design", "Build", "Grow"].map((f) => (
              <motion.div
                key={f}
                variants={rise}
                className="flex flex-col gap-1.5 rounded-sm border border-line p-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                <span className="text-[8px] font-medium text-ink">{f}</span>
                <span className="h-1 w-full rounded-full bg-line" />
                <span className="h-1 w-2/3 rounded-full bg-line/60" />
              </motion.div>
            ))}
          </div>
        </div>
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
