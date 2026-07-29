import { PILLARS, PILLARS_HEADER } from "@/lib/content";
import { PillarPanel } from "@/components/sections/PillarPanel";
import { Section, SectionHeader } from "@/components/ui/Section";
import { GraphPaper } from "@/components/ui/GraphPaper";

/** §03 What We Build. Three pillars as outcomes.
 *  A sticky stack where each pillar pins and the next slides up to cover it -
 *  but the covered pillar recedes (scale + canvas veil) instead of hard-cutting,
 *  so the handoff reads as depth, matching the Work section's motion. The
 *  per-panel scroll motion lives in PillarPanel (client); this stays a thin
 *  server shell over the data. Each panel's visual is a bespoke PillarGraphic
 *  drawn in the site's own vocabulary, the work is the imagery, not stock.
 *
 *  The header is its own block above the stack rather than riding on the first
 *  panel: a pinned panel scrolls under the next one, so anything sitting in it
 *  gets covered, and the title for all three would leave with the first. */
export function Build() {
  return (
    <section id="build">
      {/* `flush` plus explicit padding, not the `base` rhythm: base pads BOTH
          edges, and the first pillar adds its own top padding underneath, so
          the header and the first outcome ended up ~360px apart with nothing
          between them. The top edge matches the site's rhythm (py-20/md:py-28);
          only the bottom is cut, because the pillar below supplies that side.
          Set here rather than on Section, which every other block depends on. */}
      <Section
        size="flush"
        className="overflow-hidden bg-canvas pt-20 pb-10 md:pt-28 md:pb-14"
      >
        <GraphPaper className="[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_70%,transparent)]" />
        <SectionHeader
          className="relative"
          accent
          eyebrow={PILLARS_HEADER.eyebrow}
          title={PILLARS_HEADER.title}
        />
        <p className="relative mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
          {PILLARS_HEADER.body}
        </p>
      </Section>

      {PILLARS.map((p, i) => (
        <PillarPanel key={p.id} pillar={p} last={i === PILLARS.length - 1} />
      ))}
    </section>
  );
}
