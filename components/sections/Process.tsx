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
  const step = PROCESS[active];

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

          {/* the selected stage. Height is not reserved: three short bodies of
              similar length, and pinning it to the tallest would leave a hole
              under the other two. */}
          <div className="md:col-span-7 md:pt-4">
            {/* keyed remount rather than AnimatePresence: `mode="wait"` holds
                the new paragraph until the old one's exit finishes, so a
                stalled exit leaves the panel empty. The copy is the point —
                it swaps immediately and fades in on top of nothing. */}
            <motion.p
              key={step.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
              className="max-w-lg font-sans text-lg leading-relaxed text-muted md:text-xl"
            >
              {step.body}
            </motion.p>
          </div>
        </div>
      </div>
    </Section>
  );
}
