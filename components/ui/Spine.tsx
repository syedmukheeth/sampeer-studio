"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * THE SIGNAL SPINE.
 * A hairline pinned to the right edge of the page. A faint track (noise) with
 * an indigo fill that grows as you scroll — the story arc made physical:
 * the further you travel, the stronger the signal. A soft node rides the
 * leading edge so the line reads as "alive", not a static scrollbar.
 */
export function Spine() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  // map 0..1 progress to a CSS top percentage for the leading node
  const nodeTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-3 top-0 z-30 hidden h-dvh w-px md:block"
    >
      {/* track */}
      <div className="absolute inset-0 bg-line/70" />
      {/* fill */}
      <motion.div
        style={{ scaleY: reduce ? 1 : progress }}
        className="absolute inset-0 origin-top bg-accent"
      />
      {/* leading node */}
      {!reduce && (
        <motion.div
          style={{ top: nodeTop }}
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        />
      )}
    </div>
  );
}
