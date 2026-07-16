/**
 * The workflow graph model — pure data, no React.
 *
 * This lives outside components/ui/Flow.tsx on purpose. Flow.tsx is a
 * "use client" module, and Next turns every export of a client module into a
 * client-reference proxy on the server. Calling serpentine() from a server
 * component (or from a content module a server component imports) would blow
 * up. Keeping the model here means both sides can use it.
 */

export type FlowNode = {
  id: string;
  label: string;
  /** grid column, 0-indexed */
  col: number;
  /** grid row, 0-indexed */
  row: number;
};

export type FlowEdge = {
  from: string;
  to: string;
};

export type FlowGraph = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

/**
 * Builds a boustrophedon graph — left-to-right, drop a row, right-to-left —
 * from a plain list of step labels. Every workflow on the page is a straight
 * chain, so authoring col/row by hand would be a few hundred lines of
 * coordinates that can drift into an invalid shape without anyone noticing.
 * Give it labels and a column count; it returns a graph correct by
 * construction.
 */
export function serpentine(labels: readonly string[], cols: number): FlowGraph {
  const nodes = labels.map((label, i) => {
    const row = Math.floor(i / cols);
    const inRow = i % cols;
    return {
      id: `${i}-${label}`,
      label,
      // odd rows run backwards, so the chain never jumps the full width
      col: row % 2 === 0 ? inRow : cols - 1 - inRow,
      row,
    };
  });

  const edges = nodes.slice(0, -1).map((n, i) => ({
    from: n.id,
    to: nodes[i + 1].id,
  }));

  return { nodes, edges };
}
