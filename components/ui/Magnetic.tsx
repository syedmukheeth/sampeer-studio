"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/** Magnetic hover. Wrapper drifts toward the cursor, springs back on leave.
 *  Continuous pointer values stay OUT of React state (motion values only).
 *
 *  Renders one shape regardless of `reduce` — see TiltCard for why: the server
 *  can't know the preference, so branching the markup here desyncs hydration
 *  for reduced-motion users. The springs just never leave 0. */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  // centre is read once on enter — no layout read per mousemove
  const centre = useRef<{ cx: number; cy: number } | null>(null);

  function onEnter() {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    centre.current = { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  }
  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    const c = centre.current;
    if (reduce || !c) return;
    x.set((e.clientX - c.cx) * strength);
    y.set((e.clientY - c.cy) * strength);
  }
  function reset() {
    centre.current = null;
    if (reduce) return;
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
