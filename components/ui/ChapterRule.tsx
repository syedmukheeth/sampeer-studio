import { clsx } from "clsx";
import type { Chapter } from "@/lib/content";

/* The site's one recurring transition, rationed to the biggest chapters: the
   chapter's name in the mono, then an ink hairline drawing out to the edge as
   the reader scrolls it in. The draw is `.rule-scrub` (a CSS scroll timeline),
   so it is driven by the scrollbar, reverses on the way back, and browsers
   without scroll timelines simply show the finished rule. A small orange
   square is the one accent mark in the rule. */
export function ChapterRule({ chapter, className }: { chapter: Chapter; className?: string }) {
  return (
    <div className={clsx("chapter-rule", className)}>
      <span className="inline-flex shrink-0 items-center gap-2.5 font-mono text-xs font-medium tracking-[0.06em] text-ink uppercase">
        <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
        {chapter.label}
      </span>
      <span aria-hidden className="chapter-rule__line rule-scrub" />
    </div>
  );
}
