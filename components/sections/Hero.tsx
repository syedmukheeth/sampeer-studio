import Image from "next/image";
import { ArrowDown, ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { FOUNDER, HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { NightFold } from "@/components/ui/FilmLoop";
import { SearchLine } from "@/components/ui/SearchLine";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/* The cold open, on a green night panel. A customer's search types itself in
   the serif (SearchLine), and under it, who they find. Then the turn: the next
   search is for the reader's own business. The promise, the plain offer, the
   two ways forward, and the person behind it: on a phone a small face beside
   the note that he answers himself, on a wide screen his photograph in Kurnool
   beside the search.

   Everything but the typing is server-rendered, and the typing's first frame
   is the first search whole, so the first paint is complete before any script
   runs. The panel folds into a card as the reader scrolls on (NightFold). */
export function Hero() {
  const [l1, l2, l3] = HERO.line;

  return (
    <section id="hero" className="relative">
      <NightFold className="night grain overflow-hidden bg-canvas">
        <Shell className="relative z-[2] grid min-h-svh content-center gap-10 pt-28 pb-12 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pt-24">
          <div className="min-w-0 lg:col-span-8">
            <p className="flex items-center gap-2 font-sans text-sm text-muted md:text-base">
              <MagnifyingGlass size={16} weight="bold" aria-hidden className="text-accent" />
              {HERO.kicker}
            </p>
            <div className="mt-5 md:mt-6">
              <SearchLine searches={HERO.searches} findsLabel={HERO.findsLabel} />
            </div>

            <h1 className="mt-12 font-serif text-[clamp(2.1rem,4.6vw,3.9rem)] leading-[1.04] font-normal text-ink md:mt-14">
              {l1} {l2} <mark className="mark">{l3}</mark>
            </h1>
            <p className="mt-5 max-w-[46ch] font-sans text-base leading-relaxed text-muted md:text-lg">
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

            {/* the person behind it; on wide screens the photograph says it */}
            <p className="mt-8 flex items-center gap-3 font-sans text-sm text-muted lg:hidden">
              <Image
                src={FOUNDER.avatar}
                alt=""
                width={80}
                height={80}
                sizes="40px"
                className="h-10 w-10 shrink-0 rounded-full border border-line object-cover"
              />
              {HERO.founderNote}
            </p>
          </div>

          <figure className="hidden min-w-0 lg:col-span-4 lg:block">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-line bg-elevated">
              <Image
                src={HERO.photo.src}
                alt={HERO.photo.alt}
                fill
                preload
                sizes="(min-width: 1024px) 30vw, 1px"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 font-sans text-sm text-muted">
              <span>{HERO.founderNote}</span>
              <span className="text-faint">{HERO.photo.place}</span>
            </figcaption>
          </figure>
        </Shell>
      </NightFold>
    </section>
  );
}
