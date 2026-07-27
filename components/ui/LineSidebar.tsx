"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

type Falloff = "linear" | "smooth" | "sharp";

const FALLOFF: Record<Falloff, (p: number) => number> = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

type LineSidebarProps = {
  items: string[];
  showIndex?: boolean;
  showMarker?: boolean;
  /** px from the pointer at which an item stops reacting */
  proximityRadius?: number;
  /** px the nearest item slides right */
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  /** rem */
  fontSize?: number;
  /** ms time constant of the easing */
  smoothing?: number;
  active?: number;
  onItemActivate?: (index: number, label: string) => void;
  className?: string;
};

/** react-bits LineSidebar, ported to TS. Colours come from the site's tokens
 *  rather than props, so it inherits the palette like everything else.
 *
 *  Each item's `--effect` (0..1) is eased toward its target in one rAF loop and
 *  every derived property reads that same value, so colour, shift and scale
 *  stay in step, CSS transitions on each would stagger against each other.
 *
 *  Items are real buttons here, not clickable <li>s: this is a control, and the
 *  original markup gives a keyboard no way to reach it. */
export function LineSidebar({
  items,
  showIndex = true,
  showMarker = true,
  proximityRadius = 110,
  maxShift = 22,
  falloff = "smooth",
  markerLength = 56,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 22,
  fontSize = 1.6,
  smoothing = 110,
  active,
  onItemActivate,
  className = "",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targets = useRef<number[]>([]);
  const current = useRef<number[]>([]);
  const raf = useRef<number | null>(null);
  const lastTime = useRef(0);
  const activeRef = useRef(active ?? 0);
  const reduce = useReducedMotion() ?? false;
  const selected = active ?? 0;

  // refs are written in an effect, never during render
  useEffect(() => {
    activeRef.current = selected;
  }, [selected]);

  // The loop is a local named function so it can schedule itself; a separate
  // useCallback cannot reference itself before it is declared.
  const start = useCallback(() => {
    if (raf.current != null) return;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime.current) / 1000, 0.05);
      lastTime.current = now;
      const tau = Math.max(smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      let moving = false;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = Math.max(targets.current[i] || 0, activeRef.current === i ? 1 : 0);
        const cur = current.current[i] || 0;
        const next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        current.current[i] = value;
        el.style.setProperty("--effect", value.toFixed(4));
        if (!settled) moving = true;
      });

      raf.current = moving ? requestAnimationFrame(tick) : null;
    };

    lastTime.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  }, [smoothing]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list || reduce) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF[falloff];
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const center = el.offsetTop + el.offsetHeight / 2;
        targets.current[i] = ease(Math.max(0, 1 - Math.abs(pointerY - center) / proximityRadius));
      });
      start();
    },
    [falloff, proximityRadius, reduce, start],
  );

  const onPointerLeave = useCallback(() => {
    targets.current = targets.current.map(() => 0);
    start();
  }, [start]);

  useEffect(() => {
    start();
  }, [active, start]);

  useEffect(
    () => () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const style = {
    "--marker-length": `${markerLength}px`,
    "--marker-gap": `${markerGap}px`,
    "--tick-scale": tickScale,
    "--max-shift": `${reduce ? 0 : maxShift}px`,
    "--item-gap": `${itemGap}px`,
    "--font-size": `${fontSize}rem`,
  } as CSSProperties;

  return (
    <nav
      className={`line-sidebar${showMarker ? " line-sidebar--markers" : ""}${
        scaleTick ? " line-sidebar--scale-tick" : ""
      }${className ? ` ${className}` : ""}`}
      style={style}
    >
      <ul ref={listRef} className="line-sidebar__list" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
          >
            {showMarker && <span className="line-sidebar__marker" aria-hidden />}
            <button
              type="button"
              aria-current={selected === index ? "true" : undefined}
              onClick={() => onItemActivate?.(index, label)}
              onFocus={() => onItemActivate?.(index, label)}
              className="line-sidebar__label"
            >
              {showIndex && <span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span>}
              <span className="line-sidebar__text">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default LineSidebar;
