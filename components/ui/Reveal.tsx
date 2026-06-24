"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/constants";

/** Lightweight scroll-reveal. Enters once when it hits the viewport.
 *  Storytelling: content arrives in sequence as you scroll. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  );
}
