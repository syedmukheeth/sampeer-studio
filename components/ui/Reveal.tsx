/** Layout wrapper, kept where scroll-reveals used to be.
 *
 *  Text and cards used to start hidden and slide in as they crossed the
 *  viewport. It looked polished in isolation, but on a walkthrough it read as
 *  a page that had not finished loading, so content now renders in its final
 *  position immediately. Richer motion stays in the bespoke interactive
 *  components (Flow, ScrollStack, PillarGraphic) where it is the point.
 *
 *  `delay` and `from` are still accepted so the call sites keep their
 *  authored ordering intent; they are inert. Nothing here animates, so this is
 *  a plain element rather than a `motion` one, and it does not need to be a
 *  client component. */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** inert, retained so call sites do not have to be rewritten */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p";
  /** inert, retained so call sites do not have to be rewritten */
  from?: "bottom" | "top" | "left" | "right";
}) {
  return <Tag className={className}>{children}</Tag>;
}
