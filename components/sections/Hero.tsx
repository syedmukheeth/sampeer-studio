"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { EASE, DUR, STAGGER } from "@/lib/constants";
import { NoiseField } from "@/components/ui/NoiseField";
import { ShapeGrid } from "@/components/ui/ShapeGrid";
import { MaskText } from "@/components/ui/MaskText";
import { VariableProximity } from "@/components/ui/VariableProximity";
import { ShinyText } from "@/components/ui/ShinyText";
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
        borderColor="rgba(63, 97, 82, 0.16)"
        hoverFillColor="rgba(63, 97, 82, 0.08)"
        shape="square"
      />
      {/* seat the type: fade the noise field out to the paper canvas at the
          edges so the near-black headline sits on a calm, near-solid centre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_42%,rgba(246,242,234,0.9)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-canvas"
      />

      <div className="relative z-10 flex flex-col items-center">

        <h1
          ref={headlineRef}
          className="max-w-6xl leading-[1.02] tracking-[-0.035em] text-[clamp(2.75rem,6.8vw,6.55rem)]"
        >
          {reduce ? (
            <>
              <MaskText text={HERO.lead} mode="mount" delay={0.5} />
              <MaskText
                text={HERO.accent}
                mode="mount"
                delay={accentDelay}
                className="text-accent"
              />
            </>
          ) : (
            <span className="block">
              {/* the words carry their own entrance now (VariableProximity
                  reveals them one at a time); the line only holds the box */}
              <span className="block pb-[0.06em] text-ink">
                <VariableProximity
                  label={HERO.lead}
                  containerRef={headlineRef}
                  fromFontVariationSettings="'wght' 430, 'opsz' 10"
                  toFontVariationSettings="'wght' 950, 'opsz' 58"
                  radius={125}
                  falloff="linear"
                  className="block"
                  reveal={ready}
                  revealDelay={0.35}
                  // the weight wave rides in behind the words, then the cursor
                  // inherits it, one gesture, not two unrelated effects
                  introSweep={ready}
                  introDelay={0.75}
                  introDuration={1.3}
                />
              </span>
              <span className="block pb-[0.12em] text-accent-text">
                <VariableProximity
                  label={HERO.accent}
                  containerRef={headlineRef}
                  fromFontVariationSettings="'wght' 430, 'opsz' 10"
                  toFontVariationSettings="'wght' 1000, 'opsz' 72"
                  radius={135}
                  falloff="linear"
                  className="block"
                  reveal={ready}
                  revealDelay={0.62}
                  introSweep={ready}
                  introDelay={1.1}
                  introDuration={1.3}
                />
              </span>
            </span>
          )}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: DUR.base, delay: 1.25, ease: EASE.out }}
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg"
        >
          <ShinyText
            text={HERO.sub}
            disabled={reduce || !ready}
            speed={2.4}
            delay={0.4}
            color="#6e6e69"
            shineColor="#1a1a19"
            spread={100}
            direction="left"
            yoyo
          />
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? false : ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: DUR.base, delay: 1.6, ease: EASE.out }}
          className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-7"
        >
          {/* primary: the one solid lead strike above the fold */}
          <TrackClick event={EVENTS.ctaClickHero}>
            <Magnetic>
              <a
                href={HERO.ctaPrimary.href}
                className="inline-flex items-center rounded-md bg-accent-solid px-6 py-3 font-sans text-sm font-medium text-accent-ink transition-[transform,background-color] duration-300 hover:bg-accent active:scale-[0.98]"
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
