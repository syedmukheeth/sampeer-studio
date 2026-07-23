"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { useScroll } from "motion/react";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HOME_AUTOMATION_STORY } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Flow } from "@/components/ui/Flow";
import { STAGGER } from "@/lib/constants";

type Beat = (typeof HOME_AUTOMATION_STORY)["beats"][number];

/** One movement of the story. The diagram wires itself under the scrollbar
 *  (Flow `build` mode, driven by this beat's own scroll progress — the same
 *  grammar as /automations Industries, no pin required so the page scrolls
 *  freely). Text and machine alternate sides down the stack for rhythm. */
function StoryBeat({ beat, index }: { beat: Beat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 45%"],
  });

  const graph = useMemo(
    () => serpentine(beat.steps, beat.cols, { payload: beat.payload }),
    [beat],
  );

  const flip = index % 2 === 1; // even beats: text left; odd: text right

  return (
    <div className="grid items-center gap-8 md:grid-cols-12 md:gap-14">
      <div className={clsx("md:col-span-4", flip && "md:order-2")}>
        <Reveal>
          <p className="flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-[0.22em] text-faint">
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-full border border-line text-[11px] tabular-nums text-muted"
            >
              {index + 1}
            </span>
            {beat.name}
          </p>
        </Reveal>

        <Reveal delay={STAGGER.base}>
          <p className="mt-5 font-display text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
            {beat.outcome}
          </p>
        </Reveal>

        {beat.href ? (
          <Reveal delay={STAGGER.base * 2}>
            <a
              href={beat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent-text"
            >
              <span className="border-b border-accent/40 pb-0.5 transition-colors group-hover:border-accent">
                Try it live
              </span>
              <ArrowUpRight
                size={15}
                weight="bold"
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        ) : null}
      </div>

      <div ref={ref} className={clsx("md:col-span-8", flip && "md:order-1")}>
        <Flow
          {...graph}
          mode="build"
          progress={scrollYProgress}
          label={`${beat.name} workflow`}
        />
      </div>
    </div>
  );
}

/** §04b The Automation Stage — the home page's centerpiece and its one dark
 *  cinematic cut. It sits directly under Work on purpose: the reader has just
 *  watched six live sites, the strongest possible moment to say "and then we
 *  make it run itself". Four signature systems build themselves on scroll and
 *  hand off to the live console. The whole section is wrapped in `.stage`, so
 *  the light page inverts to off-black and the Flow engine gets the background
 *  it was art-directed for. */
export function AutomationLab() {
  const { eyebrow, title, sub, beats, cta } = HOME_AUTOMATION_STORY;

  return (
    <Section id="automation-lab" className="stage border-y border-line">
      <SectionHeader eyebrow={eyebrow} title={title} />

      <Reveal delay={STAGGER.base}>
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {sub}
        </p>
      </Reveal>

      <div className="mt-20 space-y-24 md:mt-24 md:space-y-32">
        {beats.map((beat, i) => (
          <StoryBeat key={beat.id} beat={beat} index={i} />
        ))}
      </div>

      {/* the payoff — the live console first (the real, running product), the
          full Lab second */}
      <div className="mt-24 flex flex-col items-start gap-8 border-t border-line pt-12 md:flex-row md:items-center md:justify-between">
        <Reveal>
          <p className="max-w-md font-display text-2xl font-medium leading-snug tracking-tight text-ink">
            Sixteen of these are already running. Go open one.
          </p>
        </Reveal>

        <Reveal delay={STAGGER.base}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href={cta.live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-accent-solid px-6 py-3 font-sans text-sm font-medium text-accent-ink transition-[transform,background-color] hover:bg-accent active:scale-[0.98]"
            >
              {cta.live.label}
              <ArrowUpRight
                size={16}
                weight="bold"
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <Link
              href={cta.lab.href}
              className="group inline-flex items-center gap-2 font-sans text-sm font-medium text-ink"
            >
              <span className="border-b border-accent pb-1">{cta.lab.label}</span>
              <ArrowRight
                size={16}
                weight="bold"
                aria-hidden
                className="text-accent transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
