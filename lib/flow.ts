/**
 * The workflow graph model — pure data, no React.
 *
 * This lives outside components/ui/Flow.tsx on purpose. Flow.tsx is a
 * "use client" module, and Next turns every export of a client module into a
 * client-reference proxy on the server. Calling serpentine() from a server
 * component (or from a content module a server component imports) would blow
 * up. Keeping the model here means both sides can use it — which is also why
 * icons are string KEYS here, resolved to components inside the client layer
 * (components/ui/flow-icons.tsx).
 */

export type FlowIconKey =
  | "lead"
  | "ai"
  | "crm"
  | "email"
  | "calendar"
  | "user"
  | "users"
  | "globe"
  | "chart"
  | "phone"
  | "phone-x"
  | "note"
  | "file"
  | "table"
  | "clock"
  | "user-minus"
  | "card"
  | "receipt"
  | "cart"
  | "star"
  | "check"
  | "bell"
  | "chat"
  | "magnet"
  | "search"
  | "mappin"
  | "buildings"
  | "rocket"
  | "repeat"
  | "megaphone"
  | "tag"
  | "book"
  | "download"
  | "trophy"
  | "lightbulb"
  | "pulse"
  | "calculator"
  | "gear"
  | "fork"
  | "stethoscope"
  | "pill";

/** Gates the micro-moments: typing dots (ai), counter meta (metric), toast (outcome). */
export type FlowNodeKind = "trigger" | "ai" | "app" | "action" | "metric" | "outcome";

export type FlowNode = {
  id: string;
  label: string;
  /** grid column, 0-indexed */
  col: number;
  /** grid row, 0-indexed */
  row: number;
  /** presence of an icon is what flips a canvas into the rich card rendering */
  icon?: FlowIconKey;
  /** idle sub-line: "just now", "2,418 rows" */
  meta?: string;
  /** sub-line while the node is firing: "thinking…", "sending…" */
  activeMeta?: string;
  /** sub-line after the node has fired: "score 87", "sent ✓" */
  doneMeta?: string;
  kind?: FlowNodeKind;
};

export type FlowEdge = {
  from: string;
  to: string;
  /** text carried by the traveling chip while this edge fires: "lead" */
  payload?: string;
};

export type FlowGraph = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

/** What serpentine() accepts per step. A bare string is the classic simple node. */
export type FlowStep =
  | string
  | {
      label: string;
      icon?: FlowIconKey;
      meta?: string;
      activeMeta?: string;
      doneMeta?: string;
      kind?: FlowNodeKind;
    };

/**
 * Builds a boustrophedon graph — left-to-right, drop a row, right-to-left —
 * from a plain list of steps. Every workflow on the page is a straight
 * chain, so authoring col/row by hand would be a few hundred lines of
 * coordinates that can drift into an invalid shape without anyone noticing.
 * Give it steps and a column count; it returns a graph correct by
 * construction.
 */
export function serpentine(
  steps: readonly FlowStep[],
  cols: number,
  opts?: { payload?: string },
): FlowGraph {
  const nodes = steps.map((step, i) => {
    const s = typeof step === "string" ? { label: step } : step;
    const row = Math.floor(i / cols);
    const inRow = i % cols;
    return {
      ...s,
      id: `${i}-${s.label}`,
      // odd rows run backwards, so the chain never jumps the full width
      col: row % 2 === 0 ? inRow : cols - 1 - inRow,
      row,
    };
  });

  const edges = nodes.slice(0, -1).map((n, i) => ({
    from: n.id,
    to: nodes[i + 1].id,
    payload: opts?.payload,
  }));

  return { nodes, edges };
}
