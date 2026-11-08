"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BRAND_MEANING, BRANDING, CHAPTERS, HOME_AUTOMATION_STORY, REELS, TESTIMONIAL } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Shell } from "@/components/ui/Shell";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { WorkDeck } from "@/components/ui/WorkDeck";
import { Flow } from "@/components/ui/Flow";
import { LinkedInCard } from "@/components/ui/LinkedInCard";
import { ReelEmbed } from "@/components/ui/ReelEmbed";
import { DUR, EASE, STAGGER } from "@/lib/constants";

/* What we do: the name, spelled out, IS the service list. A feature stack on
   desktop: the letter sits in a sticky pane and changes as each pillar's panel
   takes the middle of the screen (a discrete swap, not a scrub). Each pillar
   keeps its own graphic: the story is a card deck of the live sites, the
   automation is a Flow diagram, the founder brand is the LinkedIn card and the
   reel, the peer is a real handshake. Phones get the panels stacked with the
   letter inline. */

type Pillar = {
  letter: string;
  word: string;
  body: string;
  service: string;
  detail: string;
  href?: string;
  cta?: string;
};

const PILLARS: Pillar[] = [
  ...BRAND_MEANING.letters.map((l) => ({ ...l })),
  {
    letter: "+",
    word: BRAND_MEANING.suffix.word,
    body: BRAND_MEANING.suffix.body,
    service: BRAND_MEANING.suffix.word,
    detail: BRAND_MEANING.suffix.body,
  },
];

const LEAD = HOME_AUTOMATION_STORY.beats[0];

function PillarMedia({ index }: { index: number }) {
  const lead = useMemo(() => serpentine(LEAD.steps, 2, { payload: LEAD.payload }), []);
  switch (index) {
    case 0:
      return (
        <div className="mx-auto max-w-lg">
          <WorkDeck />
        </div>
      );
    case 1:
      return (
        <div className="rounded-2xl border border-line bg-elevated/50 p-4 md:p-6">
          <Flow {...lead} mode="static" canvasOnMobile compact label={`${LEAD.name} workflow`} />
        </div>
      );
    case 2:
      return (
        <div className="grid gap-6 sm:grid-cols-2 sm:items-start">
          <div className="flex flex-col gap-6">
            <LinkedInCard />
            <ol className="space-y-4">
              {BRANDING.moves.map((m) => (
                <li key={m.title} className="border-t border-line pt-4">
                  <p className="font-display text-lg font-semibold tracking-[-0.01em] text-ink font-stretch-semi-expanded">
                    {m.title}
                  </p>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-muted">{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto w-full max-w-xs sm:max-w-none">
            <ReelEmbed reel={REELS[0]} />
          </div>
        </div>
      );
    default:
      return (
        <figure className="relative aspect-4/3 overflow-hidden rounded-2xl bg-elevated">
          <Image
            src={TESTIMONIAL.photoSecondary}
            alt={TESTIMONIAL.photoSecondaryAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </figure>
      );
  }
}

export function Services() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    panels.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, []);

  const current = PILLARS[active];

  return (
    <MotionConfig reducedMotion="user">
      <section id="services" className="relative py-24 md:py-36">
        <Shell>
          <ChapterRule label={CHAPTERS.services} />

          <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-12">
            {/* the sticky letter, desktop only */}
            <div className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-28">
                <p className="font-mono text-xs text-faint">{BRAND_MEANING.label}</p>
                <div className="relative mt-4 h-[clamp(9rem,15vw,14rem)] overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={current.letter}
                      aria-hidden
                      initial={{ opacity: 0, y: "35%" }}
                      animate={{ opacity: 1, y: "0%" }}
                      exit={{ opacity: 0, y: "-35%" }}
                      transition={{ duration: DUR.slow, ease: EASE.out }}
                      className="absolute top-0 left-0 font-display text-[clamp(9rem,15vw,14rem)] leading-[0.82] font-[700] tracking-[-0.05em] text-accent font-stretch-expanded"
                    >
                      {current.letter}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="mt-6 font-display text-3xl font-[650] tracking-[-0.025em] text-ink font-stretch-semi-expanded">
                  {current.word}
                </p>
                <p className="mt-3 max-w-xs font-sans text-base leading-relaxed text-muted">{current.body}</p>

                <ol className="mt-10 flex gap-2" aria-label="Pillars">
                  {PILLARS.map((p, i) => (
                    <li key={p.letter}>
                      <span
                        className={clsx(
                          "grid h-9 w-9 place-items-center rounded-full border font-mono text-xs transition-colors duration-300",
                          i === active ? "border-accent-text text-ink" : "border-line text-faint",
                        )}
                      >
                        {p.letter}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex flex-col gap-24 lg:col-span-8 lg:gap-40">
              {PILLARS.map((p, i) => (
                <article
                  key={p.letter}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  data-index={i}
                  className="flex flex-col lg:min-h-[60vh] lg:justify-center"
                >
                  <FadeIn>
                    <div className="flex items-baseline gap-4 lg:hidden">
                      <span
                        aria-hidden
                        className="font-display text-7xl leading-none font-[700] tracking-[-0.05em] text-accent font-stretch-expanded"
                      >
                        {p.letter}
                      </span>
                      <span className="font-display text-2xl font-[650] tracking-[-0.02em] text-ink font-stretch-semi-expanded">
                        {p.word}
                      </span>
                    </div>
                    <p className="mt-6 font-mono text-xs text-accent-text lg:mt-0">{p.service}</p>
                    <h3 className="mt-3 max-w-2xl font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.08] font-[650] tracking-[-0.03em] text-ink font-stretch-semi-expanded">
                      {p.detail}
                    </h3>
                  </FadeIn>

                  <FadeIn delay={STAGGER.base} className="mt-10">
                    <PillarMedia index={i} />
                  </FadeIn>

                  {p.href && p.cta ? (
                    <a
                      href={p.href}
                      {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="link-wipe mt-8 inline-flex items-center gap-2 self-start py-1 font-sans text-sm font-medium text-accent-text"
                    >
                      {p.cta}
                      {p.href.startsWith("http") ? (
                        <ArrowUpRight size={14} weight="bold" aria-hidden />
                      ) : (
                        <ArrowDown size={14} weight="bold" aria-hidden />
                      )}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </Shell>
      </section>
    </MotionConfig>
  );
}
