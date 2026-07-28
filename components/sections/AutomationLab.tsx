"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HOME_AUTOMATION_STORY } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Shell } from "@/components/ui/Shell";
import { MaskText } from "@/components/ui/MaskText";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { Flow } from "@/components/ui/Flow";
import { EASE, STAGGER } from "@/lib/constants";

type Beat = (typeof HOME_AUTOMATION_STORY)["beats"][number];

/** Seconds the closing line holds back, so it lands after the last beat's
 *  machine has finished arriving rather than beside it. */
const PAYOFF_DELAY = 0.9;

/** One movement of the story. The diagram wires itself under the scrollbar
 *  (Flow `build` mode, driven by this beat's own scroll progress, the same
 *  grammar as /automations Industries, no pin required so the page scrolls
 *  freely). Text and machine alternate sides down the stack for rhythm. */
function StoryBeat({ beat, index }: { beat: Beat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  // the copy column is the trigger for the whole beat, so the machine can
  // never arrive before the sentence that introduces it
  const started = useInView(copy, { once: true, amount: 0.3 });

  const graph = useMemo(
    () => serpentine(beat.steps, beat.cols, { payload: beat.payload }),
    [beat],
  );

  // The phone gets its OWN graph, not a shrunk copy of the desktop one. Three
  // columns inside a 342px screen leaves ~16px of label per card, so every
  // node rendered as "V…", "C…". Two columns plus the compact card (no meta
  // line, no status column) gives the label the width it needs.
  const mobileGraph = useMemo(
    () => serpentine(beat.steps, 2, { payload: beat.payload }),
    [beat],
  );

  const flip = index % 2 === 1; // even beats: text left; odd: text right

  // The diagram follows the copy, but only just. A delay measured off the whole
  // sentence (words * 70ms + 0.9s) put the machine two seconds behind, by which
  // point a normal scroll had already carried its build past the interesting
  // part, sequence it a beat later, not a paragraph later.
  const copyDuration = Math.min(beat.outcome.split(" ").length * 0.05, 0.55);

  return (
    <div className="grid items-center gap-8 md:grid-cols-12 md:gap-14">
      <div className={clsx("md:col-span-4", flip && "md:order-2")}>
        <Reveal>
          <p className="flex items-center gap-3 font-sans text-xs font-medium uppercase tracking-[0.18em] text-faint">
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-full border border-line text-[11px] tabular-nums text-muted"
            >
              {index + 1}
            </span>
            {beat.name}
          </p>
        </Reveal>

        {/* word-by-word, unblurring as it lands, the beats get their own
            register again, distinct from the section title's mask rise */}
        <p ref={copy} className="mt-5 font-display text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
          <SplitText
            text={beat.outcome}
            splitType="words"
            delay={70}
            duration={0.9}
            from={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          />
        </p>

        {beat.href ? (
          <Reveal delay={copyDuration}>
            <a
              href={beat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent-text"
            >
              <span className="link-shine border-b border-accent/40 pb-0.5 transition-colors group-hover:border-accent">
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

      {/* the machine lands after the words that introduce it. Only the wrapper
          fades, `ref` stays on the element the scroll progress is measured
          against, so the build itself is still driven by position, not by this */}
      <motion.div
        ref={ref}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={reduce ? undefined : started ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: copyDuration, ease: EASE.out }}
        className={clsx("md:col-span-8", flip && "md:order-1")}
      >
        {/* these beats ARE the section: four systems wiring themselves as you
            scroll. On a phone the static stepper showed four lists instead, so
            the canvas runs there too, just re-laid-out. Exactly one of the two
            is in the layout at a time: the hidden one has no size, so its
            useInView is false and its interval never starts. */}
        <div className="md:hidden">
          <Flow
            {...mobileGraph}
            mode="loop"
            step={1000}
            canvasOnMobile
            compact
            label={`${beat.name} workflow`}
          />
        </div>
        {/* md+: the authored column count, full card anatomy. Its stepper is
            the sr-only one at this breakpoint, so screen readers still get
            exactly one list per beat. */}
        <div className="hidden md:block">
          <Flow
            {...graph}
            mode="loop"
            step={1000}
            label={`${beat.name} workflow`}
          />
        </div>
      </motion.div>
    </div>
  );
}

/** §04b The Automation Stage, the home page's centerpiece and its one dark
 *  cinematic cut. It sits directly under Work on purpose: the reader has just
 *  watched six live sites, the strongest possible moment to say "and then we
 *  make it run itself". Four signature systems build themselves on scroll and
 *  hand off to the live console. The whole section is wrapped in `.stage`, so
 *  the light page inverts to off-black and the Flow engine gets the background
 *  it was art-directed for. */
export function AutomationLab() {
  const { eyebrow, title, sub, beats, cta } = HOME_AUTOMATION_STORY;

  return (
    // The dark `.stage` cut is gone: it was the only inversion left on the
    // page and read as a different site rather than a deliberate change of
    // register. Paper like everything else, separated by rule lines instead.
    <Section id="automation-lab" shell={false} className="isolate overflow-hidden border-y border-line">
      <Shell>
      {/* the section's own type treatment: words rise out of a mask, rather
          than the typing in Build or the character fade in Work, three
          sections running the same effect reads as a template */}
      <SectionHeader eyebrow={eyebrow} title={<MaskText text={title} />} />

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

      {/* The payoff, the live console first (the real, running product), the
          full Lab second. It waits out the last beat above it: this line is the
          conclusion of the four systems, so arriving alongside the fourth one
          reads as a caption rather than a close. */}
      <div className="mt-24 flex flex-col items-start gap-8 border-t border-line pt-12 md:flex-row md:items-center md:justify-between">
        <Reveal delay={PAYOFF_DELAY}>
          <p className="max-w-md font-display text-2xl font-medium leading-snug tracking-tight text-ink">
            Sixteen of these are already running. Go open one.
          </p>
        </Reveal>

        <Reveal delay={PAYOFF_DELAY + STAGGER.base}>
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
              <span className="link-shine border-b border-accent pb-1">{cta.lab.label}</span>
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
      </Shell>
    </Section>
  );
}
