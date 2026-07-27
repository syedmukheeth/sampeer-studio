"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LineSidebar } from "@/components/ui/LineSidebar";
import { EASE, DUR } from "@/lib/constants";

/** §06 How It Works. The three stages are a rail you run the cursor down
 *  (react-bits LineSidebar): the nearest step warms to the accent, shifts, and
 *  its rule extends, while the body copy beside it swaps to whatever is
 *  selected. The old version stacked all three bodies at once, so the section
 *  was a wall of paragraphs; here you read one stage at a time and the
 *  sequence stays visible as a single line down the page.
 *
 *  Reduced motion: no shift, no cross-fade — clicking simply swaps the copy. */
export function Process() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <Section id="process">
      <div className="mx-auto max-w-4xl">
        <SectionHeader title={PROCESS_HEADER.title} />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <LineSidebar
              items={PROCESS.map((s) => s.title)}
              active={active}
              onItemActivate={(i) => setActive(i)}
              itemGap={28}
              fontSize={1.9}
            />
          </div>

          {/* All three stay readable; the selected one is set larger and in
              ink, the others shrink back to muted. Swapping to a single body
              hid two thirds of the process behind a click nobody is told to
              make — this keeps the whole sequence on the page and still gives
              the rail something to do. */}
          <ol className="md:col-span-7 md:pt-2">
            {PROCESS.map((s, i) => {
              const on = i === active;
              return (
                <motion.li
                  key={s.id}
                  onMouseEnter={() => setActive(i)}
                  animate={
                    reduce
                      ? undefined
                      : { opacity: on ? 1 : 0.55, scale: on ? 1 : 0.97, x: on ? 0 : -4 }
                  }
                  transition={{ duration: DUR.fast, ease: EASE.out }}
                  className="origin-left border-l-2 py-3 pl-5 first:pt-0"
                  style={{
                    borderColor: on ? "var(--color-accent)" : "var(--color-line)",
                  }}
                >
                  <p
                    className={`font-sans leading-relaxed transition-[font-size,color] duration-300 ${
                      on ? "text-lg text-ink md:text-xl" : "text-sm text-muted md:text-base"
                    }`}
                  >
                    {s.body}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
