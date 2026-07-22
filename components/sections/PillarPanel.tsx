"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Pillar } from "@/lib/content";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { PillarGraphic } from "@/components/ui/PillarGraphic";

/**
 * One pillar in the Build stack, with a premium scroll-linked handoff.
 *
 * The panels still pin (CSS sticky) and the next one slides up to cover this
 * one — but instead of a flat hard cut, this panel *recedes* as it is covered:
 * the content scales down a touch and a canvas veil fades over it, so the eye
 * reads depth (this pillar stepping back into the page) rather than a swap.
 * The graphic drifts up a little slower for parallax. Same mechanism and the
 * same feel as the Work sticky-stack, so the two sections move as one system.
 *
 * `wrap` is the scroll subject and MUST be taller than the sticky panel, or the
 * panel has no room to stay pinned while the next one covers it. It runs one
 * viewport of hold plus half a viewport of recede; progress goes 0 (just
 * pinned) -> 1 (covered and leaving). The last panel gets no tall wrap and no
 * recede — nothing covers it, so it simply rests.
 *
 * Reduced motion: no transforms, no veil — the panels simply stack. Markup is
 * identical either way (the veil is the only extra node and it is inert), so
 * there is no hydration branch.
 */
export function PillarPanel({ pillar: p, last = false }: { pillar: Pillar; last?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });

  // recede: hold through the first ~65%, then step back as the cover arrives
  const scale = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0.93]);
  const veil = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, 0.62]);
  // graphic parallax — a slower drift than the text for depth
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, -48]);

  const animate = !reduce && !last;

  return (
    <div ref={wrap} className={last ? "relative" : "relative h-[150vh]"}>
      <article className="sticky top-0 flex min-h-dvh items-center overflow-hidden bg-canvas">
        <motion.div
          style={animate ? { scale } : undefined}
          className="mx-auto grid w-full max-w-(--max-shell) origin-center grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-12 md:gap-16"
        >
          <Reveal className="relative md:col-span-7">
            <p className="relative flex items-center gap-3 font-sans text-sm text-muted">
              <span aria-hidden className="font-sans text-xs tabular-nums text-faint">
                {p.index}
              </span>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {p.title}
            </p>
            <h3 className="relative mt-4 max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              {p.outcome}
            </h3>
            <p className="relative mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
              {p.body}
            </p>
          </Reveal>

          <motion.div
            style={animate ? { y: graphicY } : undefined}
            className="md:col-span-5"
          >
            <TiltCard className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line">
              <div className="absolute inset-0">
                <PillarGraphic variant={p.graphic} />
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* recede veil — dims this panel to canvas as the next slides over it */}
        {animate && (
          <motion.div
            aria-hidden
            style={{ opacity: veil }}
            className="pointer-events-none absolute inset-0 bg-canvas"
          />
        )}
      </article>
    </div>
  );
}
