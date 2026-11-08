import { clsx } from "clsx";
import type { Chapter } from "@/lib/content";

/* The site's one recurring transition. Every chapter opens on it: the
   chapter's number and name in the mono, then an ink hairline drawing out to
   the edge as the reader scrolls it in. The draw is `.rule-scrub` (a CSS
   scroll timeline), so it is driven by the scrollbar, reverses on the way
   back, and browsers without scroll timelines simply show the finished rule.
   The number is the one orange mark in the rule. */
export function ChapterRule({ chapter, className }: { chapter: Chapter; className?: string }) {
  return (
    <div className={clsx("chapter-rule", className)}>
      <span className="shrink-0 font-mono text-xs font-medium tracking-[0.06em] uppercase">
        <span className="text-accent-text">{chapter.index}</span>
        <span className="text-faint"> / </span>
        <span className="text-ink">{chapter.label}</span>
      </span>
      <span aria-hidden className="chapter-rule__line rule-scrub" />
    </div>
  );
}
