"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { DUR, EASE, SPRING, Z } from "@/lib/constants";
import { FINE_POINTER, useMediaQuery } from "@/lib/media";

/* A label that trails the pointer and names what a click will do on media:
   "Play" on a review, "Open" on a live-site poster, "View" on a concept row.
   It reads `data-cursor` from whatever is under the pointer, so any element
   opts in with one attribute.

   The native cursor stays; this only annotates it. Mouse and trackpad only
   (fine pointer with hover), and never under reduced motion. Nothing renders
   until the client has checked both, so the server markup is the same for
   everyone. Pointer position lives in motion values, never React state. */
export function CursorLabel() {
  const fine = useMediaQuery(FINE_POINTER);
  const calm = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !calm;
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, SPRING.cursor);
  const sy = useSpring(y, SPRING.cursor);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      const next = target?.getAttribute("data-cursor") ?? null;
      setLabel((prev) => (prev === next ? prev : next));
    };
    const onLeave = () => setLabel(null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy, zIndex: Z.cursor }}
      className="pointer-events-none fixed top-0 left-0"
    >
      <AnimatePresence>
        {label ? (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
            className="absolute top-4 left-4 rounded-full bg-accent-solid px-3.5 py-1.5 font-mono text-xs font-medium whitespace-nowrap text-accent-ink shadow-[0_12px_28px_-12px_var(--shadow-tint)]"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
