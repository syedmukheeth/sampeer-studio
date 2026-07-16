"use client";

import { A_IMPACT, A_IMPACT_HEADER } from "@/lib/content-automations";
import { Shell } from "@/components/ui/Shell";
import { SectionHeader } from "@/components/ui/Section";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** §A6 What it's worth. Every figure here is a stand-in — see the `// mock`
 *  tags in lib/content-automations. Swap the data, not this file. */
export function Impact() {
  return (
    <section id="impact" className="relative py-28 md:py-40">
      <Shell>
        <SectionHeader
          eyebrow={A_IMPACT_HEADER.eyebrow}
          title={A_IMPACT_HEADER.title}
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {A_IMPACT.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06}>
              <div className="h-full bg-canvas p-7">
                <CountUp
                  value={m.value}
                  suffix={m.suffix}
                  decimals={"decimals" in m ? m.decimals : 0}
                  className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl"
                />
                <p className="mt-4 font-sans text-sm text-ink">{m.label}</p>
                <p className="mt-1 font-sans text-xs text-faint">{m.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
