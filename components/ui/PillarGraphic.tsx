"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Flow } from "@/components/ui/Flow";
import { CardSwap, Card } from "@/components/ui/CardSwap";
import { PILLAR_GROWTH_FLOW, WORK, ABOUT } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/**
 * PILLAR GRAPHIC, the Build section's visuals, drawn instead of photographed.
 * Stock imagery said nothing; these say exactly what each pillar builds, in
 * the site's own vocabulary: hairlines, one accent element, motion aliveness.
 *
 * story    -> all six live client sites at once, a six-cell proof wall
 * growth   -> the live lead machine, straight reuse of the Flow engine
 * founder  -> the real LinkedIn profile card, a link to the actual profile
 *
 * All three animate whileInView once; reduced motion collapses duration to
 * zero, markup never branches (the site-wide hydration-safe pattern).
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
    // NOT ambient: below md the Flow's stepper IS the visual, so the frame
    // never renders empty on phones, and the machine stays in the a11y tree.
    return (
      // dark `.stage` frame: the Flow engine is designed for off-black, and a
      // lit device-like panel in the light editorial stack ties the growth
      // pillar to the automation showcase's dark cut.
      // no dark `.stage` panel any more: unframed, the Flow sits directly on
      // the paper canvas, so it has to run on the light tokens like everything
      // else in the section
      <div className="flex h-full w-full items-center py-6">
        <Flow
          {...PILLAR_GROWTH_FLOW}
          mode="loop"
          step={1000}
          // this pillar's claim is a machine that runs itself, so the running
          // machine has to be on screen on a phone too, not a static list
          canvasOnMobile
          label="The growth system: lead to booked, automatically"
          className="opacity-90"
        />
      </div>
    );
  }

  if (variant === "story") {
    // Six live sites, dealt one at a time. The six-cell wall showed everything
    // at once and each site got a thumbnail too small to read as work; a deck
    // spends the same frame on one poster at a time, at full size.
    return (
      <div aria-hidden className="relative h-full w-full">
        <CardSwap
          // the posters are all 1440x900; the card takes that ratio so the
          // site is shown whole instead of being cropped to fit a squarer box
          width="88%"
          height="auto"
          cardDistance={26}
          verticalDistance={30}
          skewAmount={4}
          // one card every two seconds. The elastic preset's tweens run 2s
          // each, so at this cadence a swap would still be settling when the
          // next one starts, the shorter linear preset fits inside the beat.
          delay={2000}
          easing="linear"
          pauseOnHover
        >
          {WORK.map((w) => (
            <Card key={w.id} className="aspect-[16/10]">
              <span className="relative block h-full w-full">
                <Image
                  src={w.poster}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 60vw, 24vw"
                  className="object-cover object-top"
                />
                {/* legibility scrim + client label */}
                {/* just enough scrim to seat the label, at two thirds of the
                    card it washed the poster out to grey */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-1/4 bg-gradient-to-t from-canvas/85 to-transparent" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-3 py-2 font-sans text-[10px] leading-tight text-ink">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span className="truncate">{w.client}</span>
                </span>
              </span>
            </Card>
          ))}
        </CardSwap>
      </div>
    );
  }

  // founder, the real LinkedIn profile card, and a link to the real profile
  return (
    <motion.div
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="relative flex h-full w-full items-center justify-center py-5"
    >
      <motion.a
        variants={rise}
        href={ABOUT.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ABOUT.name} on LinkedIn`}
        className="group relative block w-[92%] overflow-hidden rounded-md border border-line bg-canvas shadow-lg transition-colors duration-500 hover:border-accent/40"
      >
        {/* lighting: a soft ambient highlight off the top-left corner, plus a
            sheen that sweeps the card on hover. Sits above the content but
            inert, so it lights the card rather than tinting one layer of it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.55)_0%,transparent_55%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-full z-20 w-full animate-[card-sheen_3s_ease-out_infinite] bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] motion-reduce:hidden"
        />

        {/* cover + LinkedIn mark */}
        <div className="relative h-14 bg-gradient-to-r from-accent/40 via-accent/15 to-canvas">
          <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-[4px] bg-[#0a66c2] text-[9px] font-bold lowercase text-white">
            in
          </span>
        </div>

        <div className="px-4 pb-4">
          {/* avatar over the cover + follow */}
          <div className="-mt-7 flex items-end justify-between">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-canvas">
              <Image src={ABOUT.photo} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-medium text-accent-ink">
              Follow
            </span>
          </div>

          {/* name + verified + headline */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[11px] font-semibold text-ink">{ABOUT.name}</span>
            <SealCheck size={11} weight="fill" className="text-accent" />
          </div>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
            Founder, SAMPeer Studio · Storytelling websites, growth systems &amp; AI automation
          </p>
          <p className="mt-1 text-[10px] text-accent-text">in/syedmukheeth</p>

          {/* the real proof, numbers from the profile */}
          <div className="mt-3 flex gap-5 border-t border-line pt-3">
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold tabular-nums text-ink">8.7K+</span>
              <span className="text-[10px] text-muted">followers</span>
            </span>
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold tabular-nums text-ink">350K+</span>
              <span className="text-[10px] text-muted">monthly views</span>
            </span>
          </div>

          {/* the link affordance, fills the card and says where it goes */}
          <span className="mt-3 flex items-center gap-1 border-t border-line pt-3 text-[9px] font-medium text-muted transition-colors group-hover:text-accent-text">
            View full profile
            <ArrowUpRight
              size={11}
              weight="bold"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}
