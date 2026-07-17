"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  A_TRANSFORM,
  A_CHAOS_FLOW,
  A_ORDER_FLOW,
} from "@/lib/content-automations";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Flow } from "@/components/ui/Flow";
import { EASE, DUR } from "@/lib/constants";

/** §A2 The transform. Scrolling this section cross-fades the chaos graph into
 *  the wired one — the argument of the whole page, made once, without a
 *  paragraph. useScroll/useTransform (same dialect as ui/Spine), NOT GSAP:
 *  GSAP on this site is reserved for pinning (see sections/Work).
 *
 *  Both graphs are authored on the same 4x2 grid so the swap reads as the same
 *  business rewired, not two unrelated diagrams. */
export function Transform() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 75%"],
  });

  // The two graphs share a grid cell, so any overlap window renders both sets
  // of labels on top of each other and you read garbage. The windows are
  // strictly sequential — chaos is fully gone at 0.46, order starts there —
  // so the swap reads as a cut, not a dissolve into mush.
  const chaosOpacity = useTransform(scrollYProgress, [0.28, 0.46], [1, 0]);
  const orderOpacity = useTransform(scrollYProgress, [0.46, 0.64], [0, 1]);

  return (
    <Section id="transform">
        <SectionHeader title={A_TRANSFORM.title} />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {A_TRANSFORM.sub}
        </p>

        {/* ---- desktop: one canvas, two states, driven by scroll ---- */}
        <div ref={ref} className="relative mt-16 hidden md:block">
          <div className="grid">
            {/* stacked in one grid cell so the taller graph sets the height
                and neither jumps when the other fades */}
            {/* The scroll-linked opacity is NOT gated on reduced motion, and
                that's deliberate: it's tied to scroll position rather than
                playing on its own, and a cross-fade is the standard
                replacement for motion, not a trigger. Gating it on `reduce`
                would also desync hydration — the server can't know. */}
            <motion.div
              className="col-start-1 row-start-1"
              style={{ opacity: chaosOpacity }}
            >
              <Flow
                {...A_CHAOS_FLOW}
                mode="static"
                tone="chaos"
                label={`${A_TRANSFORM.before.label}, ${A_TRANSFORM.before.caption}`}
              />
            </motion.div>

            <motion.div
              className="col-start-1 row-start-1"
              style={{ opacity: orderOpacity, willChange: "opacity" }}
            >
              <Flow
                {...A_ORDER_FLOW}
                mode="loop"
                label={`${A_TRANSFORM.after.label}, ${A_TRANSFORM.after.caption}`}
              />
            </motion.div>
          </div>

          <div className="mt-10 flex justify-between gap-8 font-sans text-sm">
            <motion.p
              style={{ opacity: chaosOpacity }}
              className="max-w-xs text-faint"
            >
              <span className="mb-1 block font-medium uppercase tracking-[0.18em] text-xs">
                {A_TRANSFORM.before.label}
              </span>
              {A_TRANSFORM.before.caption}
            </motion.p>
            <motion.p
              style={{ opacity: orderOpacity }}
              className="max-w-xs text-right text-muted"
            >
              <span className="mb-1 block font-medium uppercase tracking-[0.18em] text-xs text-accent">
                {A_TRANSFORM.after.label}
              </span>
              {A_TRANSFORM.after.caption}
            </motion.p>
          </div>
        </div>

        {/* ---- mobile: no crossfade. Two stacked steppers, labelled.
                A dissolve you can't scrub is just a flicker on a phone. ---- */}
        <div className="mt-12 grid gap-10 md:hidden">
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
    </Section>
  );
}
