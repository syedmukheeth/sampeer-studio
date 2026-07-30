"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/**
 * MASK TEXT, the site's signature type treatment. Words rise out of a
 * clipping mask, one after another: the verdict assembles itself.
 *
 * It now only does that on mount, in the home Hero. `inView` renders the same
 * text plainly: a headline further down the page that waits for the scroll to
 * reach it means the reader arrives at a blank block and watches it fill,
 * which reads as a page still loading rather than as a flourish. The mode is
 * kept as the default so the call sites stay declarative about intent.
 *
 * Word spacing comes from margin on the mask wrapper, a trailing space
 * INSIDE an inline-block gets trimmed and the words jam together.
 *
 * Reduced motion: durations collapse to 0, markup never branches, so the
 * server and client always agree on the tree (hydration-safe).
 */
export function MaskText({
  text,
  className,
  mode = "inView",
  delay = 0,
}: {
  text: string;
  className?: string;
  /** "mount" plays on load (hero); "inView" waits for the scroll to arrive */
  mode?: "mount" | "inView";
  /** seconds before the first word moves */
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (mode === "inView") {
    return <span className={`block ${className ?? ""}`}>{text}</span>;
  }

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : STAGGER.tight,
        delayChildren: reduce ? 0 : delay,
      },
    },
  };
  const word = {
    hidden: { y: "115%" },
    show: {
      y: 0,
      transition: { duration: reduce ? 0 : DUR.hero, ease: EASE.out },
    },
  };

  const parts = text.split(" ");

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className={`block ${className ?? ""}`}
    >
      {parts.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          style={{ marginRight: i < parts.length - 1 ? "0.26em" : 0 }}
        >
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
