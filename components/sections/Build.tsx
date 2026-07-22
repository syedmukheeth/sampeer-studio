import { PILLARS } from "@/lib/content";
import { PillarPanel } from "@/components/sections/PillarPanel";

/** §03 What We Build. Three pillars as outcomes.
 *  A sticky stack where each pillar pins and the next slides up to cover it —
 *  but the covered pillar recedes (scale + canvas veil) instead of hard-cutting,
 *  so the handoff reads as depth, matching the Work section's motion. The
 *  per-panel scroll motion lives in PillarPanel (client); this stays a thin
 *  server shell over the data. Each panel's visual is a bespoke PillarGraphic
 *  drawn in the site's own vocabulary — the work is the imagery, not stock. */
export function Build() {
  return (
    <section id="build">
      {PILLARS.map((p, i) => (
        <PillarPanel key={p.id} pillar={p} last={i === PILLARS.length - 1} />
      ))}
    </section>
  );
}
