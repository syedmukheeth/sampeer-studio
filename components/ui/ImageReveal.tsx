"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE, VIEWPORT } from "@/lib/constants";

/**
 * Wipes an image in behind a mask instead of fading it.
 *
 * A fade is what every element on a page does; a photograph arriving behind a
 * moving edge is what makes an image read as a considered exhibit rather than
 * as decoration that happened to load. The mask is a `clip-path` inset, which
 * the compositor handles on its own thread, and the child counter-scales very
 * slightly so the picture settles into place instead of simply being uncovered.
 *
 * Wraps content rather than taking a `src`, so it works over `next/image` with
 * `fill`, a `<figure>`, or anything else, and the caller keeps control of
 * sizing and aspect.
 *
 * Reduced motion resolves to the finished frame with no travel, and the markup
 * never branches, so the server and client always agree on the tree.
 */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** seconds before the wipe starts */
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0 : DUR.slow, delay: reduce ? 0 : delay, ease: EASE.out }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: reduce ? 1 : 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{
          duration: reduce ? 0 : DUR.slow * 1.4,
          delay: reduce ? 0 : delay,
          ease: EASE.out,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
