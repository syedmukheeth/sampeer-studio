import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { NightFold } from "@/components/ui/FilmLoop";
import { ReelWall } from "@/components/ui/ReelWall";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/* The cold open, on a night panel. Three things on the first screen, in the
   order a visitor needs them: what we build (the three services, lit in the
   accent), the founder's face, and the real clients who are happy with the
   work, as silent reels that link to their projects.

   On a wide screen the headline and the reels share the left column and the
   founder's portrait stands on the right; on a phone they stack: headline,
   portrait, then the reels as a swipe row. The panel folds into a card as the
   reader scrolls on (NightFold). */
export function Hero() {
  const [a, b, c] = HERO.services;
  const lit = "text-accent-text";

  return (
    <section id="hero" className="relative">
      <NightFold className="night grain overflow-hidden bg-canvas">
        <Shell className="relative z-[2] grid min-h-svh content-center gap-x-14 gap-y-10 pt-28 pb-12 lg:grid-cols-12 lg:gap-y-8 lg:pt-24 lg:pb-10">
          <div className="min-w-0 lg:col-span-7 lg:row-start-1">
            <p className="font-sans text-sm text-muted md:text-base">{HERO.kicker}</p>
            <h1 className="mt-4 font-serif text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.03] font-normal text-ink">
              {HERO.lead} <span className={lit}>{a}</span>, <span className={lit}>{b}</span> and{" "}
              <span className={lit}>{c}</span>.
            </h1>
            <p className="mt-4 max-w-[52ch] font-sans text-base leading-relaxed text-muted md:text-lg">{HERO.sub}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
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

          <figure className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-elevated lg:max-w-none">
              <Image
                src={HERO.founder.src}
                alt={HERO.founder.alt}
                fill
                preload
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 24rem, 92vw"
                className="object-cover object-top"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent px-5 pt-16 pb-5 font-sans">
                <span className="block text-base font-medium text-white">{HERO.founder.name}</span>
                <span className="mt-0.5 block text-sm text-white/80">{HERO.founder.note}</span>
              </figcaption>
            </div>
          </figure>

          <div className="min-w-0 lg:col-span-7 lg:row-start-2">
            <ReelWall reels={HERO.reels} label={HERO.reelsLabel} pause={HERO.pause} play={HERO.play} />
          </div>
        </Shell>
      </NightFold>
    </section>
  );
}
