"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Flow } from "@/components/ui/Flow";
import { PILLAR_GROWTH_FLOW, WORK, ABOUT } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/**
 * PILLAR GRAPHIC — the Build section's visuals, drawn instead of photographed.
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
      <div className="flex h-full w-full items-center bg-elevated p-6">
        <Flow
          {...PILLAR_GROWTH_FLOW}
          mode="loop"
          step={1000}
          label="The growth system: lead to booked, automatically"
          className="opacity-90"
        />
      </div>
    );
  }

  if (variant === "story") {
    // All six live sites at once — a proof wall, not a rotating single frame.
    // Static posters (no iframes) so it reveals once and never janks.
    return (
      <motion.div
        aria-hidden
        variants={parent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid h-full w-full grid-cols-2 grid-rows-3 gap-px bg-line"
      >
        {WORK.map((w) => (
          <motion.div
            key={w.id}
            variants={rise}
            className="group relative overflow-hidden bg-elevated"
          >
            <Image
              src={w.poster}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            {/* legibility scrim + client label */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-canvas/95 via-canvas/40 to-transparent" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-2.5 py-2 font-sans text-[9px] leading-tight text-ink">
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span className="truncate">{w.client}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // founder — the real LinkedIn profile card, and a link to the real profile
  return (
    <motion.div
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="relative flex h-full w-full items-center justify-center bg-elevated p-5"
    >
      <motion.a
        variants={rise}
        href={ABOUT.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ABOUT.name} on LinkedIn`}
        className="group relative block w-[92%] overflow-hidden rounded-md border border-line bg-canvas shadow-lg transition-colors duration-500 hover:border-accent/40"
      >
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
            <span className="rounded-full bg-accent px-3 py-1 text-[8px] font-medium text-accent-ink">
              Follow
            </span>
          </div>

          {/* name + verified + headline */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[11px] font-semibold text-ink">{ABOUT.name}</span>
            <SealCheck size={11} weight="fill" className="text-accent" />
          </div>
          <p className="mt-0.5 text-[8px] leading-relaxed text-muted">
            Founder, Sampeer Studio · Storytelling websites, growth systems &amp; AI automation
          </p>
          <p className="mt-1 text-[8px] text-accent/80">in/syedmukheeth</p>

          {/* the real proof — numbers from the profile */}
          <div className="mt-3 flex gap-5 border-t border-line pt-3">
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold tabular-nums text-ink">8.7K+</span>
              <span className="text-[8px] text-muted">followers</span>
            </span>
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold tabular-nums text-ink">350K+</span>
              <span className="text-[8px] text-muted">monthly views</span>
            </span>
          </div>

          {/* the link affordance — fills the card and says where it goes */}
          <span className="mt-3 flex items-center gap-1 border-t border-line pt-3 text-[9px] font-medium text-muted transition-colors group-hover:text-accent">
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
