"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { clsx } from "clsx";
import { Check, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { EASE, DUR } from "@/lib/constants";
import type { FlowNode, FlowEdge } from "@/lib/flow";
import { FLOW_ICONS } from "@/components/ui/flow-icons";

/**
 * FLOW — the one workflow diagram on this site.
 *
 * Every canvas on /automations is this component with different data. The
 * brand forbids glows, neon, and particles, so "aliveness" is carried by
 * MOTION instead of luminance: edges draw themselves, a single data payload
 * travels the firing edge, and exactly ONE node is lit at a time. That last
 * rule is what keeps the page inside the "one accent strike per viewport"
 * mandate while still reading as a live machine.
 *
 * Two node renderings share the engine. A node that carries `icon`/`meta`
 * data renders as a RICH app card — icon chip, live meta line, status
 * indicator — sized on a larger grid. A bare `{id, label}` node renders the
 * original simple box on the original grid. The switch is per-canvas
 * (any icon flips the whole graph rich) so mixed sizing never happens.
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
  | "sequence"
  /** constructs itself under the scrollbar: node k and edge k exist only once
   *  `progress` has passed their window. Requires the `progress` prop. Once a
   *  piece is revealed it stays static — no pulse, no dot, no loop. */
  | "build";

/** idle → active (holding the strike) → done (already fired this run) */
type NodeStatus = "idle" | "active" | "done";

/* ---------------------------------------------------------------- geometry */

/**
 * Two size tables, one engine. Rich cards need room for the icon chip and
 * meta line; the ratios stay close to simple's (130/232 ≈ 112/200) so every
 * canvas keeps roughly the density it was art-directed at.
 */
const DIMS = {
  simple: { cellW: 200, cellH: 112, nodeW: 152, nodeH: 54 },
  rich: { cellW: 232, cellH: 130, nodeW: 184, nodeH: 68 },
} as const;

type Dims = (typeof DIMS)[keyof typeof DIMS];

function layout(nodes: FlowNode[], dims: Dims) {
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const at = new Map(
    nodes.map((n) => [
      n.id,
      {
        x: n.col * dims.cellW + dims.cellW / 2,
        y: n.row * dims.cellH + dims.cellH / 2,
      },
    ]),
  );
  return { cols, rows, w: cols * dims.cellW, h: rows * dims.cellH, at };
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
  dims: Dims,
): string {
  // stacked vertically in the same column: leave from the bottom, arrive at top
  if (Math.abs(a.x - b.x) < 1) {
    const y1 = a.y + dims.nodeH / 2;
    const y2 = b.y - dims.nodeH / 2 - HEAD;
    return `M ${a.x} ${y1} L ${b.x} ${y2}`;
  }

  const dir = b.x > a.x ? 1 : -1;
  const x1 = a.x + (dir * dims.nodeW) / 2;
  const x2 = b.x - (dir * dims.nodeW) / 2 - dir * HEAD;

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
  /** scroll progress 0..1 driving `build` mode (from useScroll / a pin) */
  progress,
  /** ms each node holds the strike before handing off */
  step = 900,
  /** decorative background canvas: leaves the accessibility tree and drops
   *  the stepper. Opacity is the caller's call — pass it via className. */
  ambient = false,
  /** shrink the rich card (smaller chip, no status dot) for narrow canvases
   *  like the Catalog cards, where the full anatomy would truncate labels */
  compact = false,
  label,
  className,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  mode?: FlowMode;
  tone?: FlowTone;
  play?: boolean;
  progress?: MotionValue<number>;
  step?: number;
  ambient?: boolean;
  compact?: boolean;
  /** names the diagram for screen readers */
  label: string;
  className?: string;
}) {
  const uid = useId();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });

  const rich = useMemo(() => nodes.some((n) => !!n.icon), [nodes]);
  const dims = DIMS[rich ? "rich" : "simple"];
  const { w, h, at } = useMemo(() => layout(nodes, dims), [nodes, dims]);

  // The order the machine fires in. Edge order is the author's intent, so the
  // first node of the first edge starts the chain.
  const order = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const indexOf = useMemo(
    () => new Map(order.map((id, idx) => [id, idx])),
    [order],
  );

  const [i, setI] = useState(0);

  /**
   * Offscreen canvases must not animate. With ten of these in the Catalog
   * grid, an ungated interval per card is the difference between a smooth
   * page and a hot laptop.
   */
  const build = mode === "build" && !!progress;

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

  // the outcome toast fires when a rich loop reaches its terminal node —
  // `running` is false on the server, first client render, and under reduced
  // motion, so this never desyncs hydration and never shows when static.
  const last = nodes[nodes.length - 1];
  const toast =
    rich &&
    !ambient &&
    !chaos &&
    mode === "loop" &&
    running &&
    i === nodes.length - 1 &&
    last?.kind === "outcome";

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

          {edges.map((e, ei) => {
            const a = at.get(e.from);
            const b = at.get(e.to);
            if (!a || !b) return null;
            const d = edgePath(a, b, dims);
            const isFiring = firing?.from === e.from && firing?.to === e.to;

            if (build && progress) {
              return (
                <BuildEdge
                  key={`${e.from}-${e.to}`}
                  d={d}
                  uid={uid}
                  chaos={chaos}
                  index={ei}
                  count={nodes.length}
                  progress={progress}
                  reduce={!!reduce}
                />
              );
            }

            // rich edges remember what they carried: once the strike moves
            // past an edge's source it settles brighter than virgin line —
            // a hairline "data has flowed here" trace, not a glow.
            const srcIdx = indexOf.get(e.from) ?? ei;
            const carried = rich && !chaos && lit !== null && srcIdx < i;

            return (
              <g
                key={`${e.from}-${e.to}`}
                className={clsx(
                  "transition-colors duration-300",
                  rich && isFiring
                    ? "text-accent/60"
                    : carried
                      ? "text-ink/20"
                      : "text-line",
                )}
              >
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

                {/* the traveling payload: rich edges carry a labeled chip
                    (the actual data changing hands), simple edges keep the
                    original bare dot. SMIL animates the parent <g>/<circle>,
                    and the key remount restarts the run each step. */}
                {isFiring &&
                  (e.payload ? (
                    <g key={`${uid}-${i}`} className="font-sans">
                      <animateMotion
                        dur={`${step / 1000}s`}
                        path={d}
                        fill="freeze"
                        repeatCount="1"
                      />
                      <rect
                        x={-17}
                        y={-8}
                        width={34}
                        height={16}
                        rx={4}
                        strokeWidth={1}
                        className="fill-elevated-2 stroke-accent/70"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={8}
                        className="fill-ink"
                      >
                        {e.payload}
                      </text>
                    </g>
                  ) : (
                    <circle key={`${uid}-${i}`} r={3} className="fill-accent">
                      <animateMotion
                        dur={`${step / 1000}s`}
                        path={d}
                        fill="freeze"
                        repeatCount="1"
                      />
                    </circle>
                  ))}
              </g>
            );
          })}
        </svg>

        {nodes.map((n, ni) => {
          const p = at.get(n.id)!;
          const style = {
            left: `${(p.x / w) * 100}%`,
            top: `${(p.y / h) * 100}%`,
            width: `${(dims.nodeW / w) * 100}%`,
            height: `${(dims.nodeH / h) * 100}%`,
          };

          if (build && progress) {
            return (
              <BuildNode
                key={n.id}
                node={n}
                chaos={chaos}
                index={ni}
                count={nodes.length}
                final={ni === nodes.length - 1}
                progress={progress}
                reduce={!!reduce}
                style={style}
              />
            );
          }

          // `lit` is null on the server and on the first client render either
          // way (nothing is in view yet), so status starts "idle" everywhere
          // and the rich card's state visuals stay hydration-safe.
          const status: NodeStatus =
            lit === null ? "idle" : ni === i ? "active" : ni < i ? "done" : "idle";

          if (n.icon) {
            return (
              <RichNode
                key={n.id}
                node={n}
                status={status}
                chaos={chaos}
                reduce={!!reduce}
                compact={compact}
                style={style}
              />
            );
          }

          const on = status === "active";
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
              style={{ ...style, x: "-50%", y: "-50%" }}
              animate={on && !reduce ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.pop }}
            >
              {n.label}
            </motion.div>
          );
        })}

        {/* the payoff toast: the machine's terminal outcome surfacing as a
            product notification. Mounts fresh each cycle (conditional render),
            so it re-enters every loop without any counter state. */}
        {toast && (
          <motion.div
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-line bg-elevated-2 px-2.5 py-1.5 font-sans text-[10px] text-ink"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
          >
            <Check size={10} weight="bold" className="text-accent" />
            {last.label}
            {last.doneMeta ? (
              <span className="text-muted">· {last.doneMeta}</span>
            ) : null}
          </motion.div>
        )}
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
        {nodes.map((n, idx) => {
          const StepIcon = n.icon ? FLOW_ICONS[n.icon] : null;
          return (
            <li key={`${n.id}-step`} className="flex items-stretch gap-3">
              <div
                className={clsx(
                  "flex shrink-0 flex-col items-center",
                  StepIcon ? "w-6" : "w-4",
                )}
              >
                {StepIcon ? (
                  <span
                    className={clsx(
                      "mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-sm border",
                      chaos
                        ? "border-line/60 text-faint"
                        : "border-line bg-elevated text-muted",
                    )}
                  >
                    <StepIcon size={12} aria-hidden />
                  </span>
                ) : (
                  <span
                    className={clsx(
                      "mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      chaos ? "bg-faint" : "bg-accent",
                    )}
                  />
                )}
                {idx < nodes.length - 1 && (
                  <span
                    className={clsx(
                      "w-px flex-1",
                      chaos ? "bg-line/60" : "bg-line",
                    )}
                  />
                )}
              </div>
              <div className="pb-4 pt-1.5 font-sans">
                <span
                  className={clsx(
                    "block text-sm",
                    chaos ? "text-faint" : "text-muted",
                  )}
                >
                  {n.label}
                </span>
                {n.meta && (
                  <span className="block text-xs text-faint">{n.meta}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------- rich node */

/**
 * The "living app node": icon chip, title, live meta line, status indicator.
 * Everything a state can change is either a color class behind
 * `transition-colors` or one of three stacked meta spans crossfading on
 * opacity — no AnimatePresence, no re-mounts, nothing for hydration to trip
 * on. The active treatment is a hairline and a pop, never a glow.
 */
function RichNode({
  node,
  status,
  chaos,
  reduce,
  compact,
  style,
}: {
  node: FlowNode;
  status: NodeStatus;
  chaos: boolean;
  reduce: boolean;
  compact: boolean;
  style: React.CSSProperties;
}) {
  const Icon = FLOW_ICONS[node.icon!];
  const active = status === "active";
  const done = status === "done";
  const hasMeta = !compact && (node.meta || node.activeMeta || node.doneMeta);
  const iconPx = compact ? 12 : 13;

  return (
    <motion.div
      className={clsx(
        "absolute overflow-hidden rounded-md border text-left font-sans transition-colors duration-300",
        active
          ? "border-accent bg-elevated-2"
          : chaos
            ? "border-line/60 bg-canvas"
            : "border-line bg-elevated",
      )}
      style={{ ...style, x: "-50%", y: "-50%" }}
      animate={active && !reduce ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.pop }}
    >
      {/* top hairline — the card's "edge light", 1px, inside brand rules */}
      <span
        aria-hidden
        className={clsx(
          "absolute inset-x-0 top-0 h-px transition-colors duration-300",
          active ? "bg-accent/60" : chaos ? "bg-transparent" : "bg-ink/5",
        )}
      />

      <div
        className={clsx(
          "flex h-full items-center",
          compact ? "gap-1.5 px-2" : "gap-2 px-2.5",
        )}
      >
        {/* icon chip: rests as the app glyph, spins (or thinks) while firing,
            fills once done */}
        <span
          className={clsx(
            "grid shrink-0 place-items-center rounded-sm border transition-colors duration-300",
            compact ? "h-6 w-6" : "h-7 w-7",
            active
              ? "border-accent/40 bg-canvas/60 text-accent"
              : chaos
                ? "border-line/60 text-faint"
                : "border-line bg-canvas/60 text-muted",
          )}
        >
          {active && !reduce ? (
            node.kind === "ai" ? (
              <TypingDots />
            ) : (
              <CircleNotch size={iconPx} className="animate-spin" />
            )
          ) : (
            <Icon size={iconPx} weight={done ? "fill" : "regular"} />
          )}
        </span>

        {/* title + live meta line */}
        <span className="min-w-0 flex-1">
          <span
            className={clsx(
              "block truncate font-medium leading-tight transition-colors duration-300",
              compact ? "text-[10px]" : "text-[11px]",
              chaos ? "text-faint" : active || done ? "text-ink" : "text-muted",
            )}
          >
            {node.label}
          </span>
          {hasMeta && (
            <span
              className={clsx(
                "relative block h-3.5 text-[9px] leading-[14px] tabular-nums",
                chaos ? "text-faint/80" : "text-faint",
              )}
            >
              <MetaLayer on={status === "idle"}>{node.meta}</MetaLayer>
              <MetaLayer on={active}>{node.activeMeta ?? node.meta}</MetaLayer>
              <MetaLayer on={done}>{node.doneMeta ?? node.meta}</MetaLayer>
            </span>
          )}
        </span>

        {/* status: sleeping dot → live accent dot → done tick. Dropped in
            compact — the icon swap already signals state and the column is
            width the label needs more. */}
        {!compact && (
          <span className="grid w-3 shrink-0 place-items-center">
            {done && !chaos ? (
              <Check size={10} weight="bold" className="text-accent/70" />
            ) : (
              <span
                className={clsx(
                  "block h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  active ? "bg-accent" : "bg-line",
                )}
              />
            )}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/** One layer of the meta crossfade stack. Pure CSS opacity, always mounted. */
function MetaLayer({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "absolute inset-0 truncate transition-opacity duration-300",
        on ? "opacity-100" : "opacity-0",
      )}
    >
      {children}
    </span>
  );
}

/** The AI node's "thinking" tell. Keyframes live in globals.css; the global
 *  reduced-motion killswitch collapses them like every other animation. */
function TypingDots() {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((d) => (
        <span
          key={d}
          className="h-[3px] w-[3px] rounded-full bg-current"
          style={{
            animation: "flow-typing 0.9s ease-in-out infinite",
            animationDelay: `${d * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------- build mode */
/*
 * Scroll-built pieces. The whole timeline is progress 0..1 divided into
 * N + 1 units (one per node, one spare so the final accent strike lands
 * after the last node exists). Node k owns [k*u, k*u + 0.8u]; the edge that
 * follows it draws in the seam between k and k+1. MotionValue -> style keeps
 * this hydration-safe: the server renders the same initial frame (progress 0)
 * for everyone, and reduced motion snaps values to 1 on the client without
 * branching markup.
 */

function useBuildValue(
  progress: MotionValue<number>,
  from: number,
  to: number,
  reduce: boolean,
) {
  return useTransform(progress, (v) => {
    if (reduce) return 1;
    if (v <= from) return 0;
    if (v >= to) return 1;
    return (v - from) / (to - from);
  });
}

function BuildEdge({
  d,
  uid,
  chaos,
  index,
  count,
  progress,
  reduce,
}: {
  d: string;
  uid: string;
  chaos: boolean;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const u = 1 / (count + 1);
  const t = useBuildValue(progress, (index + 0.6) * u, (index + 1.3) * u, reduce);
  // fade resolves faster than the draw so the line never pops in fully drawn
  const opacity = useTransform(t, [0, 0.25], [0, 1]);

  return (
    <g className="text-line">
      {chaos ? (
        /* dashed chaos edges cannot animate pathLength (motion drives
           stroke-dasharray itself) — they fade in instead */
        <motion.path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 5"
          markerEnd={`url(#${uid}-head)`}
          style={{ opacity: t }}
        />
      ) : (
        <motion.path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          markerEnd={`url(#${uid}-head)`}
          style={{ pathLength: t, opacity }}
        />
      )}
    </g>
  );
}

function BuildNode({
  node,
  chaos,
  index,
  count,
  final,
  progress,
  reduce,
  style,
}: {
  node: FlowNode;
  chaos: boolean;
  index: number;
  count: number;
  final: boolean;
  progress: MotionValue<number>;
  reduce: boolean;
  style: React.CSSProperties;
}) {
  const u = 1 / (count + 1);
  const t = useBuildValue(progress, index * u, (index + 0.8) * u, reduce);
  // centering offset and the 8px rise share the same transform channel
  const y = useTransform(t, (v) => `calc(-50% + ${(8 * (1 - v)).toFixed(2)}px)`);
  // the single accent strike: only the terminal node, only once the whole
  // machine stands — one strike per viewport, preserved in build mode
  const strike = useBuildValue(progress, count * u, (count + 0.6) * u, reduce);

  /* Rich-card build states, all MotionValue-driven so scrubbing backwards
   * un-does them and reduced motion snaps to the finished frame.
   * - `ring`: the active hairline, up while this node is "the one being
   *   wired", gone once its outgoing edge lands. Reduce → finished frame → 0.
   * - `done`: flips after the outgoing edge draws; crossfades meta and swaps
   *   the status dot for the tick. Reduce → 1 (machine stands complete). */
  const ring = useTransform(progress, (v) => {
    if (reduce) return 0;
    const a = index * u;
    const b = (index + 0.5) * u;
    const c = (index + 1.35) * u;
    if (v <= a || v >= c) return 0;
    if (v <= b) return (v - a) / (b - a);
    return 1 - (v - b) / (c - b);
  });
  const done = useBuildValue(
    progress,
    (index + 1.3) * u,
    (index + 1.45) * u,
    reduce,
  );
  const notDone = useTransform(done, (v) => 1 - v);

  if (node.icon) {
    const Icon = FLOW_ICONS[node.icon];
    return (
      <motion.div
        className={clsx(
          "absolute overflow-hidden rounded-md border text-left font-sans",
          chaos ? "border-line/60 bg-canvas" : "border-line bg-elevated",
        )}
        style={{ ...style, x: "-50%", y, opacity: t }}
      >
        {/* the wiring hairline travels the chain as the machine assembles */}
        {!chaos && (
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-accent/60"
            style={{ opacity: ring }}
          />
        )}

        <div className="flex h-full items-center gap-2 px-2.5">
          <span
            className={clsx(
              "grid h-7 w-7 shrink-0 place-items-center rounded-sm border",
              chaos
                ? "border-line/60 text-faint"
                : "border-line bg-canvas/60 text-muted",
            )}
          >
            <Icon size={13} />
          </span>

          <span className="min-w-0 flex-1">
            <span
              className={clsx(
                "block truncate text-[11px] font-medium leading-tight",
                chaos ? "text-faint" : "text-ink",
              )}
            >
              {node.label}
            </span>
            {(node.meta || node.doneMeta) && (
              <span
                className={clsx(
                  "relative block h-3.5 text-[9px] leading-[14px] tabular-nums",
                  chaos ? "text-faint/80" : "text-faint",
                )}
              >
                <motion.span
                  className="absolute inset-0 truncate"
                  style={{ opacity: notDone }}
                >
                  {node.meta}
                </motion.span>
                <motion.span
                  className="absolute inset-0 truncate"
                  style={{ opacity: done }}
                >
                  {node.doneMeta ?? node.meta}
                </motion.span>
              </span>
            )}
          </span>

          {!chaos && (
            <span className="relative grid w-3 shrink-0 place-items-center">
              <motion.span
                className="absolute block h-1.5 w-1.5 rounded-full bg-line"
                style={{ opacity: notDone }}
              />
              <motion.span className="absolute grid place-items-center" style={{ opacity: done }}>
                <Check size={10} weight="bold" className="text-accent/70" />
              </motion.span>
            </span>
          )}
        </div>

        {final && !chaos && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-md border border-accent"
            style={{ opacity: strike }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={clsx(
        "absolute flex items-center justify-center rounded-md border px-2 text-center font-sans leading-tight",
        "text-[11px] lg:text-xs",
        chaos
          ? "border-line/60 bg-canvas text-faint"
          : "border-line bg-elevated text-muted",
      )}
      style={{ ...style, x: "-50%", y, opacity: t }}
    >
      {node.label}
      {final && !chaos && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md border border-accent"
          style={{ opacity: strike }}
        />
      )}
    </motion.div>
  );
}
