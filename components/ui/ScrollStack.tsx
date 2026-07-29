"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

/** Phones and reduced-motion get a plain stack. Read as a live subscription,
 *  not a one-shot check: the effect below only runs on mount, so a viewport
 *  that crosses the breakpoint afterwards used to keep whatever transforms it
 *  had, a desktop-sized page resized down left six cards pinned on top of
 *  each other and over the section beneath. */
const PLAIN = "(max-width: 767px), (prefers-reduced-motion: reduce)";

function usePlainStack() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(PLAIN);
      mq.addEventListener("change", onChange);
      // resize as well: some embedders (and DevTools' responsive mode, which is
      // exactly where a viewport crosses the breakpoint mid-session) resize
      // without firing a matchMedia change.
      window.addEventListener("resize", onChange);
      return () => {
        mq.removeEventListener("change", onChange);
        window.removeEventListener("resize", onChange);
      };
    },
    () => window.matchMedia(PLAIN).matches,
    // the server cannot know the viewport; assume the plain stack, so the
    // first paint is the safe one and the effect upgrades it
    () => true,
  );
}

export function ScrollStackItem({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) {
  return (
    <div
      className={`scroll-stack-card origin-top [backface-visibility:hidden] [will-change:transform,opacity] ${itemClassName}`.trim()}
    >
      {children}
    </div>
  );
}

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  /** px of scroll each card owns before the next takes over. This, not the
   *  card's own height, sets how long the section is: six cards at 400 is a
   *  2400px section regardless of how tall a card renders. */
  scrollPerCard?: number;
  /** where in the viewport the stage pins, as a % of viewport height */
  stackPosition?: string;
  /** how far a leaving card recedes before it is gone */
  exitScale?: number;
  /** fraction of a card's span spent handing off to the next one */
  exitFraction?: number;
  /** fraction of a card's span spent arriving */
  enterFraction?: number;
};

/**
 * One project on screen at a time, on a sticky stage.
 *
 * Two earlier shapes of this both failed, and for the same underlying reason:
 * the cards shared layout space.
 *
 * The first was react-bits' deck, where every card stayed on screen as a
 * shrinking pile behind the current one. The second tried to shorten the
 * section by giving each card a NEGATIVE bottom margin so the next one's top
 * landed `scrollPerCard` below it. That did cut the scroll length, but it also
 * meant a card physically overlapped its neighbour in normal flow, so before
 * the pin engaged the next exhibit sat across the bottom of the one above it
 * and visibly cut it in half.
 *
 * Here the cards do not participate in flow at all. One sticky stage holds
 * them absolutely positioned in the same box; the scroller above it is exactly
 * `n * scrollPerCard` tall and is the only thing consuming scroll. So a card is
 * either fully shown or not shown, never clipped by its neighbour, and the
 * section's length is completely decoupled from how tall a card renders.
 *
 * Reduced motion and phones skip all of it: no stage, no absolute positioning,
 * cards in ordinary flow, which is the right answer on a screen barely taller
 * than one card.
 */
export function ScrollStack({
  children,
  className = "",
  scrollPerCard = 420,
  stackPosition = "14%",
  exitScale = 0.95,
  exitFraction = 0.32,
  enterFraction = 0.14,
}: ScrollStackProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const frame = useRef(0);
  const last = useRef(new Map<number, { scale: number; opacity: number }>());
  /** Document-space top of the scroller, measured from layout and cached. */
  const scrollerTop = useRef(0);
  const lastScroll = useRef(-1);
  const plain = usePlainStack();

  /** Walk the offsetParent chain: offsetTop is layout position and ignores
   *  transforms, unlike getBoundingClientRect, which reports the box we just
   *  moved. Reading the rect here fed each frame's transform back into the
   *  next frame's input and the cards visibly shook. */
  const documentTop = (el: HTMLElement | null) => {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  };

  const measure = useCallback(() => {
    scrollerTop.current = documentTop(scroller.current);
  }, []);

  const update = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const scrollTop = window.scrollY;
    // nothing moved: skip the whole pass rather than recompute six cards to
    // arrive at the transforms they already have
    if (scrollTop === lastScroll.current) return;
    lastScroll.current = scrollTop;

    const local = scrollTop - scrollerTop.current;
    const lastIndex = cards.length - 1;
    const holdEnd = 1 - exitFraction;

    cards.forEach((card, i) => {
      // 0 = this card's turn begins, 1 = the next card has fully taken over
      const p = (local - i * scrollPerCard) / scrollPerCard;

      let opacity: number;
      let scale: number;

      if (i === 0 && p < enterFraction) {
        // The first card never plays an entrance. `local` is negative while the
        // section is still scrolling up into view, so anything that ramps card
        // zero in from zero leaves the stage blank exactly when the reader
        // arrives at it, which is the emptiness this section was accused of.
        opacity = 1;
        scale = 1;
      } else if (p < 0) {
        // not reached yet. Cards are stacked in one box, so an unreached card
        // must be fully hidden or it would paint over the one being read.
        opacity = 0;
        scale = 1;
      } else if (p < enterFraction) {
        const e = p / enterFraction;
        opacity = e;
        scale = 1 - (1 - e) * 0.02;
      } else if (i === lastIndex || p <= holdEnd) {
        // the last card has nothing to hand off to, so it simply rests
        opacity = 1;
        scale = 1;
      } else if (p < 1) {
        const e = (p - holdEnd) / exitFraction;
        opacity = 1 - e;
        scale = 1 - e * (1 - exitScale);
      } else {
        opacity = 0;
        scale = exitScale;
      }

      const next = {
        scale: Math.round(scale * 1000) / 1000,
        opacity: Math.round(opacity * 1000) / 1000,
      };
      const prev = last.current.get(i);
      const changed =
        !prev ||
        Math.abs(prev.scale - next.scale) > 0.001 ||
        Math.abs(prev.opacity - next.opacity) > 0.005;

      if (changed) {
        card.style.transform = `scale(${next.scale})`;
        card.style.opacity = `${next.opacity}`;
        // a hidden card must not swallow clicks meant for the one on top of it
        card.style.pointerEvents = next.opacity < 0.05 ? "none" : "";
        last.current.set(i, next);
      }
    });
  }, [enterFraction, exitFraction, exitScale, scrollPerCard]);

  useEffect(() => {
    const root = scroller.current;
    const stageEl = stage.current;
    if (!root || !stageEl) return;
    // Driving six poster-sized cards per frame against a touch scroller that is
    // already the most expensive thing on the device reads as stutter rather
    // than depth on a screen barely taller than one card. `plain` is reactive,
    // so crossing the breakpoint re-runs this effect and the cleanup strips
    // whatever the other branch left behind.
    if (plain) return;

    const cards = Array.from(stageEl.querySelectorAll<HTMLElement>(".scroll-stack-card"));
    cardsRef.current = cards;

    /** The stage is as tall as the tallest card and the scroller is exactly
     *  `n * scrollPerCard` tall. Nothing here reads a card's height to decide
     *  how much scroll it gets, which is the whole point: card height and
     *  section length are independent now. */
    const applyLayout = () => {
      cards.forEach((card) => {
        card.style.position = "absolute";
        card.style.left = "0";
        card.style.right = "0";
        card.style.top = "0";
      });
      const tallest = cards.reduce((m, c) => Math.max(m, c.offsetHeight), 0);
      stageEl.style.height = `${tallest}px`;
      root.style.height = `${cards.length * scrollPerCard + tallest}px`;
      measure();
      // force the next pass to repaint even if the scroll position is unchanged
      lastScroll.current = -1;
      update();
    };
    applyLayout();

    // Anything that changes a card's height invalidates the stage: a resize, or
    // a poster finishing loading and giving a card its real size.
    const ro = new ResizeObserver(applyLayout);
    cards.forEach((c) => ro.observe(c));
    window.addEventListener("resize", applyLayout);

    // rAF loop rather than a scroll listener: the global Lenis animates scroll
    // between native scroll events, so listening alone leaves the cards
    // stepping a frame behind the page.
    const loop = () => {
      update();
      frame.current = requestAnimationFrame(loop);
    };

    // ...but only while the stack is actually on screen. It used to run for the
    // life of the page: six cards recomputed and rewritten every frame while
    // the reader was in the hero or the footer, competing with whatever
    // animation they were actually looking at.
    let running = false;
    const play = () => {
      if (running) return;
      running = true;
      frame.current = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(frame.current);
    };

    const io = new IntersectionObserver(
      (entries) => (entries.some((e) => e.isIntersecting) ? play() : pause()),
      // generous margin: start before the first card is due
      { rootMargin: "50% 0px 50% 0px" },
    );
    io.observe(root);

    // a backgrounded tab keeps firing rAF in some browsers; stop outright
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    const cache = last.current;
    return () => {
      pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      window.removeEventListener("resize", applyLayout);
      cache.clear();
      // so a re-enabled stack does not think it is already up to date
      lastScroll.current = -1;
      root.style.height = "";
      stageEl.style.height = "";
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
        card.style.pointerEvents = "";
        card.style.position = "";
        card.style.left = "";
        card.style.right = "";
        card.style.top = "";
      });
    };
  }, [measure, plain, scrollPerCard, update]);

  return (
    // overflow-anchor:none, the browser's scroll anchoring watches for content
    // shifting above the viewport and silently corrects scrollTop to compensate.
    // The stage's contents change every frame, so it kept nudging the scroll
    // position and the whole section shivered.
    <div ref={scroller} className={`relative [overflow-anchor:none] ${className}`.trim()}>
      <div
        ref={stage}
        className={plain ? "flex flex-col gap-8" : "sticky"}
        style={plain ? undefined : { top: stackPosition }}
      >
        {children}
      </div>
    </div>
  );
}
