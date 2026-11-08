"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ABOUT, CHAPTERS, FOUNDER, FOUNDER_MEDIA, SOCIALS } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { ramp } from "@/lib/scroll";
import { PARALLAX } from "@/lib/constants";

/* Behind the studio: the one chapter in Syed's own voice. An editorial collage
   of his photographs and one short film tile, each layer drifting at its own
   rate so the pieces separate in depth as the page moves, beside the words.
   Faces, not stock; the film tile is the only place his eyes are on camera
   without sunglasses, which is why it is there. */

function useDrift(progress: MotionValue<number>, amount: number) {
  const reduce = useReducedMotion();
  const still = useRef(false);
  useEffect(() => {
    still.current = Boolean(reduce);
  }, [reduce]);
  // function form, so Motion keeps it on the real scroll (see lib/scroll.ts)
  return useTransform(progress, (p) => (still.current ? "0%" : `${ramp(p, [0, 1], [amount, -amount])}%`));
}

function NightTile() {
  const v = useRef<HTMLVideoElement>(null);

  // plays only while on screen, never under reduced motion
  useEffect(() => {
    const el = v.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.getAttribute("src")) el.src = FOUNDER_MEDIA.film.src;
          void el.play().catch(() => {});
        } else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={v}
      muted
      loop
      playsInline
      preload="none"
      poster={FOUNDER_MEDIA.film.poster}
      aria-label={FOUNDER_MEDIA.film.label}
      className="mono absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Collage() {
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const slow = useDrift(scrollYProgress, PARALLAX * 0.5);
  const mid = useDrift(scrollYProgress, PARALLAX);
  const fast = useDrift(scrollYProgress, PARALLAX * 1.6);

  return (
    <div ref={box} className="relative grid grid-cols-6 gap-3 md:block md:h-[clamp(36rem,56vw,48rem)]">
      <motion.figure
        data-parallax
        style={{ y: slow }}
        className="relative col-span-6 aspect-3/4 overflow-hidden rounded-2xl bg-elevated md:absolute md:top-0 md:left-0 md:w-[60%]"
      >
        <Image
          src={FOUNDER_MEDIA.portrait.src}
          alt={FOUNDER_MEDIA.portrait.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 55vw, 100vw"
          className="mono object-cover"
        />
      </motion.figure>

      <motion.div
        data-parallax
        style={{ y: fast }}
        className="relative col-span-2 aspect-9/16 overflow-hidden rounded-2xl bg-elevated md:absolute md:top-[6%] md:right-[4%] md:w-[26%]"
      >
        <NightTile />
      </motion.div>

      <motion.figure
        data-parallax
        style={{ y: mid }}
        className="relative col-span-4 aspect-4/3 self-end overflow-hidden rounded-2xl bg-elevated md:absolute md:right-0 md:bottom-0 md:z-10 md:w-[54%] md:border-[6px] md:border-canvas"
      >
        <Image
          src={FOUNDER_MEDIA.wide.src}
          alt={FOUNDER_MEDIA.wide.alt}
          fill
          sizes="(min-width: 1024px) 26vw, (min-width: 768px) 50vw, 66vw"
          className="mono object-cover"
        />
      </motion.figure>
    </div>
  );
}

export function About() {
  return (
    <Section id="about">
      <ChapterRule chapter={CHAPTERS.founder} />

      <div className="mt-14 grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Collage />
        </div>

        <div className="lg:col-span-5">
          <FadeIn>
            <h2 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.02] font-[600] tracking-[-0.05em] text-ink">
              {ABOUT.title}
            </h2>
          </FadeIn>
          <div className="mt-8 space-y-5">
            {ABOUT.body.map((p, i) =>
              i === ABOUT.body.length - 1 ? (
                <FadeIn key={i}>
                  <p className="border-l-2 border-accent pl-5 font-display text-xl leading-snug font-[560] tracking-[-0.03em] text-ink md:text-2xl">
                    {p}
                  </p>
                </FadeIn>
              ) : (
                <FadeIn key={i}>
                  <p className="max-w-[56ch] font-sans text-base leading-relaxed text-muted md:text-lg">{p}</p>
                </FadeIn>
              ),
            )}
          </div>

          <p className="mt-8 font-sans text-sm text-muted">
            <span className="font-medium text-ink">{FOUNDER.name}</span>
            <span className="mx-2 text-faint">·</span>
            {FOUNDER.role}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {Object.values(SOCIALS).map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-elevated px-4 font-sans text-sm text-ink hover:border-ink"
                >
                  {s.handle}
                  <ArrowUpRight size={13} weight="bold" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
