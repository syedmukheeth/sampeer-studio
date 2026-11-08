"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE } from "@/lib/constants";

/* Short, fast entrance for home-page blocks. `Reveal` stays inert on purpose
   (long scroll reveals read as an unfinished page), so this triggers early and
   travels 14px in DUR.slow: felt, never waited for. */
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
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduce ? 0 : DUR.slow, delay: reduce ? 0 : delay, ease: EASE.out }}
    >
      {children}
    </Tag>
  );
}
