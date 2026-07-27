"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Pillar } from "@/lib/content";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { PillarGraphic } from "@/components/ui/PillarGraphic";
import { GraphPaper } from "@/components/ui/GraphPaper";
import { TextType } from "@/components/ui/TextType";

/**
 * One pillar in the Build stack, with a premium scroll-linked handoff.
 *
 * The panels still pin (CSS sticky) and the next one slides up to cover this
 * one, but instead of a flat hard cut, this panel *recedes* as it is covered:
 * the content scales down a touch and a canvas veil fades over it, so the eye
 * reads depth (this pillar stepping back into the page) rather than a swap.
 * The graphic drifts up a little slower for parallax. Same mechanism and the
 * same feel as the Work sticky-stack, so the two sections move as one system.
 *
 * `wrap` is the scroll subject and MUST be taller than the sticky panel, or the
 * panel has no room to stay pinned while the next one covers it. It runs one
 * viewport of hold plus half a viewport of recede; progress goes 0 (just
 * pinned) -> 1 (covered and leaving). The last panel gets no tall wrap and no
 * recede, nothing covers it, so it simply rests.
 *
 * Reduced motion: no transforms, no veil, the panels simply stack. Markup is
 * identical either way (the veil is the only extra node and it is inert), so
 * there is no hydration branch.
 */
/** ms per character in the outcome heading, shared with the body's delay. */
const TYPING_SPEED = 28;

export function PillarPanel({ pillar: p, last = false }: { pillar: Pillar; last?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // One trigger for the whole panel. Previously the heading and the graphic
  // each ran their own observer against their own element, and the graphic -
  // a tall column, crossed its threshold first, so the visual arrived before
  // the words it was supposed to follow.
  const started = useInView(copy, { once: true, amount: 0.4 });

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });

  // recede: hold through the first ~65%, then step back as the cover arrives
  const scale = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0.93]);
  const veil = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, 0.62]);
  // graphic parallax, a slower drift than the text for depth
  const graphicY = useTransform(scrollYProgress, [0, 1], [0, -48]);

  const animate = !reduce && !last;

  // the body waits out the heading's typing; both read the same speed so the
  // handoff cannot drift when one of them is tuned
  const typingDuration = (p.outcome.length * TYPING_SPEED) / 1000 + 0.15;

  return (
    // dvh, not vh: the sticky child below is sized in dvh, and on mobile the
    // two units differ by the URL bar's height, so mixing them drifts the pin
    // math as the bar shows and hides
    <div ref={wrap} className={last ? "relative" : "relative h-[150dvh]"}>
      <article className="sticky top-0 flex min-h-dvh items-center overflow-hidden bg-canvas">
        {/* the panel's own background is opaque (it has to cover the panel
            below it), which hides the page-wide grid, so the ruling is
            repainted here, on top */}
        <GraphPaper className="[mask-image:radial-gradient(ellipse_at_center,black_0%,black_55%,transparent_88%)]" />
        <motion.div
          style={animate ? { scale } : undefined}
          className="relative mx-auto grid w-full max-w-(--max-shell) origin-center grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-12 md:gap-16"
        >
          <Reveal className="relative md:col-span-7">
            <p className="relative flex items-center gap-3 font-sans text-sm text-muted">
              <span aria-hidden className="font-sans text-xs tabular-nums text-faint">
                {p.index}
              </span>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {p.title}
            </p>
            {/* the outcome types itself in as the panel arrives. The heading
                is the panel's trigger: everything after it keys off this same
                moment, so the order can never invert */}
            <h3
              ref={copy}
              className="relative mt-4 max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-accent-text md:text-5xl"
            >
              <TextType
                text={p.outcome}
                start={started}
                typingSpeed={TYPING_SPEED}
                cursorCharacter="_"
              />
            </h3>
            {/* held back until the heading above has finished typing, the
                body arriving first gave away the line before it was written */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : started ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: typingDuration, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-6 max-w-xl font-sans text-base leading-relaxed text-muted"
            >
              {p.body}
            </motion.p>
          </Reveal>

          {/* the visual is the payoff, so it lands last: only once this panel
              is actually on screen, and only after the heading has typed and
              the body has arrived */}
          {/* two wrappers, because both effects drive y: the outer one owns the
              scroll parallax, the inner one the entrance. On one element the
              reveal's tween and the scroll value would fight. */}
          <motion.div style={animate ? { y: graphicY } : undefined} className="md:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={reduce ? undefined : started ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: typingDuration + 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* no frame: the graphics are the image. A border and a raised
                  panel around each one read as three boxes stacked down the
                  page, and the card deck needs to drop out of its bounds. */}
              <TiltCard className="group relative aspect-[4/5]">
                <div className="absolute inset-0">
                  <PillarGraphic variant={p.graphic} />
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* recede veil, dims this panel to canvas as the next slides over it */}
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
