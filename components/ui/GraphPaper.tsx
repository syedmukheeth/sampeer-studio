import { clsx } from "clsx";

/** Graph paper: two repeating gradients, one per axis, in `line`.
 *  Sections that paint an opaque background (the Build stack pins panels over
 *  each other, so they have to) hide the page-wide ShapeGrid canvas underneath.
 *  This puts the same ruling back on top of that background. Cell size matches
 *  the global grid so the two read as one system. */
export function GraphPaper({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx(
        "pointer-events-none absolute inset-0",
        "[background-image:repeating-linear-gradient(to_right,var(--color-line)_0_1px,transparent_1px_76px),repeating-linear-gradient(to_bottom,var(--color-line)_0_1px,transparent_1px_76px)]",
        className,
      )}
    />
  );
}

export default GraphPaper;
