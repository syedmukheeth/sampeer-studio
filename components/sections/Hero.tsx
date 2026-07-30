"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { HERO } from "@/lib/content";
import { STAGGER } from "@/lib/constants";
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
  const sectionRef = useRef<HTMLElement>(null);

  // the accent line starts after the lead line's words have cascaded
  const leadWords = HERO.lead.split(" ").length;
  const accentDelay = 0.5 + leadWords * STAGGER.tight;

  /* Ambient depth on the way out. The backdrop drifts down and dims as the
     hero leaves, so the type separates from its own texture instead of the
     whole section sliding away as one flat plane.

     Scrubbed, not timed: every frame is a scroll position the reader chose,
     which is why this can be continuous motion without becoming something
     they wait on. Amplitude is deliberately small, and reduced motion flattens
     the ranges rather than branching the markup, so the tree is identical on
     the server and on both kinds of client. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backdropY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "14%"],
  );
  const backdropOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduce ? [1, 1] : [1, 0.3],
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <motion.div
        aria-hidden
        style={{ y: backdropY, opacity: backdropOpacity }}
        className="pointer-events-none absolute inset-0"
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
      </motion.div>

      {/* The veils stay outside the drifting layer. They exist to fade the
          texture into the paper at the section's own edges, so they have to
          hold still against those edges while the texture moves under them. */}
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
          className="max-w-6xl font-display font-bold leading-[1.02] tracking-normal text-[clamp(2.15rem,6.8vw,6.55rem)]"
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
        <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">
          {HERO.sub}
        </p>

        <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
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
            className="group inline-flex items-center gap-2 py-1.5 font-sans text-sm font-medium text-ink"
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
        </div>
      </div>
    </section>
  );
}
