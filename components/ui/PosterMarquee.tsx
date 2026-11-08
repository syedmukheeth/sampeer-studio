import Image from "next/image";
import { WORK, type LiveProject } from "@/lib/content";

const KIND_LABEL = { client: "Client", product: "Product", concept: "Concept" } as const;

/* Two copies of the row side by side, each sliding -100% of its own width, so
   the loop has no seam. The second copy is presentational only. */
function Row({ items, reverse = false }: { items: LiveProject[]; reverse?: boolean }) {
  return (
    <div className="marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className={`marquee-track flex shrink-0 gap-4 pr-4 ${reverse ? "marquee-track--reverse" : ""}`}
        >
          {items.map((w) => (
            <li key={w.id}>
              <a
                href={`#work-${w.id}`}
                tabIndex={copy === 1 ? -1 : undefined}
                className="group relative block w-60 overflow-hidden rounded-lg border border-line bg-elevated shadow-[0_8px_28px_rgba(30,26,42,0.08)] transition-colors duration-300 hover:border-accent/40 md:w-85"
              >
                <span className="relative block aspect-16/10">
                  <Image
                    src={w.poster}
                    alt={copy === 0 ? `${w.client} website` : ""}
                    fill
                    sizes="(min-width: 768px) 340px, 240px"
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-ink/70 to-transparent px-3 pb-2.5 pt-8 font-sans text-xs text-canvas">
                  <span className="rounded-sm bg-canvas/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur-sm">
                    {KIND_LABEL[w.kind]}
                  </span>
                  <span className="truncate font-medium">{w.client}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function PosterMarquee() {
  return (
    <div className="space-y-4">
      <Row items={WORK} />
      <Row items={[...WORK].reverse()} reverse />
    </div>
  );
}
