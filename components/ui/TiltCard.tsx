"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/** 3D tilt on hover. Tracks cursor, springs flat on leave.
 *  Pointer values driven by motion values, never React state.
 *
 *  Nothing here may branch on `reduce` during render. The server has no
 *  matchMedia, so it always renders the un-reduced tree; a reduced-motion
 *  client that renders a different element (or a different `style`) on first
 *  paint is a hydration mismatch. So the markup is identical either way and
 *  only the handler bodies bail — the springs simply never leave 0, which is
 *  exactly "no tilt". */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 20,
  });

  // rect is read once on enter, not per mousemove — a layout read on every
  // pointer event across ten catalog cards is measurable jank
  const rect = useRef<DOMRect | null>(null);

  function onEnter() {
    if (reduce || !ref.current) return;
    rect.current = ref.current.getBoundingClientRect();
  }
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = rect.current;
    if (reduce || !r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    rect.current = null;
    if (reduce) return;
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
