import type { CSSProperties } from "react";
import { clsx } from "clsx";
import { HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { FilmDrift, FilmMedia, FilmProvider, FilmToggle } from "@/components/ui/FilmLoop";

/* Marquee hero over the founder film. The fold is the statement and nothing
   else: the brand's three beats set edge to edge, each line stretching along
   the width axis as it lands (`.hero-line`). No button in the fold; the nav
   pill carries "Start a project". What the studio does and where it works sit
   in the bottom corners as annotation, with the film's pause control.

   The statement is server-rendered text over a server-rendered poster, so the
   first paint is complete before a byte of script runs. */
export function Hero() {
  const lines = [...HERO.lines, HERO.accent];

  return (
    <section id="hero" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <FilmProvider>
        <FilmMedia />

        <Shell className="@container relative flex flex-1 flex-col justify-end pt-32 pb-6 md:pb-8">
          <FilmDrift>
            <h1 className="hero-statement font-display leading-[0.9] font-[700] tracking-[-0.045em] text-ink [contain:layout]">
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
          </FilmDrift>

          <div className="mt-8 flex items-end justify-between gap-6 border-t border-ink/15 pt-5 md:mt-10">
            <p className="max-w-[34ch] font-mono text-xs leading-relaxed text-muted">{HERO.note}</p>
            <div className="flex items-center gap-4">
              <span className="hidden font-mono text-xs whitespace-nowrap text-muted sm:inline">{HERO.place}</span>
              <FilmToggle />
            </div>
          </div>
        </Shell>
      </FilmProvider>
    </section>
  );
}
