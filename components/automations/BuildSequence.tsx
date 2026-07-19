"use client";

import { useRef } from "react";
import { useScroll, type MotionValue } from "motion/react";
import { clsx } from "clsx";

/**
 * The scroll engine behind every "diagram builds itself" moment on
 * /automations. A tall wrapper gives the scrollbar room; the canvas inside is
 * `sticky`, so the page appears to hold still while progress 0..1 constructs
 * the machine. Plain useScroll over native scroll — no GSAP pin, no hijack:
 * the user can always keep scrolling straight through.
 *
 * `height` is the scroll budget. Size it from the node count
 * (roughly nodes * FLOW_STEP px, see lib/constants) — too short and the build
 * feels like a slideshow, too long and it drags.
 */
export function BuildSequence({
  height,
  className,
  children,
}: {
  /** CSS height of the scroll region, e.g. "280vh" */
  height: string;
  className?: string;
  /** render prop receiving scroll progress 0..1 across the region */
  children: (progress: MotionValue<number>) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} style={{ height }} className={clsx("relative", className)}>
      <div className="sticky top-0 flex min-h-[100dvh] flex-col justify-center">
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
