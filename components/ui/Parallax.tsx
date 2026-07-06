"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Scroll parallax. Child drifts vertically as the element travels the viewport.
 * Used on imagery so panels feel like they have depth, not flat stickers.
 * `amount` = px of travel (split +/- around centre).
 */
export function Parallax({
  children,
  amount = 60,
  className,
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="relative h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
