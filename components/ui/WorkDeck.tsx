"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { WORK, type LiveProject, type ProjectKind } from "@/lib/content";
import { DECK_MS, DUR, EASE, SPRING } from "@/lib/constants";
import { track, EVENTS } from "@/lib/analytics";

/* The hero's evidence: the real, live work, dealt like a deck of cards so the
   claim beside it is proven before anyone scrolls. Client work and the product
   only; the concept builds wait for the Work section, where they are labelled.

   Every card is always mounted; a card's depth in the deck (0 = front) drives
   its offset, scale and opacity, so dealing is just a change of `front` and the
   springs do the rest. The front card's stacking order flips instantly, which
   is what makes it read as going to the BACK rather than sliding over the top.

   It deals on a timer only while on screen, not hovered or focused, and in a
   visible tab. Reduced motion never auto-advances; the button still deals. */

const DECK = WORK.filter((p) => p.kind !== "concept");
const KIND: Record<ProjectKind, string> = {
  client: "Client work",
  product: "My product",
  concept: "Concept build",
};
/** how many cards show; the rest wait, invisible, at the back */
const VISIBLE = 3;
/** px each card behind the front one sits higher, and how much it shrinks */
const STEP_Y = 26;
const STEP_SCALE = 0.055;
/** how much darker each card behind the front one gets */
const SHADE = 0.3;

const visit = (p: LiveProject) => () => track(EVENTS.workVisitSite, { client: p.client, from: "hero" });

export function WorkDeck() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [front, setFront] = useState(0);
  const [hold, setHold] = useState(false);

  const deal = useCallback(() => setFront((f) => (f + 1) % DECK.length), []);

  useEffect(() => {
    if (reduce || hold || !inView) return;
    const id = window.setInterval(() => {
      if (!document.hidden) deal();
    }, DECK_MS);
    return () => window.clearInterval(id);
  }, [reduce, hold, inView, deal]);

  const current = DECK[front];

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="Live work"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHold(false);
      }}
    >
      {/* headroom for the cards peeking out above the front one */}
      <div style={{ paddingTop: STEP_Y * (VISIBLE - 1) }}>
        <div className="relative aspect-16/10">
          {DECK.map((p, i) => {
            const depth = (i - front + DECK.length) % DECK.length;
            const isFront = depth === 0;
            return (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={visit(p)}
                aria-hidden={!isFront}
                tabIndex={isFront ? 0 : -1}
                aria-label={`${p.client}, open the live site`}
                initial={false}
                animate={{
                  y: -depth * STEP_Y,
                  scale: 1 - depth * STEP_SCALE,
                  // visible cards stay opaque, so one never shows through
                  // another mid-deal; depth is the shade below instead
                  opacity: depth < VISIBLE ? 1 : 0,
                }}
                transition={reduce ? { duration: 0 } : SPRING.deck}
                style={{ zIndex: DECK.length - depth, transformOrigin: "50% 0%" }}
                className={clsx(
                  "group absolute inset-0 block overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_30px_60px_-30px_var(--shadow-tint)]",
                  !isFront && "pointer-events-none",
                )}
              >
                <Image
                  src={p.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  className="media-zoom object-cover object-top"
                />
                {/* the deeper the card, the further it sinks into the ground */}
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: Math.min(depth * SHADE, SHADE * (VISIBLE - 1)) }}
                  transition={reduce ? { duration: 0 } : SPRING.deck}
                  className="pointer-events-none absolute inset-0 bg-canvas"
                />
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* the caption sits under the deck, never on the screenshot */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
            >
              <p className="font-mono text-xs text-faint">{KIND[current.kind]}</p>
              <p className="mt-1 truncate font-display text-lg font-semibold tracking-[-0.01em] text-ink font-stretch-semi-expanded">
                {current.client}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={visit(current)}
            className="link-wipe inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-accent-text"
          >
            Visit site <ArrowUpRight size={14} weight="bold" aria-hidden />
          </a>
          <button
            type="button"
            onClick={deal}
            aria-label="Show the next project"
            className="btn-press grid h-11 w-11 place-items-center rounded-full border border-line text-ink hover:border-accent"
          >
            <ArrowRight size={16} weight="bold" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
