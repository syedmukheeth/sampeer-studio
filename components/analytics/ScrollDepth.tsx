"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "motion/react";
import { EVENTS, track } from "@/lib/analytics";

/** Scroll-depth milestones. Uses Motion's scroll progress (motion value),
 *  never a raw scroll listener. Each threshold fires once. */
export function ScrollDepth() {
  const { scrollYProgress } = useScroll();
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    const thresholds = [0.25, 0.5, 0.75, 1];
    return scrollYProgress.on("change", (p) => {
      for (const t of thresholds) {
        if (p >= t && !fired.current.has(t)) {
          fired.current.add(t);
          track(EVENTS.scrollDepth, { depth: Math.round(t * 100) });
        }
      }
    });
  }, [scrollYProgress]);

  return null;
}
