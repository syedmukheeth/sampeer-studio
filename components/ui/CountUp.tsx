"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

/** Scroll count-up. Number animates from 0 once it enters view.
 *  Supports decimals (8.6K) and thousands grouping (12,400).
 *  Feedback: rewards the scroll, signals the proof is real. */
export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });

  const format = (v: number) =>
    decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString("en-US");

  useEffect(() => {
    if (reduce) return;
    if (inView) mv.set(value);
  }, [inView, value, mv, reduce]);

  useEffect(() => {
    if (reduce) return;
    return spring.on("change", (v) => {
      if (ref.current) ref.current.firstChild!.textContent = format(v);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spring, reduce]);

  /**
   * Reduced motion still has to ARRIVE at the number — it just can't count up
   * to it. Jumping there during render would desync SSR: the server has no
   * matchMedia, so it always renders 0, and a reduced-motion client rendering
   * the final value on first paint is a hydration mismatch. Write it after
   * mount instead, where the server never sees it.
   */
  useEffect(() => {
    if (!reduce || !ref.current) return;
    ref.current.firstChild!.textContent = format(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, value]);

  return (
    <span ref={ref} className={className}>
      <span>{format(0)}</span>
      {suffix}
    </span>
  );
}
