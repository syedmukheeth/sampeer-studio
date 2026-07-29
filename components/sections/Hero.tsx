"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";
import { NoiseField } from "@/components/ui/NoiseField";
import { ShapeGrid } from "@/components/ui/ShapeGrid";
import { MaskText } from "@/components/ui/MaskText";
import { Magnetic } from "@/components/ui/Magnetic";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/** §01 The verdict. Words mask-reveal up out of the noise field; the second
 *  line carries the page's accent strike. The CTA is deliberately a quiet
 *  anchor, not a button, Nav "Start" owns conversion, and this link doubles
 *  as the scroll affordance and a skip straight to the proof. */
export function Hero() {
  const reduce = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const frame = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(frame);
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      requestAnimationFrame(() => setReady(true));
    }, 50);

    return () => window.clearTimeout(timer);
  }, []);

  // the accent line starts after the lead line's words have cascaded
  const leadWords = HERO.lead.split(" ").length;
  const accentDelay = 0.5 + leadWords * STAGGER.tight;

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* signature noise -> signal field */}
      <NoiseField className="pointer-events-none absolute inset-0 h-full w-full" />
      <ShapeGrid
        // desktop only, same trade as the page-level grid in layout.tsx: a
        // full-viewport canvas animating for the life of the session is a real
        // frame budget on a phone, and it is texture behind the headline
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_58%,transparent_86%)] md:block"
        speed={0.18}
        squareSize={72}
        direction="diagonal"
        borderColor="rgba(109, 40, 217, 0.12)"
        hoverFillColor="rgba(109, 40, 217, 0.06)"
        shape="square"
      />
      {/* seat the type: fade the noise field out to the paper canvas at the
          edges so the near-black headline sits on a calm, near-solid centre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_42%,rgba(247,245,249,0.9)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas"
      />

      <div className="relative z-10 flex flex-col items-center">

        {/* One treatment, not two. The headline used to run VariableProximity:
            every glyph tracked the cursor and rode a weight wave from 430 to
            1000, which meant the first thing a lead saw was type that would not
            hold still, at a weight that kept changing while they read it. The
            mask rise below is the site's own signature, it plays once, and it
            leaves the words at a single deliberate weight. */}
        <h1
          ref={headlineRef}
          className="max-w-6xl font-display font-bold leading-[1.02] tracking-[-0.035em] text-[clamp(2.75rem,6.8vw,6.55rem)]"
        >
          <MaskText text={HERO.lead} mode="mount" delay={0.5} className="text-ink" />
          <MaskText
            text={HERO.accent}
            mode="mount"
            delay={accentDelay}
            className="text-accent-text"
          />
        </h1>

        {/* the sub is the one line that has to be read, so it arrives plain.
            ShinyText swept a light band across it on a loop, which meant part
            of the sentence was always dimmed to below AA on the way past. */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: DUR.base, delay: 1.0, ease: EASE.out }}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg"
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? false : ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: DUR.base, delay: 1.3, ease: EASE.out }}
          className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-7"
        >
          {/* primary: the one solid lead strike above the fold */}
          <TrackClick event={EVENTS.ctaClickHero}>
            <Magnetic>
              <a
                href={HERO.ctaPrimary.href}
                className="btn-press inline-flex items-center rounded-md bg-accent-solid px-6 py-3 font-sans text-sm font-medium text-accent-ink hover:bg-accent"
              >
                {HERO.ctaPrimary.label}
              </a>
            </Magnetic>
          </TrackClick>

          {/* secondary: quiet scroll affordance into the proof */}
          <a
            href={HERO.cta.href}
            className="group inline-flex items-center gap-2 font-sans text-sm font-medium text-ink"
          >
            <span className="link-shine border-b border-line pb-1 transition-colors duration-300 group-hover:border-accent">
              {HERO.cta.label}
            </span>
            <ArrowDown
              size={16}
              weight="bold"
              aria-hidden
              className="text-muted transition-[transform,color] duration-300 group-hover:translate-y-0.5 group-hover:text-accent"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
