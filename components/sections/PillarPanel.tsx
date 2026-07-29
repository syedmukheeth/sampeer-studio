"use client";

import type { Pillar } from "@/lib/content";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { PillarGraphic } from "@/components/ui/PillarGraphic";
import { GraphPaper } from "@/components/ui/GraphPaper";
import { STAGGER } from "@/lib/constants";

/**
 * One pillar in the Build stack.
 *
 * This was a pinned sticky-stack: each panel got a 150dvh scroll wrapper, held
 * a `min-h-dvh` sticky article, then receded behind a canvas veil as the next
 * one slid over it. Two things were wrong with that. The panel centred its
 * content in a full viewport, so on any tall screen a short pillar left a large
 * empty band above and below it, and the 50dvh of wrapper past the pin meant
 * the reader scrolled through a blank canvas to get to the next pillar. The
 * page read as mostly empty.
 *
 * Now each pillar is an ordinary section in normal flow. Height follows content
 * instead of the viewport, nothing pins, nothing recedes, and the spacing
 * between pillars is real rhythm rather than leftover scroll distance. The
 * entrance is the site's standard fade-and-rise.
 *
 * The graphic itself is untouched: each pillar's visual is its own deliberate
 * design (CardSwap, flow, LinkedIn card) and stays that way.
 */
export function PillarPanel({ pillar: p, last = false }: { pillar: Pillar; last?: boolean }) {
  return (
    <article
      className={`relative overflow-hidden bg-canvas py-14 md:py-20 ${
        last ? "" : "border-b border-line/60"
      }`}
    >
      <GraphPaper className="[mask-image:radial-gradient(ellipse_at_center,black_0%,black_55%,transparent_88%)]" />

      <div className="relative mx-auto grid w-full max-w-(--max-shell) grid-cols-1 items-center gap-10 px-6 md:grid-cols-12 md:gap-16">
        <Reveal className="relative md:col-span-7">
          <p className="relative flex items-center gap-3 font-sans text-sm text-muted">
            <span aria-hidden className="font-sans text-xs tabular-nums text-faint">
              {p.index}
            </span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {p.title}
          </p>

          {/* The outcome used to type itself in character by character, and the
              body was held back for the length of that animation before it was
              allowed to appear. On a lead-facing page that is a deliberate
              delay in front of the sentence doing the selling. Both land
              immediately now; the heading carries the weight instead. */}
          <h3 className="relative mt-4 max-w-2xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-accent-text md:text-5xl">
            {p.outcome}
          </h3>

          <p className="relative mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
            {p.body}
          </p>
        </Reveal>

        <Reveal delay={STAGGER.loose} className="md:col-span-5">
          {/* The 4:5 box is unchanged, but it is capped now. Uncapped it took
              the full column width, and at ~700px wide a 4:5 ratio resolves to
              ~880px tall against roughly 140px of copy beside it. The row
              centres on the taller child, so the difference came out as a band
              of empty canvas running the width of the page, three times over.
              A max-width holds the graphic near the copy's own scale. */}
          <div className="mx-auto w-full max-w-[340px] md:max-w-[400px]">
            <TiltCard className="group relative aspect-[4/5]">
              <div className="absolute inset-0">
                <PillarGraphic variant={p.graphic} />
              </div>
            </TiltCard>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
