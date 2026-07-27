"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DUR, STAGGER } from "@/lib/constants";

/** Hand-set per-word scatter. Hardcoded rather than random for the same reason
 *  the nav's is: Math.random() differs between the server and client renders,
 *  and text that lands in a genuinely random arrangement reads as a bug. */
const DROP = [
  { y: -70, rot: -9 },
  { y: -104, rot: 7 },
  { y: -84, rot: -5 },
  { y: -120, rot: 10 },
  { y: -76, rot: -7 },
  { y: -96, rot: 4 },
  { y: -112, rot: -11 },
  { y: -88, rot: 6 },
];

type FallingTextProps = {
  text: string;
  className?: string;
  /** seconds before the first word drops, once the block is in view */
  startDelay?: number;
};

/**
 * Words fall in and settle, one after another.
 *
 * A physics engine is the obvious way to build this and the wrong one here: a
 * solver would add a dependency and, worse, a permanent rAF loop for an effect
 * that plays once. A single GSAP timeline rides GSAP's shared ticker, which
 * parks itself the moment no tween is active, so this costs nothing at rest.
 *
 * The words are real spans in the server-rendered markup, not split at runtime,
 * so the sentence is in the HTML for a crawler and for anyone whose JS never
 * arrives. The container carries the readable label and the spans are hidden
 * from the accessibility tree, so a screen reader hears one sentence rather
 * than a list of words.
 */
export function FallingText({ text, className = "", startDelay = 0 }: FallingTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Bail before touching a single style: under reduced motion the text should
    // simply be there, which is exactly what the server already rendered.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tl: gsap.core.Timeline | null = null;
    let io: IntersectionObserver | null = null;
    let cancelled = false;

    // Fonts first: measuring the fallback face lands every word a few pixels
    // off its final position.
    const run = () => {
      if (cancelled || !el.isConnected) return;
      const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-falling-word]"));
      if (targets.length === 0) return;

      targets.forEach((word, i) => {
        const { y, rot } = DROP[i % DROP.length];
        gsap.set(word, { y, rotate: rot, autoAlpha: 0 });
      });

      // IntersectionObserver, not ScrollTrigger: Lenis owns the scroll and is
      // not wired into ScrollTrigger's ticker, so a trigger here never fires.
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          tl = gsap.timeline({ delay: startDelay });
          tl.to(targets, {
            y: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: DUR.base,
            // the overshoot is what sells the drop without a solver: each word
            // arrives past its mark and settles back
            ease: "back.out(1.4)",
            stagger: STAGGER.base,
            force3D: true,
          });
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    };

    document.fonts.ready.then(run).catch(run);

    return () => {
      cancelled = true;
      io?.disconnect();
      tl?.kill();
    };
  }, [text, startDelay]);

  return (
    <span ref={ref} aria-label={text} className={`inline-block ${className}`.trim()}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block whitespace-pre" data-falling-word>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

export default FallingText;
