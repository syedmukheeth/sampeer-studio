"use client";

import { useMemo, useState } from "react";
import { A_CATALOG, A_CATALOG_HEADER } from "@/lib/content-automations";
import { serpentine } from "@/lib/flow";
import { Shell } from "@/components/ui/Shell";
import { SectionHeader } from "@/components/ui/Section";
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

  return (
    <Reveal delay={(index % 3) * 0.06}>
      <TiltCard max={5}>
        <div
          tabIndex={0}
          onMouseEnter={() => setPlay(true)}
          onMouseLeave={() => setPlay(false)}
          onFocus={() => setPlay(true)}
          onBlur={() => setPlay(false)}
          className="group h-full rounded-md border border-line bg-elevated/40 p-5 transition-colors duration-500 hover:border-accent/40 focus-visible:border-accent focus-visible:outline-none"
        >
          <h3 className="font-display text-lg font-medium text-ink">
            {item.name}
          </h3>
          <p className="mt-2 min-h-12 font-sans text-sm leading-relaxed text-muted">
            {item.blurb}
          </p>
          <div className="mt-5">
            <Flow
              {...graph}
              mode="sequence"
              play={play}
              step={700}
              label={`${item.name} workflow`}
            />
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/** §A3 The stack. Ten systems, each one a live diagram rather than an icon. */
export function Catalog() {
  return (
    <section id="stack" className="relative py-28 md:py-40">
      <Shell>
        <SectionHeader
          eyebrow={A_CATALOG_HEADER.eyebrow}
          title={A_CATALOG_HEADER.title}
        />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {A_CATALOG_HEADER.sub}
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {A_CATALOG.map((item, i) => (
            <Card key={item.id} item={item} index={i} />
          ))}
        </div>
      </Shell>
    </section>
  );
}
