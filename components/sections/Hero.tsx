import type { CSSProperties } from "react";
import { clsx } from "clsx";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { WorkDeck } from "@/components/ui/WorkDeck";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/* H2 split diptych: the claim on the left, the evidence on the right.

   The headline is the brand's three beats, one per line, and each line
   stretches along the width axis as it lands (`.hero-line` in globals.css):
   getting noticed, literally. It is pure CSS and server-rendered, so the words
   are on screen from the first paint and nothing waits on hydration. */
export function Hero() {
  const lines = [...HERO.lines, HERO.accent];

  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center pt-24 pb-20 lg:pb-32">
      <Shell className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs font-medium tracking-[0.04em] text-faint">{HERO.eyebrow}</p>

          {/* Sized so the longest line ("Remembered.", about 8.4em at full
              stretch) always fits its column: full width below lg, the
              seven-column half from lg up. Lines never wrap, so this is the
              only thing standing between the headline and the deck. */}
          <h1 className="mt-6 font-display text-[clamp(2rem,10vw,5rem)] leading-[0.98] font-[680] tracking-[-0.035em] text-ink [contain:layout] lg:text-[min(5.5rem,6.2vw)]">
            {lines.map((line, i) => (
              <span
                key={line}
                className={clsx("hero-line", i === lines.length - 1 && "text-accent-text")}
                style={{ "--line": i } as CSSProperties}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[34rem] font-sans text-base leading-relaxed text-muted md:text-lg">
            {HERO.sub}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <TrackClick event={EVENTS.ctaClickHero}>
              <a
                href={HERO.ctaPrimary.href}
                className="btn-press inline-flex h-12 items-center rounded-full bg-accent-solid px-7 font-sans text-[15px] font-medium text-accent-ink hover:bg-accent-dim"
              >
                {HERO.ctaPrimary.label}
              </a>
            </TrackClick>
            <a
              href={HERO.cta.href}
              className="link-wipe inline-flex items-center gap-2 py-1 font-sans text-[15px] font-medium text-ink"
            >
              {HERO.cta.label}
              <ArrowDown size={15} weight="bold" aria-hidden />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <WorkDeck />
        </div>
      </Shell>
    </section>
  );
}
