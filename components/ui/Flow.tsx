"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { clsx } from "clsx";
import { EASE, DUR } from "@/lib/constants";
import type { FlowNode, FlowEdge } from "@/lib/flow";

/**
 * FLOW — the one workflow diagram on this site.
 *
 * Every canvas on /automations is this component with different data. The
 * brand forbids glows, neon, and particles, so "aliveness" is carried by
 * MOTION instead of luminance: edges draw themselves, a single data dot
 * travels the firing edge, and exactly ONE node is lit at a time. That last
 * rule is what keeps the page inside the "one accent strike per viewport"
 * mandate while still reading as a live machine.
 *
 * Layout: authored on a grid (col/row). The viewBox is sized from that grid
 * and the container is given a matching aspect-ratio, so SVG user units and
 * the percentage-positioned HTML nodes land on exactly the same pixels — no
 * ResizeObserver, no measurement pass, no drift.
 *
 * Mobile: the diagram does not shrink, it changes form. The <ol> that exists
 * for screen readers IS the small-screen UI (a vertical stepper); it goes
 * sr-only at md+ where the canvas takes over. One source of truth, and no
 * hydration flash from a JS breakpoint check.
 */

export type FlowTone = "default" | "chaos";

export type FlowMode =
  /** edges drawn, nothing moves */
  | "static"
  /** cycles forever while on screen */
  | "loop"
  /** advances only while `play` is true, resets when it goes false */
  | "sequence";

/* ---------------------------------------------------------------- geometry */

const CELL_W = 200;
const CELL_H = 112;
const NODE_W = 152;
const NODE_H = 54;

function layout(nodes: FlowNode[]) {
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const at = new Map(
    nodes.map((n) => [
      n.id,
      { x: n.col * CELL_W + CELL_W / 2, y: n.row * CELL_H + CELL_H / 2 },
    ]),
  );
  return { cols, rows, w: cols * CELL_W, h: rows * CELL_H, at };
}

/**
 * Orthogonal elbows, never beziers — the page's radius ceiling is 8px and a
 * swoopy curve reads as a different brand. Leaves a gap before the target so
 * the arrowhead has somewhere to sit.
 */
const HEAD = 7;

function edgePath(
  a: { x: number; y: number },
  b: { x: number; y: number },
): string {
  // stacked vertically in the same column: leave from the bottom, arrive at top
  if (Math.abs(a.x - b.x) < 1) {
    const y1 = a.y + NODE_H / 2;
    const y2 = b.y - NODE_H / 2 - HEAD;
    return `M ${a.x} ${y1} L ${b.x} ${y2}`;
  }

  const dir = b.x > a.x ? 1 : -1;
  const x1 = a.x + (dir * NODE_W) / 2;
  const x2 = b.x - (dir * NODE_W) / 2 - dir * HEAD;

  // same row: a straight shot
  if (Math.abs(a.y - b.y) < 1) return `M ${x1} ${a.y} L ${x2} ${b.y}`;

  // different row: out, across, in
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${x2} ${b.y}`;
}

/* ------------------------------------------------------------------- flow */

export function Flow({
  nodes,
  edges,
  mode = "loop",
  tone = "default",
  play = false,
  /** ms each node holds the strike before handing off */
  step = 900,
  /** decorative background canvas: leaves the accessibility tree and drops
   *  the stepper. Opacity is the caller's call — pass it via className. */
  ambient = false,
  label,
  className,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  mode?: FlowMode;
  tone?: FlowTone;
  play?: boolean;
  step?: number;
  ambient?: boolean;
  /** names the diagram for screen readers */
  label: string;
  className?: string;
}) {
  const uid = useId();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const { w, h, at } = useMemo(() => layout(nodes), [nodes]);

  // The order the machine fires in. Edge order is the author's intent, so the
  // first node of the first edge starts the chain.
  const order = useMemo(() => nodes.map((n) => n.id), [nodes]);

  const [i, setI] = useState(0);

  /**
   * Offscreen canvases must not animate. With ten of these in the Catalog
   * grid, an ungated interval per card is the difference between a smooth
   * page and a hot laptop.
   */
  const running =
    !reduce && (mode === "loop" ? inView : mode === "sequence" ? play : false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setI((p) => (p + 1) % order.length), step);
    return () => clearInterval(t);
  }, [running, order.length, step]);

  // a sequence that stops rewinds to the top, ready to replay on next hover.
  // Adjusted during render rather than in an effect: an effect would paint the
  // stale step first and cascade a second render to undo it.
  const [wasPlaying, setWasPlaying] = useState(play);
  if (mode === "sequence" && wasPlaying !== play) {
    setWasPlaying(play);
    if (!play) setI(0);
  }

  const chaos = tone === "chaos";
  // reduced motion / static / chaos resolve to "no strike, just the shape"
  const lit = running && !chaos ? order[i] : null;
  const firing = lit ? edges.find((e) => e.from === lit) : undefined;

  return (
    <div ref={ref} className={clsx("w-full", className)}>
      {/* ---------------------------------------------- canvas (md and up) */}
      <div
        aria-hidden
        className="relative hidden w-full md:block"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <marker
              id={`${uid}-head`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="currentColor" />
            </marker>
          </defs>

          {edges.map((e) => {
            const a = at.get(e.from);
            const b = at.get(e.to);
            if (!a || !b) return null;
            const d = edgePath(a, b);
            const isFiring = firing?.from === e.from && firing?.to === e.to;

            return (
              <g key={`${e.from}-${e.to}`} className="text-line">
                {/* Chaos and order draw differently and cannot share a path:
                    motion implements pathLength by driving stroke-dasharray
                    itself, so a dashed chaos edge silently renders solid if
                    you animate its length. Chaos keeps its dashes and only
                    fades — the missing self-draw is the point.

                    Neither branches on `reduce`, and neither passes
                    `initial={false}`: the server can't know the preference, so
                    reduce-dependent markup desyncs hydration, and a missing
                    `initial` leaves motion animating opacity from a value it
                    can't read off an SVG node (a warning per edge). Instead
                    the shape is fixed and reduced motion collapses the
                    DURATION to zero — same resolved frame, no travel. */}
                {chaos ? (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeDasharray="4 5"
                    markerEnd={`url(#${uid}-head)`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
                  />
                ) : (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    markerEnd={`url(#${uid}-head)`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
                  />
                )}

                {isFiring && (
                  <circle key={`${uid}-${i}`} r={3} className="fill-accent">
                    <animateMotion
                      dur={`${step / 1000}s`}
                      path={d}
                      fill="freeze"
                      repeatCount="1"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((n) => {
          const p = at.get(n.id)!;
          const on = lit === n.id;
          return (
            <motion.div
              key={n.id}
              className={clsx(
                "absolute flex items-center justify-center rounded-md border px-2 text-center font-sans leading-tight transition-colors duration-300",
                "text-[11px] lg:text-xs",
                on
                  ? "border-accent bg-elevated text-ink"
                  : chaos
                    ? "border-line/60 bg-canvas text-faint"
                    : "border-line bg-elevated text-muted",
              )}
              style={{
                left: `${(p.x / w) * 100}%`,
                top: `${(p.y / h) * 100}%`,
                width: `${(NODE_W / w) * 100}%`,
                height: `${(NODE_H / h) * 100}%`,
                x: "-50%",
                y: "-50%",
              }}
              // `on` is false on the server and on the first client render
              // either way (nothing is in view yet), so this stays hydration-safe
              animate={on && !reduce ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.pop }}
            >
              {n.label}
            </motion.div>
          );
        })}
      </div>

      {/* ------------------------------------- stepper (mobile) / a11y (all)
          Real text, real order. A screen reader gets the workflow as prose;
          it never meets the SVG. */}
      <ol
        // an ambient backdrop is decoration, not content — it stays out of the
        // accessibility tree entirely rather than being read aloud
        aria-hidden={ambient || undefined}
        className={clsx(ambient ? "hidden" : "flex flex-col md:sr-only")}
        aria-label={ambient ? undefined : label}
      >
        {nodes.map((n, idx) => (
          <li key={n.id} className="flex items-stretch gap-3">
            <div className="flex w-4 shrink-0 flex-col items-center">
              <span
                className={clsx(
                  "mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  chaos ? "bg-faint" : "bg-accent",
                )}
              />
              {idx < nodes.length - 1 && (
                <span
                  className={clsx(
                    "w-px flex-1",
                    chaos ? "bg-line/60" : "bg-line",
                  )}
                />
              )}
            </div>
            <span
              className={clsx(
                "pb-4 pt-1.5 font-sans text-sm",
                chaos ? "text-faint" : "text-muted",
              )}
            >
              {n.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
