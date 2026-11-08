import type { CSSProperties } from "react";
import { PROBLEM } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";

/* The problem, said in the reader's own situation, then the turn. The
   statement lights up word by word as it crosses the screen, scrubbed by the
   scrollbar (`.scrub-word` in globals.css): the reader literally brings it
   into the light. Each word's window is a slice of the paragraph's journey,
   overlapping the next, so it reads as a sweep rather than a ticker. */
export function Problem() {
  const words = PROBLEM.statement.split(" ");
  const span = 34; // % of the paragraph's cover range the whole sweep takes
  const each = 12; // % one word takes to come up

  return (
    <section id="problem" aria-label="The problem" className="relative py-28 md:py-44">
      <Shell>
        <h2 className="scrub-text max-w-[18ch] font-display text-[clamp(2.4rem,7vw,6.25rem)] leading-[1] font-[650] tracking-[-0.04em] text-ink font-stretch-semi-expanded">
          {words.map((w, i) => {
            const from = 18 + (i / words.length) * span;
            return (
              <span
                key={`${w}-${i}`}
                className="scrub-word"
                style={{ "--from": `${from}%`, "--to": `${from + each}%` } as CSSProperties}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </h2>
        <p className="mt-10 max-w-xl font-sans text-lg leading-relaxed text-muted md:mt-14 md:text-xl">{PROBLEM.turn}</p>
      </Shell>
    </section>
  );
}
