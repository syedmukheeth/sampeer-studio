"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE, RISE } from "@/lib/constants";

/* Short, fast entrance for home-page blocks. `Reveal` stays inert on purpose
   (long scroll reveals read as an unfinished page), so this triggers early and
   travels RISE px in DUR.slow: felt, never waited for.

   `initial` is the same on the server and the client, always. Branching it on
   useReducedMotion made the server HTML (which cannot know the preference)
   disagree with the first client render, and React does not patch attributes
   after a hydration mismatch. Reduced motion is handled by `data-reveal` in
   globals.css instead: the element is simply visible, with no travel. */
export function FadeIn({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;

  return (
    <Tag
      data-reveal
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduce ? 0 : DUR.slow, delay: reduce ? 0 : delay, ease: EASE.out }}
    >
      {children}
    </Tag>
  );
}
