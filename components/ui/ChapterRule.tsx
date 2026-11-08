import { clsx } from "clsx";

/* The site's one recurring transition. Every chapter opens on it: the
   chapter's name in the mono, then the logo's ribbon drawing out to the edge
   as the reader scrolls it in. The draw is `.rule-scrub` (a CSS scroll
   timeline), so it is driven by the scrollbar, reverses on the way back, and
   browsers without scroll timelines simply show the finished rule. */
export function ChapterRule({ label, className }: { label: string; className?: string }) {
  return (
    <div className={clsx("chapter-rule", className)}>
      <span className="shrink-0 font-mono text-xs font-medium tracking-[0.04em] text-accent-text">{label}</span>
      <span aria-hidden className="chapter-rule__line rule-scrub" />
    </div>
  );
}
