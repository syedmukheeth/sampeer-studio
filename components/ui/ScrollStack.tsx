"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

export function ScrollStackItem({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) {
  return (
    <div
      className={`scroll-stack-card relative origin-top [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,filter] ${itemClassName}`.trim()}
    >
      {children}
    </div>
  );
}

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  /** px gap between cards before they stack */
  itemDistance?: number;
  /** how much bigger each successive card ends up, as a scale delta */
  itemScale?: number;
  /** px each stacked card peeks below the one above it */
  itemStackDistance?: number;
  /** where in the viewport cards pin, as a % of viewport height */
  stackPosition?: string;
  /** where the scale-down finishes, as a % of viewport height */
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
};

/** react-bits ScrollStack, ported to TS and to this project's scrolling.
 *
 *  The upstream component owns its own scroller and spins up its own Lenis
 *  instance. Both are wrong here: the page already runs one global Lenis from
 *  LenisProvider, and a second one — plus a nested overflow container — would
 *  fight it for the wheel and trap the scroll inside the section. This version
 *  reads window scroll in a rAF loop instead, so it rides whatever is already
 *  driving the page. Reduced motion leaves the cards as a plain stack. */
export function ScrollStack({
  children,
  className = "",
  itemDistance = 88,
  itemScale = 0.03,
  itemStackDistance = 28,
  stackPosition = "22%",
  scaleEndPosition = "12%",
  baseScale = 0.86,
  rotationAmount = 0,
  blurAmount = 0,
}: ScrollStackProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const last = useRef(new Map<number, { y: number; scale: number; rotation: number; blur: number }>());
  /** Document-space tops, measured from layout and cached. */
  const tops = useRef<number[]>([]);
  const endTop = useRef(0);

  /** Walk the offsetParent chain: offsetTop is layout position and ignores
   *  transforms, unlike getBoundingClientRect, which reports the box we just
   *  moved. Reading the rect here fed each frame's transform back into the
   *  next frame's input and the cards visibly shook. */
  const measure = useCallback(() => {
    const documentTop = (el: HTMLElement | null) => {
      let y = 0;
      let node: HTMLElement | null = el;
      while (node) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return y;
    };
    tops.current = cardsRef.current.map((card) => documentTop(card));
    endTop.current = documentTop(endRef.current);
  }, []);

  const update = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length || !tops.current.length) return;

    const scrollTop = window.scrollY;
    const viewport = window.innerHeight;
    const pct = (value: string) => (parseFloat(value) / 100) * viewport;
    const stackPx = pct(stackPosition);
    const scaleEndPx = pct(scaleEndPosition);

    cards.forEach((card, i) => {
      const cardTop = tops.current[i];
      const pinStart = cardTop - stackPx - itemStackDistance * i;
      const pinEnd = endTop.current - viewport / 2;
      const scaleEnd = cardTop - scaleEndPx;

      const progress =
        scrollTop < pinStart ? 0 : scrollTop > scaleEnd ? 1 : (scrollTop - pinStart) / (scaleEnd - pinStart || 1);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - progress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * progress : 0;

      let blur = 0;
      if (blurAmount) {
        let top = 0;
        tops.current.forEach((otherTop, j) => {
          if (scrollTop >= otherTop - stackPx - itemStackDistance * j) top = j;
        });
        if (i < top) blur = (top - i) * blurAmount;
      }

      let y = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        y = scrollTop - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        y = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      const next = {
        y: Math.round(y * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };
      const prev = last.current.get(i);
      const changed =
        !prev ||
        Math.abs(prev.y - next.y) > 0.1 ||
        Math.abs(prev.scale - next.scale) > 0.001 ||
        Math.abs(prev.rotation - next.rotation) > 0.1 ||
        Math.abs(prev.blur - next.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${next.y}px, 0) scale(${next.scale}) rotate(${next.rotation}deg)`;
        card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : "";
        last.current.set(i, next);
      }
    });
  }, [baseScale, blurAmount, itemScale, itemStackDistance, rotationAmount, scaleEndPosition, stackPosition]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".scroll-stack-card"));
    cardsRef.current = cards;
    cards.forEach((card, i) => {
      card.style.marginBottom = i < cards.length - 1 ? `${itemDistance}px` : "";
    });
    measure();

    // Anything that changes the section's height invalidates the cached tops:
    // a resize, or a poster finishing loading and giving a card its real size.
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);

    // rAF loop rather than a scroll listener: the global Lenis animates scroll
    // between native scroll events, so listening alone leaves the cards
    // stepping a frame behind the page.
    const loop = () => {
      update();
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);

    const cache = last.current;
    return () => {
      cancelAnimationFrame(frame.current);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cache.clear();
      cards.forEach((card) => {
        card.style.transform = "";
        card.style.filter = "";
        card.style.marginBottom = "";
      });
    };
  }, [itemDistance, measure, update]);

  return (
    // overflow-anchor:none — the browser's scroll anchoring watches for content
    // shifting above the viewport and silently corrects scrollTop to compensate.
    // Pinned cards move every frame, so it kept nudging the scroll position and
    // the whole stack shivered.
    <div ref={scroller} className={`relative [overflow-anchor:none] ${className}`.trim()}>
      {children}
      {/* Release runway. The last card stays pinned until the end marker
          reaches mid-viewport, so without room after the cards that pin was
          still held while the next section scrolled up underneath it — which
          is what put the following copy on top of the cards. */}
      <div ref={endRef} className="scroll-stack-end h-[70vh] w-full" />
    </div>
  );
}

export default ScrollStack;
