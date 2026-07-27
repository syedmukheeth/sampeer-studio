"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Flow } from "@/components/ui/Flow";
import { CardSwap, Card } from "@/components/ui/CardSwap";
import { PILLAR_STORY_FLOW, PILLAR_GROWTH_FLOW, PILLAR_FOUNDER_FLOW, WORK, ABOUT } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/**
 * PILLAR GRAPHIC — the Build section's visuals, drawn instead of photographed.
 * Every pillar features a live animated Flow diagram representing its system machine,
 * ensuring high motion aliveness across all cards on both desktop and mobile screens.
 */
export function PillarGraphic({ variant }: { variant: "story" | "growth" | "founder" }) {
  const reduce = useReducedMotion();

  const parent = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : STAGGER.tight },
    },
  };
  const rise = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : DUR.base, ease: EASE.out },
    },
  };

  if (variant === "growth") {
    return (
      <div className="flex h-full w-full flex-col justify-center py-4">
        <Flow
          {...PILLAR_GROWTH_FLOW}
          mode="loop"
          step={1000}
          canvasOnMobile
          label="The growth system: lead to booked, automatically"
          className="opacity-95"
        />
      </div>
    );
  }

  if (variant === "story") {
    return (
      <div className="flex h-full w-full flex-col justify-between py-4">
        <Flow
          {...PILLAR_STORY_FLOW}
          mode="loop"
          step={1000}
          canvasOnMobile
          label="Storytelling website: visitor to believer, automatically"
          className="opacity-95"
        />
        <div aria-hidden className="relative mt-3 h-32 w-full overflow-hidden">
          <CardSwap
            width="90%"
            height="100%"
            cardDistance={16}
            verticalDistance={18}
            skewAmount={2}
            delay={2200}
            easing="linear"
            pauseOnHover
          >
            {WORK.slice(0, 4).map((w) => (
              <Card key={w.id} className="aspect-[16/10]">
                <span className="relative block h-full w-full">
                  <Image
                    src={w.poster}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 80vw, 24vw"
                    className="object-cover object-top"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-1/3 bg-gradient-to-t from-canvas/90 to-transparent" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] leading-tight text-ink">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="truncate">{w.client}</span>
                  </span>
                </span>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    );
  }

  // founder — live authority flow diagram + LinkedIn profile proof card
  return (
    <div className="flex h-full w-full flex-col justify-between py-4">
      <Flow
        {...PILLAR_FOUNDER_FLOW}
        mode="loop"
        step={1000}
        canvasOnMobile
        label="Founder brand: authority to inbound deals, automatically"
        className="opacity-95"
      />

      <motion.div
        variants={parent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mt-3 flex w-full items-center justify-center"
      >
        <motion.a
          variants={rise}
          href={ABOUT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ABOUT.name} on LinkedIn`}
          className="group relative block w-full overflow-hidden rounded-md border border-line bg-canvas shadow-md transition-colors duration-500 hover:border-accent/40"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.55)_0%,transparent_55%)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-full z-20 w-full animate-[card-sheen_3s_ease-out_infinite] bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] motion-reduce:hidden"
          />

          <div className="relative h-10 bg-gradient-to-r from-accent/40 via-accent/15 to-canvas">
            <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-[3px] bg-[#0a66c2] text-[8px] font-bold lowercase text-white">
              in
            </span>
          </div>

          <div className="px-3 pb-3">
            <div className="-mt-5 flex items-end justify-between">
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-canvas">
                <Image src={ABOUT.photo} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[8px] font-medium text-accent-ink">
                Follow
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[10px] font-semibold text-ink">{ABOUT.name}</span>
              <SealCheck size={10} weight="fill" className="text-accent" />
            </div>
            <p className="mt-0.5 text-[7.5px] leading-relaxed text-muted line-clamp-1">
              Founder, Sampeer Studio · Storytelling websites, growth systems &amp; AI automation
            </p>

            <div className="mt-2 flex gap-4 border-t border-line pt-2">
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold tabular-nums text-ink">8.7K+</span>
                <span className="text-[7.5px] text-muted">followers</span>
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold tabular-nums text-ink">350K+</span>
                <span className="text-[7.5px] text-muted">monthly views</span>
              </span>
            </div>

            <span className="mt-2 flex items-center gap-1 border-t border-line pt-2 text-[8px] font-medium text-muted transition-colors group-hover:text-accent-text">
              View full profile
              <ArrowUpRight
                size={9}
                weight="bold"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </motion.a>
      </motion.div>
    </div>
  );
}
