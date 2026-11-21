import { ArrowDown, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HOME_AUTOMATION_STORY, OFFER, REELS } from "@/lib/content";
import type { OfferPackage } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Shell } from "@/components/ui/Shell";
import { Marked } from "@/components/ui/Marked";
import { FadeIn } from "@/components/ui/FadeIn";
import { PackageChip } from "@/components/ui/PackageChip";
import { WorkDeck } from "@/components/ui/WorkDeck";
import { Flow } from "@/components/ui/Flow";
import { LinkedInCard } from "@/components/ui/LinkedInCard";
import { ReelEmbed } from "@/components/ui/ReelEmbed";

/* What being found takes, told from the customer's side. A customer meets a
   business three times before they pay: they search, they ask, they check who
   is behind it. Each moment is one stop on a single hairline running down the
   chapter, and each stop names the moment in the serif, then what we build
   for it, then its proof on a green night card. Each pillar keeps its own
   graphic: the story is the deck of live sites, the automation a Flow diagram
   (the home page's preview of the Automation Lab), the founder brand the
   LinkedIn card and a reel.

   No tabs: all three are on the page, in order, readable top to bottom. */

const LEAD = HOME_AUTOMATION_STORY.beats[0];
const LEAD_FLOW = serpentine(LEAD.steps, 2, { payload: LEAD.payload });
const { live } = HOME_AUTOMATION_STORY.cta;

function Proof({ id }: { id: OfferPackage["id"] }) {
  if (id === "websites") {
    return (
      <div className="mx-auto w-full max-w-lg">
        <WorkDeck />
      </div>
    );
  }
  if (id === "automation") {
    return (
      <div>
        <Flow {...LEAD_FLOW} mode="static" canvasOnMobile compact label={`${LEAD.name} workflow`} />
        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[40ch] font-sans text-sm leading-relaxed text-muted">
            <span className="font-medium text-ink">{LEAD.name}.</span> {LEAD.outcome}
          </p>
          <a
            href={live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-wipe inline-flex shrink-0 items-center gap-1.5 py-1 font-sans text-sm font-medium text-ink"
          >
            {live.label}
            <ArrowUpRight size={14} weight="bold" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
      <div className="min-w-0">
        <LinkedInCard />
      </div>
      <div className="mx-auto w-full max-w-[16rem] sm:max-w-none">
        <ReelEmbed reel={REELS[0]} />
      </div>
    </div>
  );
}

function ProofLink({ pkg }: { pkg: OfferPackage }) {
  const external = pkg.proof.href.startsWith("http");
  const Icon = external ? ArrowUpRight : pkg.proof.href.startsWith("#") ? ArrowDown : ArrowRight;
  return (
    <a
      href={pkg.proof.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="link-wipe inline-flex items-center gap-2 py-1 font-sans text-sm font-medium text-ink"
    >
      {pkg.proof.label}
      <Icon size={14} weight="bold" aria-hidden />
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

/* One moment on the line: the dot sits on the hairline at the moment's first
   line, so the eye runs straight down from one moment to the next. */
function Stop({ pkg, last }: { pkg: OfferPackage; last: boolean }) {
  return (
    <li id={`service-${pkg.id}`} className="relative grid scroll-mt-28 gap-10 pl-8 md:pl-12 lg:grid-cols-12 lg:gap-14">
      {/* the line and its stop */}
      <span aria-hidden className={`absolute top-3 left-[5px] w-px bg-line ${last ? "h-0" : "-bottom-24 md:-bottom-32"}`} />
      <span aria-hidden className="absolute top-[0.55rem] left-0 h-[11px] w-[11px] rounded-full border-2 border-canvas bg-accent ring-1 ring-ink/25" />

      <FadeIn className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <h3 className="font-serif text-[clamp(1.75rem,3.2vw,2.6rem)] leading-[1.08] font-normal text-ink">{pkg.moment}</h3>
        <p className="mt-6 font-sans text-sm font-medium text-accent-text">{pkg.name}</p>
        <p className="mt-2 max-w-[36ch] font-sans text-lg leading-relaxed text-ink">{pkg.outcome}</p>

        <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
          {pkg.deliverables.map((d) => (
            <li key={d} className="flex gap-3 font-sans text-[15px] leading-relaxed text-muted">
              <span aria-hidden className="mt-[0.65em] h-1 w-3 shrink-0 rounded-full bg-accent" />
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-sans text-sm leading-relaxed text-faint">
          {OFFER.labels.need}: {pkg.need.join(" · ")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <PackageChip id={pkg.id} label={OFFER.labels.start} prefill={pkg.prefill} />
          <ProofLink pkg={pkg} />
        </div>
      </FadeIn>

      <div className="min-w-0 lg:col-span-7">
        <div className="night grain flex h-full min-h-[22rem] items-center rounded-3xl bg-canvas p-5 sm:p-8 md:p-10">
          <div className="relative z-[2] w-full">
            <Proof id={pkg.id} />
          </div>
        </div>
      </div>
    </li>
  );
}

export function Offer() {
  return (
    <section id="services" className="relative bg-canvas py-24 md:py-36">
      <Shell>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 className="font-serif text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-normal text-ink lg:col-span-6">
            <Marked text={OFFER.title} />
          </h2>
          <p className="max-w-[48ch] font-sans text-lg leading-relaxed text-muted lg:col-span-6 lg:justify-self-end">
            {OFFER.sub}
          </p>
        </div>

        <ol className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-32">
          {OFFER.packages.map((pkg, i) => (
            <Stop key={pkg.id} pkg={pkg} last={i === OFFER.packages.length - 1} />
          ))}
        </ol>
      </Shell>
    </section>
  );
}
