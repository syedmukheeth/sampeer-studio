"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  A_INDUSTRIES,
  A_INDUSTRIES_HEADER,
  A_INDUSTRY_COLS,
} from "@/lib/content-automations";
import { serpentine } from "@/lib/flow";
import { Shell } from "@/components/ui/Shell";
import { SectionHeader } from "@/components/ui/Section";
import { Flow } from "@/components/ui/Flow";
import { EASE, DUR } from "@/lib/constants";
import { track, EVENTS } from "@/lib/analytics";

/** §A5 Same principles, different machine. Picking a tab rebuilds the graph.
 *  Tabs follow the APG tabs pattern: one tab stop for the whole list, arrows
 *  move between them. The active underline reuses the layoutId trick from
 *  sections/Nav so the indicator slides rather than blinks. */
export function Industries() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = A_INDUSTRIES[active];
  const graph = useMemo(
    () => serpentine(current.steps, A_INDUSTRY_COLS),
    [current.steps],
  );

  function select(i: number) {
    setActive(i);
    track(EVENTS.industrySelect, { industry: A_INDUSTRIES[i].id });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const last = A_INDUSTRIES.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="industries" className="relative py-28 md:py-40">
      <Shell>
        <SectionHeader
          eyebrow={A_INDUSTRIES_HEADER.eyebrow}
          title={A_INDUSTRIES_HEADER.title}
        />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {A_INDUSTRIES_HEADER.sub}
        </p>

        <div
          role="tablist"
          aria-label={A_INDUSTRIES_HEADER.eyebrow}
          onKeyDown={onKeyDown}
          className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-line pb-3"
        >
          {A_INDUSTRIES.map((ind, i) => {
            const on = i === active;
            return (
              <button
                key={ind.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${ind.id}`}
                aria-selected={on}
                aria-controls={`panel-${ind.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={`relative pb-2 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:text-ink ${
                  on ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {ind.name}
                {on && (
                  <motion.span
                    layoutId="industry-active"
                    className="absolute -bottom-3.5 left-0 h-px w-full bg-accent"
                    transition={{ duration: DUR.fast, ease: EASE.out }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
            >
              <Flow
                {...graph}
                mode="loop"
                step={800}
                label={`${current.name} workflow`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Shell>
    </section>
  );
}
