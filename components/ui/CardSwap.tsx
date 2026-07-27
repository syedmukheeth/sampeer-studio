"use client";

import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type RefObject,
} from "react";
import { gsap } from "gsap";

/** Card chrome and the deck's 3D setup live here, not in globals.css: this is
 *  the component's own layout, and a component whose geometry depends on a
 *  separate stylesheet silently collapses if that sheet is stale or dropped. */
const CARD_CLASS =
  "card-swap-card absolute left-1/2 top-1/2 overflow-hidden rounded-md border border-line bg-elevated shadow-[0_8px_20px_rgba(31,41,36,0.07)] [transform-style:preserve-3d] [backface-visibility:hidden] [will-change:transform]";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { customClass?: string }>(
  function Card({ customClass, className, ...rest }, ref) {
    return <div ref={ref} {...rest} className={`${CARD_CLASS} ${customClass ?? ""} ${className ?? ""}`.trim()} />;
  },
);

type Slot = { x: number; y: number; z: number; zIndex: number };

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLDivElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

type CardSwapProps = {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  /** ms between swaps */
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  easing?: "elastic" | "linear";
  className?: string;
  children: React.ReactNode;
};

/** react-bits CardSwap, ported to TS. The deck drops its front card, promotes
 *  the rest, and sends the dropped one to the back. Reduced motion lays the
 *  deck out and leaves it — a card falling every few seconds is exactly the
 *  kind of thing that setting exists to stop. */
export function CardSwap({
  width = "100%",
  height = "100%",
  cardDistance = 40,
  verticalDistance = 44,
  delay = 4200,
  pauseOnHover = true,
  skewAmount = 5,
  easing = "elastic",
  className = "",
  children,
}: CardSwapProps) {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => createRef<HTMLDivElement>()),
    // one ref per card; identity only needs to change when the count does
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  );

  const order = useRef<number[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = container.current;
    const els = refs.map((r) => r.current).filter((el): el is HTMLDivElement => el !== null);
    if (!node || els.length === 0) return;

    const config =
      easing === "elastic"
        ? { ease: "elastic.out(0.6,0.9)", durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
        : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

    const total = els.length;
    order.current = els.map((_, i) => i);
    els.forEach((el, i) => placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = els[front];
      const tl = gsap.timeline();
      tlRef.current = tl;

      // the drop is proportional to the card, not a fixed 500px: this deck is
      // sized to its frame, so a hard pixel distance either barely clears a
      // large card or throws a small one off the page
      tl.to(elFront, { y: `+=${node.offsetHeight * 1.2}`, duration: config.durDrop, ease: config.ease });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = els[idx];
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return");
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, "return");
      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    // The deck only runs while it is on screen. Three of these live in a
    // sticky stack; off-screen ones would otherwise burn a timeline each.
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    };
    const stop = () => {
      running = false;
      window.clearInterval(intervalRef.current);
    };

    const io = new IntersectionObserver(
      (entries) => (entries.some((e) => e.isIntersecting) ? start() : stop()),
      { threshold: 0.2 },
    );
    io.observe(node);

    const pause = () => {
      tlRef.current?.pause();
      window.clearInterval(intervalRef.current);
    };
    const resume = () => {
      tlRef.current?.play();
      intervalRef.current = window.setInterval(swap, delay);
    };
    if (pauseOnHover) {
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
    }

    return () => {
      io.disconnect();
      stop();
      tlRef.current?.kill();
      if (pauseOnHover) {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
      }
    };
  }, [cardDistance, delay, easing, pauseOnHover, refs, skewAmount, verticalDistance]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<{ style?: React.CSSProperties; ref?: RefObject<HTMLDivElement | null> }>, {
          key: i,
          ref: refs[i],
          style: { width, height, ...((child.props as { style?: React.CSSProperties }).style ?? {}) },
        })
      : child,
  );

  return (
    <div
      ref={container}
      className={`card-swap-container absolute inset-0 overflow-visible [perspective:900px] ${className}`.trim()}
    >
      {rendered}
    </div>
  );
}

export default CardSwap;
