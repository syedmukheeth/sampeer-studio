import type { CSSProperties } from "react";
import { clsx } from "clsx";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { FILM, HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { FilmMedia, FilmProvider, FilmToggle, NightFold } from "@/components/ui/FilmLoop";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/* The night diptych. The statement, one plain line of what the studio sells
   and the two ways forward on one side; the founder film, in colour, in
   its own frame on the other. The whole panel is night on a paper page, and
   it folds into a card as the reader scrolls on (NightFold): day breaking.

   The statement is server-rendered text beside a preloaded poster, so the
   first paint is complete before a byte of script runs. */
export function Hero() {
  const lines = [...HERO.lines, HERO.accent];

  return (
    <section id="hero" className="relative">
      <NightFold className="night grain overflow-hidden bg-canvas">
        <FilmProvider>
          <Shell className="relative z-[2] grid min-h-svh items-center gap-10 pt-28 pb-10 lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-12">
            <div className="@container min-w-0 lg:col-span-7">
              <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">{HERO.place}</p>
              <h1 className="hero-statement mt-6 font-display leading-[0.95] font-[620] tracking-[-0.05em] text-ink">
                {lines.map((line, i) => (
                  <span key={line} className="hero-line">
                    <span
                      className={clsx("hero-line__in", i === lines.length - 1 && "text-accent-text")}
                      style={{ "--line": i } as CSSProperties}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
              <p className="mt-7 max-w-[38ch] font-sans text-lg leading-relaxed text-muted md:text-xl">
                {HERO.offer}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <TrackClick event={EVENTS.ctaClickHero}>
                  <a
                    href={HERO.primary.href}
                    className="btn-press inline-flex h-12 items-center gap-2 rounded-full bg-accent-solid px-6 font-sans text-[15px] font-medium whitespace-nowrap text-accent-ink hover:bg-accent-dim"
                  >
                    {HERO.primary.label}
                    <ArrowUpRight size={16} weight="bold" aria-hidden />
                  </a>
                </TrackClick>
                <a
                  href={HERO.secondary.href}
                  className="btn-press inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 font-sans text-[15px] font-medium whitespace-nowrap text-ink hover:border-ink/60"
                >
                  {HERO.secondary.label}
                  <ArrowDown size={16} weight="bold" aria-hidden />
                </a>
              </div>
            </div>

            <figure className="min-w-0 lg:col-span-5">
              <div className="relative mx-auto aspect-4/5 w-full overflow-hidden rounded-2xl border border-line lg:mr-0 lg:max-w-[min(100%,calc((100svh-11rem)*0.8))]">
                <FilmMedia sizes="(min-width: 1024px) 34vw, 92vw" />
                <FilmToggle className="absolute right-3 bottom-3 z-[2]" />
              </div>
              <figcaption className="mx-auto mt-3 font-mono text-xs text-faint lg:mr-0 lg:max-w-[min(100%,calc((100svh-11rem)*0.8))]">
                {FILM.label}
              </figcaption>
            </figure>
          </Shell>
        </FilmProvider>
      </NightFold>
    </section>
  );
}
