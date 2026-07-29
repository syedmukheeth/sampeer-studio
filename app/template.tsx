"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE } from "@/lib/constants";

/**
 * Route transition.
 *
 * A template, not a layout, on purpose: Next gives this file a fresh key on
 * every navigation, so it remounts and its enter animation actually plays.
 * A layout persists and would animate exactly once, on first load.
 *
 * The intended implementation was React's `<ViewTransition>` (shared-element
 * morph from a Work card poster into the case-study hero, per
 * `next/dist/docs/01-app/02-guides/view-transitions.md`). That component is not
 * in this install: React 19.2.4 stable exports `startTransition` and
 * `useTransition` and no ViewTransition, and there is no
 * `startViewTransition` call in `next/dist/client`. Rather than hand-roll a
 * router interceptor around the browser API and hope it keeps working, this
 * does the honest version with the library already on the page.
 *
 * Deliberately understated. A page transition is a cost paid before the reader
 * sees anything, so it buys continuity between routes and nothing else: one
 * fast fade with a few pixels of travel. No exit animation, because Next has
 * already swapped the tree by the time this mounts and animating out would
 * only delay the new page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}
