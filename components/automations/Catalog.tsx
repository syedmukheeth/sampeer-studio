"use client";

import { useMemo, useState } from "react";
import { A_CATALOG, A_CATALOG_HEADER } from "@/lib/content-automations";
import { serpentine } from "@/lib/flow";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Flow } from "@/components/ui/Flow";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";

/** One card. Its diagram only runs while the card is hovered OR focused —
 *  hover-only would make ten of these unreachable from a keyboard, and
 *  running all ten at once would cook the page. */
function Card({
  item,
  index,
}: {
  item: (typeof A_CATALOG)[number];
  index: number;
}) {
  const [play, setPlay] = useState(false);
  const graph = useMemo(() => serpentine(item.steps, 2), [item.steps]);
  const href = "href" in item ? item.href : undefined;

  return (
    <Reveal delay={(index % 3) * 0.06}>
      <TiltCard max={5}>
        <div
          tabIndex={0}
          onMouseEnter={() => setPlay(true)}
          onMouseLeave={() => setPlay(false)}
          onFocus={() => setPlay(true)}
          onBlur={() => setPlay(false)}
          className="group flex h-full flex-col rounded-md border border-line bg-elevated/40 p-5 transition-colors duration-500 hover:border-accent/40 hover:bg-elevated-2 focus-visible:border-accent focus-visible:bg-elevated-2 focus-visible:outline-none"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-medium text-ink">
              {item.name}
            </h3>
            {href && (
              <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-accent">
                Live
              </span>
            )}
          </div>
          <p className="mt-2 min-h-12 font-sans text-sm leading-relaxed text-muted">
            {item.blurb}
          </p>
          <div className="mt-5">
            <Flow
              {...graph}
              mode="sequence"
              play={play}
              step={700}
              compact
              label={`${item.name} workflow`}
            />
          </div>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 self-start font-sans text-sm font-medium text-accent transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:underline"
            >
              Try it live
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </TiltCard>
    </Reveal>
  );
}

/** §A3 The stack. Ten systems, each one a live diagram rather than an icon. */
export function Catalog() {
  return (
    <Section id="stack">
        <SectionHeader
          eyebrow={A_CATALOG_HEADER.eyebrow}
          title={A_CATALOG_HEADER.title}
        />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {A_CATALOG_HEADER.sub}
        </p>
        <a
          href={A_CATALOG_HEADER.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-sans text-sm font-medium text-accent transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {A_CATALOG_HEADER.cta.label}
          <span aria-hidden>→</span>
        </a>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {A_CATALOG.map((item, i) => (
            <Card key={item.id} item={item} index={i} />
          ))}
        </div>
    </Section>
  );
}
