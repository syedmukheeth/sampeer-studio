"use client";

import { A_IMPACT, A_IMPACT_HEADER } from "@/lib/content-automations";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Section A6: What it's worth. Honest impact ranges, rendered as compact proof. */
export function Impact() {
  return (
    <Section id="impact">
        <Reveal from="left">
          <SectionHeader title={A_IMPACT_HEADER.title} />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {A_IMPACT.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06}>
              <div className="h-full bg-canvas p-7">
                <CountUp
                  value={"value" in m ? m.value : undefined}
                  text={"text" in m ? m.text : undefined}
                  suffix={"suffix" in m ? m.suffix : undefined}
                  className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl"
                />
                <p className="mt-4 font-sans text-sm text-ink">{m.label}</p>
                <p className="mt-1 font-sans text-xs text-faint">{m.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
    </Section>
  );
}
