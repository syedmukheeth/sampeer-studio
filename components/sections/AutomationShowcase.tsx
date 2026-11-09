"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CHAPTERS, HOME_AUTOMATION_STORY } from "@/lib/content";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { serpentine, type FlowGraph } from "@/lib/flow";
import { ramp } from "@/lib/scroll";
import { SectionHeader } from "@/components/ui/Section";
import { Shell } from "@/components/ui/Shell";
import { Flow } from "@/components/ui/Flow";
import { BuildSequence } from "@/components/automations/BuildSequence";

const { title, sub, beats, cta } = HOME_AUTOMATION_STORY;
const N = beats.length;

/* The page's one pinned scrub scene, and it carries the story: the reader's
   scroll builds four real systems, one after another, on a single sticky
   canvas. The list on the left lights up in step, each with a link into the
   running console.

   Desktop with motion only (`.auto-pinned`, globals.css). Phones, tablets and
   reduced motion get the same four machines standing still (`.auto-static`):
   a scroll-linked build fights touch scrolling, and under reduced motion
   nothing should assemble itself. The switch is pure CSS, so the server and
   the client always render the same markup.

   The whole chapter is a night panel: the systems run in the dark, like the
   console they link to. */
/** `labLink`: off on /automations itself, where "Step inside the Lab" would point at the page the reader is on. */
export function AutomationShowcase({ labLink = true }: { labLink?: boolean }) {
  const graphs = useMemo(() => beats.map((b) => serpentine(b.steps, b.cols, { payload: b.payload })), []);
  // two columns and compact cards for the narrow static stack
  const compact = useMemo(() => beats.map((b) => serpentine(b.steps, 2, { payload: b.payload })), []);

  return (
    <section id="automation" className="night relative bg-canvas">
      <Shell className="pt-20 md:pt-28">
        <ChapterRule chapter={CHAPTERS.automation} className="mb-10 md:mb-12" />
        <SectionHeader title={title} />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted md:text-lg">{sub}</p>
      </Shell>

      <div className="auto-pinned">
        <BuildSequence height={`${N * 85}vh`}>
          {(progress) => <Stage progress={progress} graphs={graphs} />}
        </BuildSequence>
      </div>

      <Shell className="auto-static pt-12">
        <ol className="grid gap-6 md:grid-cols-2">
          {beats.map((b, i) => (
            <li key={b.id} className="rounded-2xl border border-line bg-elevated p-5 md:p-6">
              <p className="font-mono text-xs text-faint">{b.name}</p>
              <p className="mt-2 font-display text-lg leading-snug font-semibold tracking-[-0.025em] text-ink">
                {b.outcome}
              </p>
              <div className="mt-5">
                <Flow {...compact[i]} mode="static" canvasOnMobile compact label={`${b.name} workflow`} />
              </div>
              <TryIt href={b.href} />
            </li>
          ))}
        </ol>
      </Shell>

      <Shell className="pt-16 pb-20 md:pb-28">
        <div className="flex flex-col items-start gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md font-display text-xl leading-snug font-semibold tracking-[-0.025em] text-ink md:text-2xl">
            {cta.line}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={cta.live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex h-12 items-center gap-2 rounded-full bg-accent-solid px-6 font-sans text-sm font-medium text-accent-ink hover:bg-accent-dim"
            >
              {cta.live.label}
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
            {labLink ? (
              <Link
                href={cta.lab.href}
                className="link-wipe inline-flex items-center gap-2 py-1 font-sans text-sm font-medium text-ink"
              >
                {cta.lab.label}
                <ArrowRight size={16} weight="bold" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </Shell>
    </section>
  );
}

function TryIt({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-wipe mt-4 inline-flex items-center gap-1.5 py-1 font-sans text-sm font-medium text-accent-text"
    >
      {cta.tryIt}
      <ArrowUpRight size={14} weight="bold" aria-hidden />
    </a>
  );
}

/** Each beat owns one Nth of the scroll. It builds across most of its window
 *  and holds for a moment before handing over; the first beat is visible from
 *  the start and the last one stays up at the end. */
function windows(i: number) {
  const a = i / N;
  const b = (i + 1) / N;
  const fade = 0.025;
  const build: [number, number] = [a + 0.015, b - 0.05];
  const stops = i === 0 ? [0, b - fade, b] : i === N - 1 ? [a, a + fade, 1] : [a, a + fade, b - fade, b];
  const on = i === 0 ? [1, 1, 0] : i === N - 1 ? [0, 1, 1] : [0, 1, 1, 0];
  return { build, stops, on };
}

function Stage({ progress, graphs }: { progress: MotionValue<number>; graphs: FlowGraph[] }) {
  return (
    <Shell className="w-full">
      <div className="grid grid-cols-12 items-center gap-12">
        <ol className="col-span-4 space-y-1">
          {beats.map((b, i) => (
            <BeatRow key={b.id} index={i} progress={progress} name={b.name} outcome={b.outcome} href={b.href} />
          ))}
        </ol>

        <div className="col-span-8 rounded-2xl border border-line bg-elevated p-6 shadow-[0_30px_60px_-34px_var(--shadow-tint)]">
          {/* stacked in one grid cell, so the tallest graph sets the height and
              nothing jumps when one machine hands over to the next */}
          <div className="grid">
            {beats.map((b, i) => (
              <BeatFlow key={b.id} index={i} progress={progress} graph={graphs[i]} name={b.name} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function BeatFlow({
  index,
  progress,
  graph,
  name,
}: {
  index: number;
  progress: MotionValue<number>;
  graph: FlowGraph;
  name: string;
}) {
  const w = windows(index);
  const build = useTransform(progress, (p) => ramp(p, w.build, [0, 1]));
  const opacity = useTransform(progress, (p) => ramp(p, w.stops, w.on));
  // a hidden machine must not take clicks or tab stops meant for the visible one
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));

  return (
    <motion.div className="col-start-1 row-start-1" style={{ opacity, visibility }}>
      <Flow {...graph} mode="build" progress={build} label={`${name} workflow`} />
    </motion.div>
  );
}

function BeatRow({
  index,
  progress,
  name,
  outcome,
  href,
}: {
  index: number;
  progress: MotionValue<number>;
  name: string;
  outcome: string;
  href: string;
}) {
  const w = windows(index);
  const opacity = useTransform(progress, (p) => 0.38 + 0.62 * ramp(p, w.stops, w.on));
  const fill = useTransform(progress, (p) => ramp(p, w.build, [0, 1]));

  return (
    <motion.li style={{ opacity }} className="relative py-4 pl-6">
      {/* how far this machine has built: a bare line, no track behind it */}
      <motion.span
        aria-hidden
        style={{ scaleY: fill }}
        className="absolute top-4 bottom-4 left-0 w-px origin-top bg-accent"
      />
      <p className="font-display text-xl font-semibold tracking-[-0.025em] text-ink">
        {name}
      </p>
      <p className="mt-1.5 max-w-xs font-sans text-sm leading-relaxed text-muted">{outcome}</p>
      <TryIt href={href} />
    </motion.li>
  );
}
