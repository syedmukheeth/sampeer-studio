"use client";

import { motion, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import {
  A_TRANSFORM,
  A_CHAOS_FLOW,
  A_ORDER_FLOW,
} from "@/lib/content-automations";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Shell } from "@/components/ui/Shell";
import { Flow } from "@/components/ui/Flow";
import { BuildSequence } from "@/components/automations/BuildSequence";
import { EASE, DUR } from "@/lib/constants";

/** §A2 The transform — the signature moment of the page. One sticky canvas,
 *  one scroll timeline: the chaos graph assembles itself piece by piece
 *  (0 → 0.42), collapses (0.44 → 0.52), and the wired machine constructs on
 *  the same grid (0.52 → 0.97). Nothing exists before your scroll builds it;
 *  nothing moves after it stands. Both graphs share a 4-wide grid so the swap
 *  reads as the same business rewired, not two unrelated diagrams. */
export function Transform() {
  const reduce = useReducedMotion();

  return (
    <Section id="transform" shell={false} size="flush" className="py-28 md:pb-0 md:pt-40">
      <Shell>
        <SectionHeader title={A_TRANSFORM.title} />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {A_TRANSFORM.sub}
        </p>
      </Shell>

      {/* ---- desktop: one sticky canvas, scroll constructs both machines ---- */}
      <div className="hidden md:block">
        <BuildSequence height="300vh">
          {(progress) => <TransformCanvas progress={progress} />}
        </BuildSequence>
      </div>

      {/* ---- mobile: no scrub. Two stacked steppers, labelled. ---- */}
      <Shell className="mt-12 md:hidden">
        <div className="grid gap-10">
          {[
            { copy: A_TRANSFORM.before, flow: A_CHAOS_FLOW, chaos: true },
            { copy: A_TRANSFORM.after, flow: A_ORDER_FLOW, chaos: false },
          ].map(({ copy, flow, chaos }) => (
            <motion.div
              key={copy.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
              className="rounded-md border border-line p-5"
            >
              <p
                className={`mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] ${
                  chaos ? "text-faint" : "text-accent"
                }`}
              >
                {copy.label}
              </p>
              <Flow
                {...flow}
                mode="static"
                tone={chaos ? "chaos" : "default"}
                label={`${copy.label}, ${copy.caption}`}
              />
              <p className="mt-2 font-sans text-sm text-muted">{copy.caption}</p>
            </motion.div>
          ))}
        </div>
      </Shell>
    </Section>
  );
}

/** The sticky stage. Splits the master timeline into the chaos build, the
 *  collapse beat, and the order build; captions ride the same windows. */
function TransformCanvas({ progress }: { progress: MotionValue<number> }) {
  // chaos assembles across the first 42% of the region's scroll
  const chaosBuild = useTransform(progress, [0.02, 0.42], [0, 1], { clamp: true });
  // then the whole broken machine falls away in one short beat
  const chaosOut = useTransform(progress, [0.44, 0.52], [1, 0], { clamp: true });
  // and the wired machine constructs on the same grid
  const orderBuild = useTransform(progress, [0.52, 0.97], [0, 1], { clamp: true });

  const beforeCaption = useTransform(progress, [0.06, 0.12, 0.44, 0.5], [0, 1, 1, 0]);
  const afterCaption = useTransform(progress, [0.54, 0.6], [0, 1]);

  return (
    <Shell className="w-full">
      <div className="grid">
        {/* stacked in one grid cell so the taller graph sets the height and
            neither jumps when the other fades */}
        <motion.div className="col-start-1 row-start-1" style={{ opacity: chaosOut }}>
          <Flow
            {...A_CHAOS_FLOW}
            mode="build"
            tone="chaos"
            progress={chaosBuild}
            label={`${A_TRANSFORM.before.label}, ${A_TRANSFORM.before.caption}`}
          />
        </motion.div>

        <div className="col-start-1 row-start-1">
          <Flow
            {...A_ORDER_FLOW}
            mode="build"
            progress={orderBuild}
            label={`${A_TRANSFORM.after.label}, ${A_TRANSFORM.after.caption}`}
          />
        </div>
      </div>

      <div className="mt-10 flex justify-between gap-8 font-sans text-sm">
        <motion.p style={{ opacity: beforeCaption }} className="max-w-xs text-faint">
          <span className="mb-1 block text-xs font-medium uppercase tracking-[0.18em]">
            {A_TRANSFORM.before.label}
          </span>
          {A_TRANSFORM.before.caption}
        </motion.p>
        <motion.p
          style={{ opacity: afterCaption }}
          className="max-w-xs text-right text-muted"
        >
          <span className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {A_TRANSFORM.after.label}
          </span>
          {A_TRANSFORM.after.caption}
        </motion.p>
      </div>
    </Shell>
  );
}
