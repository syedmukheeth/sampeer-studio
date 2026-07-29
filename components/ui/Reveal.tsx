"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE_OUT, RISE, VIEWPORT } from "@/lib/constants";

/** Lightweight scroll-reveal. Enters once when it hits the viewport.
 *  Storytelling: content arrives in sequence as you scroll. */
/** Entry offsets. `bottom` is the default everywhere; the others exist so a
 *  page can vary the direction of travel between neighbouring blocks instead
 *  of every element sliding up in lockstep. */
const FROM = {
  bottom: { y: RISE, x: 0 },
  top: { y: -RISE, x: 0 },
  left: { y: 0, x: -RISE * 1.3 },
  right: { y: 0, x: RISE * 1.3 },
} as const;

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p";
  /** which edge the block travels in from */
  from?: keyof typeof FROM;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  const offset = FROM[from];

  // Reduced motion collapses the duration instead of dropping the `initial`
  // frame: the server has no matchMedia, so it always renders the un-reduced
  // markup, and a reduced client that renders something else on first paint is
  // a hydration mismatch. Zero duration lands on the same resolved frame.
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        // was a hardcoded 0.7s with a hardcoded 24/32px travel, so the single
        // most used reveal on the page was the one thing the motion tokens did
        // not actually govern; retuning DUR moved nothing until this was wired
        duration: reduce ? 0 : DUR.base,
        delay: reduce ? 0 : delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </MotionTag>
  );
}
