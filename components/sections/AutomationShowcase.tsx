"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HOME_AUTOMATION_STORY } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Flow } from "@/components/ui/Flow";
import { DUR, EASE } from "@/lib/constants";

/* One live machine at a time. The tabs swap which system is wired; the Flow
   engine runs it on a loop, so the section stays short but never still. */
export function AutomationShowcase() {
  const { eyebrow, title, sub, beats, cta } = HOME_AUTOMATION_STORY;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const beat = beats[active];

  const graph = useMemo(() => serpentine(beat.steps, beat.cols, { payload: beat.payload }), [beat]);
  // phones get two columns and compact cards, three columns left labels at "V…"
  const mobileGraph = useMemo(() => serpentine(beat.steps, 2, { payload: beat.payload }), [beat]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + beats.length) % beats.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="automation" className="border-y border-line bg-elevated-2/60">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted md:text-lg">{sub}</p>

      <div
        role="tablist"
        aria-label="Automation systems"
        onKeyDown={onKey}
        className="-mx-6 mt-12 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0"
      >
        {beats.map((b, i) => {
          const on = i === active;
          return (
            <button
              key={b.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`auto-tab-${b.id}`}
              aria-selected={on}
              aria-controls="auto-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative shrink-0 rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors ${
                on ? "text-accent-ink" : "text-muted hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="auto-tab"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-accent-solid"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                <span className="mr-1.5 tabular-nums opacity-70">{i + 1}</span>
                {b.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="auto-panel"
        role="tabpanel"
        aria-labelledby={`auto-tab-${beat.id}`}
        className="mt-8 grid items-center gap-8 md:grid-cols-12 md:gap-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={beat.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
            className="md:col-span-4"
          >
            <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink">{beat.outcome}</p>
            <a
              href={beat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-1.5 py-1.5 font-sans text-sm font-medium text-accent-text"
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
          </motion.div>
        </AnimatePresence>

        <div className="rounded-lg border border-line bg-canvas p-3 shadow-[0_10px_36px_rgba(30,26,42,0.06)] md:col-span-8 md:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={beat.id}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : DUR.base }}
            >
              <div className="md:hidden">
                <Flow {...mobileGraph} mode="loop" step={1000} canvasOnMobile compact label={`${beat.name} workflow`} />
              </div>
              <div className="hidden md:block">
                <Flow {...graph} mode="loop" step={1000} label={`${beat.name} workflow`} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md font-display text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
          Sixteen of these are already running. Go open one.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={cta.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press group inline-flex items-center gap-2 rounded-md bg-accent-solid px-5 py-3 font-sans text-sm font-medium text-accent-ink hover:bg-accent-dim"
          >
            {cta.live.label}
            <ArrowUpRight size={16} weight="bold" aria-hidden />
          </a>
          <Link href={cta.lab.href} className="group inline-flex items-center gap-2 font-sans text-sm font-medium text-ink">
            <span className="border-b border-accent pb-1">{cta.lab.label}</span>
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden
              className="text-accent transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}
