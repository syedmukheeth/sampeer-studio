import { Fragment } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { NightFold } from "@/components/ui/FilmLoop";
import { ClientStage } from "@/components/ui/ClientStage";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/** One line of the statement, with the accent word lit in gold. */
function Lit({ line, accent }: { line: string; accent: string }) {
  const at = line.indexOf(accent);
  if (at < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, at)}
      <span className="text-accent-text">{accent}</span>
      {line.slice(at + accent.length)}
    </>
  );
}

/* The cold open, on a night panel. The story first: the business is better
   than it looks online, and we change that, with the founder on the call.
   Then the person and the proof together: the founder's portrait, and on its
   corner one card where the real clients take turns. The three services
   close the column, each with what it does for the client.

   On a wide screen the statement and the services share the left column and
   the portrait stands on the right, the client card hanging off its corner
   toward the copy. On a phone they stack: statement, portrait with its card,
   services. The statement rises line by line (CSS, `.hero-line`), after the
   intro curtain on a first visit. The panel folds into a card as the reader
   scrolls on (NightFold). */
export function Hero() {
  const { lines, accent, founder } = HERO;

  return (
    <section id="hero" className="relative">
      <NightFold className="night grain overflow-hidden bg-canvas">
        <Shell className="relative z-[2] grid min-h-svh content-center gap-x-12 gap-y-12 pt-28 pb-14 lg:grid-cols-12 lg:gap-y-10 lg:pt-28 lg:pb-12">
          <div className="min-w-0 lg:col-span-7 lg:row-start-1 lg:self-end">
            <p className="flex items-center gap-3 font-sans text-sm text-muted md:text-[15px]">
              <span aria-hidden className="h-px w-8 shrink-0 bg-accent" />
              {HERO.kicker}
            </p>

            <div className="@container mt-6">
              <h1 className="hero-statement font-serif leading-[0.96] text-ink">
                {lines.map((line, i) => (
                  <Fragment key={line}>
                    <span className="hero-line" style={{ "--line": i } as CSSProperties}>
                      <span className="hero-line__in">
                        <Lit line={line} accent={accent} />
                      </span>
                    </span>
                    {i < lines.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </h1>
            </div>

            <p className="mt-6 max-w-[36ch] font-sans text-lg leading-relaxed text-muted md:text-xl">{HERO.sub}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <TrackClick event={EVENTS.ctaClickHero}>
                <a
                  href={HERO.primary.href}
                  className="btn-press inline-flex h-13 items-center gap-2 rounded-full bg-accent-solid px-7 font-sans text-[15px] font-semibold whitespace-nowrap text-accent-ink hover:bg-accent-dim"
                >
                  {HERO.primary.label}
                  <ArrowUpRight size={16} weight="bold" aria-hidden />
                </a>
              </TrackClick>
              <a
                href={HERO.secondary.href}
                className="link-wipe inline-flex min-h-11 items-center gap-2 font-sans text-[15px] font-medium whitespace-nowrap text-ink"
              >
                {HERO.secondary.label}
                <ArrowDown size={15} weight="bold" aria-hidden />
              </a>
            </div>
          </div>

          {/* the founder, with the clients taking turns on his corner */}
          <div className="relative mx-auto mb-10 w-full max-w-sm min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:max-w-[30rem] lg:self-center lg:justify-self-end">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-elevated shadow-[0_40px_80px_-40px_var(--shadow-tint)] ring-1 ring-line">
              <Image
                src={founder.src}
                alt={founder.alt}
                fill
                preload
                sizes="(min-width: 1024px) 30rem, (min-width: 640px) 24rem, 92vw"
                className="object-cover"
              />
              {/* the right half only: the client card covers the left corner */}
              <p className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/30 to-transparent px-5 pt-20 pb-5 text-right font-sans">
                <span className="ml-auto block max-w-[46%] text-base font-semibold text-white lg:max-w-[60%]">
                  {founder.name}
                </span>
                <span className="mt-0.5 ml-auto block max-w-[46%] text-sm leading-snug text-white/80 lg:max-w-[60%]">
                  {founder.note}
                </span>
              </p>
            </div>
            <ClientStage
              reels={HERO.reels}
              labels={HERO.stage}
              className="absolute -bottom-10 left-3 w-[46%] lg:bottom-[7%] lg:-left-[20%] lg:w-1/2"
            />
          </div>

          <ul
            aria-label={HERO.servicesLabel}
            className="grid min-w-0 border-t border-line sm:grid-cols-3 lg:col-span-7 lg:row-start-2 lg:mr-14 lg:self-start xl:mr-20"
          >
            {HERO.services.map((s, i) => (
              <li key={s.id} className={i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-6" : "sm:pr-6"}>
                <a href={`#service-${s.id}`} className="group block py-4 sm:pt-5 sm:pb-1">
                  <span className="flex items-center gap-1.5 font-sans text-[15px] font-semibold whitespace-nowrap text-ink transition-colors group-hover:text-accent-text">
                    {s.name}
                    <ArrowUpRight
                      size={13}
                      weight="bold"
                      aria-hidden
                      className="opacity-50 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="mt-1 block font-sans text-sm leading-snug text-muted">{s.outcome}</span>
                </a>
              </li>
            ))}
          </ul>
        </Shell>
      </NightFold>
    </section>
  );
}
