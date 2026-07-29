"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** Live subscription, not a one-shot read, and matching the pattern already used
 *  by ScrollStack: the server has no pointer to inspect, so it answers "no",
 *  the first client render agrees, and the store then upgrades. Deciding this
 *  with `setState` inside an effect is the cascading-render pattern the lint
 *  rules reject, and it would flash the ring in on every load. */
function useFinePointer() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(FINE_POINTER);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

/**
 * A cursor companion: a small ring that trails the pointer and swells over
 * anything clickable.
 *
 * Two hard rules, both of which are why most implementations of this are a
 * liability rather than a flourish:
 *
 *  1. It NEVER replaces the real cursor. The native pointer keeps rendering, so
 *     the OS caret, the text I-beam, and every accessibility affordance built on
 *     top of them survive. This only adds a ring behind it.
 *  2. It only exists for a real mouse. Gated on `(hover: hover) and
 *     (pointer: fine)`, so phones and tablets never mount it, and gated on
 *     reduced motion, because a spring-lagged object tracking the pointer is
 *     exactly the kind of continuous movement that guidance is asking about.
 *
 * The mount is deferred to an effect rather than decided during render: the
 * server cannot know the pointer type, so rendering nothing first and adding
 * the ring on the client keeps the markup identical on both sides.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduce;
  const [hot, setHot] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // low stiffness / high damping: the ring should trail the pointer by a beat,
  // not snap to it, or it reads as a rendering artefact rather than a follower
  const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // `closest` rather than a tag check: the clickable thing is usually a
      // wrapper, and the pointer is generally over a child of it
      const el = e.target as Element | null;
      setHot(
        !!el?.closest?.(
          'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])',
        ),
      );
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
    >
      <motion.span
        animate={{ scale: hot ? 1.9 : 1, opacity: hot ? 0.55 : 0.3 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="block h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent"
      />
    </motion.div>
  );
}
