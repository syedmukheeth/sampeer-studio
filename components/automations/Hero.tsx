"use client";

import { A_HERO, A_HERO_FLOW } from "@/lib/content-automations";
import { Flow } from "@/components/ui/Flow";
import { ShapeGrid } from "@/components/ui/ShapeGrid";
import { GraphPaper } from "@/components/ui/GraphPaper";
import { Magnetic } from "@/components/ui/Magnetic";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/** §A1 The promise. The home hero's signature is "noise -> signal" (a WebGL
 *  grain field). This page's signature is different on purpose: a machine
 *  already running behind the words, before you've read them. Grid lines are
 *  a CSS gradient, not a particle system, the brand bans glow, and the
 *  ambient Flow is the only thing that needs to move. */
export function Hero() {
  return (
    <section
      id="lab"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center"
    >
      {/* same animated grid as the home hero, so the two read as one system */}
      <ShapeGrid
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_58%,transparent_86%)] md:block"
        speed={0.18}
        squareSize={72}
        direction="diagonal"
        // The canvas cannot read CSS custom properties, so these are the
        // sanctioned literal copies of --color-ink (white, oklch 0.97 0 0
        // = rgb 245 245 245) and --color-accent (orange, oklch 0.7 0.2 40 =
        // rgb 255 103 40) at low alpha.
        borderColor="rgba(245, 245, 245, 0.07)"
        hoverFillColor="rgba(255, 103, 40, 0.16)"
        shape="square"
      />
      {/* mobile gets the static ruling: no per-frame canvas on a phone */}
      <GraphPaper className="opacity-60 md:hidden" />

      {/* The machine, always running, never louder than the headline. It sits
          below the type rather than behind it: at any opacity where the nodes
          were legible through the H1, you were reading two words at once. Down
          here it's texture you can actually resolve if you look. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden w-full max-w-4xl translate-y-[38%] px-6 opacity-15 md:block"
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_42%,var(--color-canvas)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* The type is static. It used to fade and rise on a staggered delay,
            which put half a second of empty page between load and the promise
            the reader came for. The ambient Flow above still moves, so the
            page is not inert; the words just don't make anyone wait. */}
        <p className="font-mono text-xs font-medium tracking-[0.04em] text-faint">{A_HERO.eyebrow}</p>

        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[1.02] font-[680] tracking-[-0.035em]">
          {A_HERO.lead} <span className="text-accent-text">{A_HERO.accent}</span>
        </h1>

        <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">
          {A_HERO.sub}
        </p>

        <div className="mt-10">
          <TrackClick event={EVENTS.auditClickHero}>
            <Magnetic>
              <a
                href={A_HERO.cta.href}
                className="btn-press inline-flex h-12 items-center rounded-full bg-accent-solid px-6 font-sans text-[15px] font-semibold whitespace-nowrap text-accent-ink hover:bg-accent-dim"
              >
                {A_HERO.cta.label}
              </a>
            </Magnetic>
          </TrackClick>
        </div>
      </div>
    </section>
  );
}
