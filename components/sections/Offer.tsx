import type { CSSProperties } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CHAPTERS, HOME_AUTOMATION_STORY, OFFER, PROBLEM, REELS } from "@/lib/content";
import type { OfferPackage } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Shell } from "@/components/ui/Shell";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { PackageChip } from "@/components/ui/PackageChip";
import { WorkDeck } from "@/components/ui/WorkDeck";
import { Flow } from "@/components/ui/Flow";
import { LinkedInCard } from "@/components/ui/LinkedInCard";
import { ReelEmbed } from "@/components/ui/ReelEmbed";
import { STAGGER } from "@/lib/constants";

/* 01 / What we do. The reader's problem said plainly (lit word by word as it
   crosses the screen), then the three things the studio sells, each laid out
   as a diptych: what you get, how long, what we need from you on one side,
   and the proof on a night card on the other, alternating down the page.
   Each pillar keeps its own graphic: the story is the card deck of live
   sites, the automation is a Flow diagram, the founder brand is the LinkedIn
   card and a reel. The Peer in the name closes the chapter. */

const LEAD = HOME_AUTOMATION_STORY.beats[0];
const LEAD_FLOW = serpentine(LEAD.steps, 2, { payload: LEAD.payload });

function Proof({ id }: { id: OfferPackage["id"] }) {
  if (id === "websites") {
    return (
      <div className="mx-auto w-full max-w-lg">
        <WorkDeck />
      </div>
    );
  }
  if (id === "automation") {
    return <Flow {...LEAD_FLOW} mode="static" canvasOnMobile compact label={`${LEAD.name} workflow`} />;
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

function ProblemStatement() {
  const words = PROBLEM.statement.split(" ");
  const span = 34; // % of the heading's cover range the whole sweep takes
  const each = 12; // % one word takes to come up
  return (
    <div className="mt-14 md:mt-20">
      <h2 className="scrub-text max-w-[17ch] font-display text-[clamp(2.4rem,6.4vw,5.75rem)] leading-[1] font-[600] tracking-[-0.05em] text-ink">
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
      <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-muted md:text-xl">{PROBLEM.turn}</p>
    </div>
  );
}

function Package({ pkg, index }: { pkg: OfferPackage; index: number }) {
  const flip = index % 2 === 1;
  const external = pkg.proof.href.startsWith("http");

  return (
    <article id={`service-${pkg.id}`} className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-16">
      <FadeIn className={clsx("min-w-0 lg:col-span-5", flip && "lg:order-last")}>
        <p className="font-mono text-xs tracking-[0.06em] text-faint uppercase">
          <span className="text-accent-text">{pkg.letter}</span> / {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-[600] tracking-[-0.045em] text-ink">
          {pkg.name}
        </h3>
        <p className="mt-4 max-w-[34ch] font-sans text-lg leading-relaxed text-muted">{pkg.outcome}</p>

        <h4 className="mt-9 font-mono text-xs tracking-[0.06em] text-faint uppercase">{OFFER.labels.get}</h4>
        <ul className="mt-4 space-y-3">
          {pkg.deliverables.map((d) => (
            <li key={d} className="flex gap-3 font-sans text-[15px] leading-relaxed text-ink">
              <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-accent" />
              {d}
            </li>
          ))}
        </ul>

        <dl className="mt-9 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs tracking-[0.06em] text-faint uppercase">{OFFER.labels.timeline}</dt>
            <dd className="mt-2 font-sans text-sm leading-relaxed text-muted">{pkg.timeline}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-[0.06em] text-faint uppercase">{OFFER.labels.need}</dt>
            <dd className="mt-2">
              <ul className="space-y-1 font-sans text-sm leading-relaxed text-muted">
                {pkg.need.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <PackageChip id={pkg.id} label={OFFER.labels.start} prefill={pkg.prefill} />
          <a
            href={pkg.proof.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="link-wipe inline-flex items-center gap-2 py-1 font-sans text-sm font-medium text-ink"
          >
            {pkg.proof.label}
            {external ? (
              <ArrowUpRight size={14} weight="bold" aria-hidden />
            ) : (
              <ArrowDown size={14} weight="bold" aria-hidden />
            )}
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER.loose} className="min-w-0 lg:col-span-7">
        <div className="night grain flex h-full min-h-[22rem] items-center rounded-3xl bg-canvas p-5 sm:p-8 md:p-10">
          <div className="relative z-[2] w-full">
            <Proof id={pkg.id} />
          </div>
        </div>
      </FadeIn>
    </article>
  );
}

export function Offer() {
  const { peer } = OFFER;
  return (
    <section id="services" className="relative bg-canvas py-24 md:py-36">
      <Shell>
        <ChapterRule chapter={CHAPTERS.services} />
        <ProblemStatement />

        <div className="mt-20 flex flex-col gap-20 md:mt-28 md:gap-28">
          {OFFER.packages.map((pkg, i) => (
            <Package key={pkg.id} pkg={pkg} index={i} />
          ))}

          <article className="grid items-center gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-16">
            <FadeIn className="min-w-0 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.06em] text-faint uppercase">
                <span className="text-accent-text">+</span> / {peer.word}
              </p>
              <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] font-[600] tracking-[-0.045em] text-ink">
                {peer.title}
              </h3>
              <p className="mt-4 max-w-[40ch] font-sans text-lg leading-relaxed text-muted">{peer.body}</p>
            </FadeIn>
            <FadeIn delay={STAGGER.loose} className="min-w-0 lg:col-span-7">
              <figure className="relative aspect-16/10 overflow-hidden rounded-3xl bg-elevated-2">
                <Image
                  src={peer.photo}
                  alt={peer.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="mono object-cover"
                />
              </figure>
            </FadeIn>
          </article>
        </div>
      </Shell>
    </section>
  );
}
