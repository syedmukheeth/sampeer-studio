"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  AUTOMATION_TEASER,
  AUTOMATION_TEASER_CHAOS,
  AUTOMATION_TEASER_ORDER,
  AUTOMATION_TEASER_STATES,
} from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Flow } from "@/components/ui/Flow";
import { STAGGER, EASE, DUR } from "@/lib/constants";

/** §04b The doorway to the Growth Automation Lab. Sits directly under Work on
 *  purpose: the reader has just watched six live sites, which is the strongest
 *  possible moment to say "and then we make it run itself".
 *
 *  It used to be static and left the whole show behind a click. Now the show is
 *  here: scrolling this section cross-fades a tangled MANUAL machine into a
 *  WIRED one, with the wired machine running live. Same mechanic and dialect as
 *  /automations Transform (useScroll/useTransform, NOT GSAP — GSAP is reserved
 *  for pinning). The CTA still funnels deeper into the full Lab. */
export function AutomationLab() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 80%"],
  });

  // Strictly sequential windows: chaos is fully gone before order arrives, so
  // the two stacked graphs never render their labels on top of each other.
  const chaosOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0]);
  const orderOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);

  const { before, after } = AUTOMATION_TEASER_STATES;

  return (
    <Section id="automation-lab" className="border-t border-line">
      <SectionHeader
        eyebrow={AUTOMATION_TEASER.eyebrow}
        title={AUTOMATION_TEASER.title}
      />

      <Reveal delay={STAGGER.base}>
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {AUTOMATION_TEASER.sub}
        </p>
      </Reveal>

      {/* ---- desktop: one canvas, two states, driven by scroll ---- */}
      <div ref={ref} className="relative mt-16 hidden md:block">
        <div className="grid">
          {/* stacked in one grid cell so the taller graph sets the height and
              neither jumps when the other fades. The scroll-linked opacity is
              NOT gated on reduced motion — it's tied to scroll position, not
              self-playing, and gating it would desync hydration. */}
          <motion.div
            className="col-start-1 row-start-1"
            style={{ opacity: chaosOpacity }}
          >
            <Flow
              {...AUTOMATION_TEASER_CHAOS}
              mode="static"
              tone="chaos"
              label={`${before.label}, ${before.caption}`}
            />
          </motion.div>

          <motion.div
            className="col-start-1 row-start-1"
            style={{ opacity: orderOpacity, willChange: "opacity" }}
          >
            <Flow
              {...AUTOMATION_TEASER_ORDER}
              mode="loop"
              label={`${after.label}, ${after.caption}`}
            />
          </motion.div>
        </div>

        <div className="mt-10 flex justify-between gap-8 font-sans text-sm">
          <motion.p
            style={{ opacity: chaosOpacity }}
            className="max-w-xs text-faint"
          >
            <span className="mb-1 block font-medium uppercase tracking-[0.18em] text-xs">
              {before.label}
            </span>
            {before.caption}
          </motion.p>
          <motion.p
            style={{ opacity: orderOpacity }}
            className="max-w-xs text-right text-muted"
          >
            <span className="mb-1 block font-medium uppercase tracking-[0.18em] text-xs text-accent">
              {after.label}
            </span>
            {after.caption}
          </motion.p>
        </div>
      </div>

      {/* ---- mobile: no crossfade. Two stacked steppers, labelled.
              A dissolve you can't scrub is just a flicker on a phone. ---- */}
      <div className="mt-12 grid gap-8 md:hidden">
        {[
          { copy: before, flow: AUTOMATION_TEASER_CHAOS, chaos: true },
          { copy: after, flow: AUTOMATION_TEASER_ORDER, chaos: false },
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

      {/* the taste-list of systems still funnels toward the full Lab */}
      <ul className="mt-16 grid max-w-4xl grid-cols-1 sm:grid-cols-2">
        {AUTOMATION_TEASER.systems.map((s, i) => (
          <Reveal
            key={s}
            as="li"
            delay={STAGGER.base * (i + 2)}
            className={`border-t border-line py-5 font-sans text-sm text-muted ${
              i % 2 !== 0 ? "sm:border-l sm:pl-6" : ""
            }`}
          >
            {s}
          </Reveal>
        ))}
      </ul>

      <Reveal delay={STAGGER.base * 6}>
        <Link
          href={AUTOMATION_TEASER.cta.href}
          className="group mt-14 inline-flex items-center gap-2 font-sans text-sm font-medium text-ink"
        >
          <span className="border-b border-accent pb-1">
            {AUTOMATION_TEASER.cta.label}
          </span>
          <ArrowRight
            size={16}
            weight="bold"
            aria-hidden
            className="text-accent transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </Section>
  );
}
