"use client";

import { useRef, useState } from "react";
import { clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CHAPTERS, HOME_AUTOMATION_STORY, OFFER, REELS } from "@/lib/content";
import type { OfferPackage } from "@/lib/content";
import { serpentine } from "@/lib/flow";
import { Shell } from "@/components/ui/Shell";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { PackageChip } from "@/components/ui/PackageChip";
import { WorkDeck } from "@/components/ui/WorkDeck";
import { Flow } from "@/components/ui/Flow";
import { LinkedInCard } from "@/components/ui/LinkedInCard";
import { ReelEmbed } from "@/components/ui/ReelEmbed";
import { SPRING } from "@/lib/constants";

/* What we do, as three tabs. The reader's situation in one plain line, then
   the three things the studio sells, one at a time: what you get, how long,
   what we need from you, and the proof on a night card beside it. Each pillar
   keeps its own graphic: the story is the card deck of live sites, the
   automation is a Flow diagram (the home page's whole preview of the
   Automation Lab), the founder brand is the LinkedIn card and a reel.

   Every panel is in the markup from the first byte (only `hidden` switches),
   so the server and the client agree and search engines read all three. The
   tabs follow the WAI-ARIA pattern: arrows, Home and End move between them,
   and moving focus never scrolls the page. */

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

function Panel({ pkg, active }: { pkg: OfferPackage; active: boolean }) {
  return (
    <div
      role="tabpanel"
      id={`service-${pkg.id}`}
      aria-labelledby={`service-tab-${pkg.id}`}
      hidden={!active}
      tabIndex={0}
      className="mt-10 grid gap-10 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ink/40 md:mt-12 lg:grid-cols-12 lg:gap-12"
    >
      <div className="min-w-0 lg:col-span-5">
        <h3 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.02] font-[600] tracking-[-0.045em] text-ink">
          {pkg.name}
        </h3>
        <p className="mt-4 max-w-[34ch] font-sans text-lg leading-relaxed text-muted">{pkg.outcome}</p>

        <h4 className="mt-8 font-mono text-xs tracking-[0.06em] text-faint uppercase">{OFFER.labels.get}</h4>
        <ul className="mt-4 space-y-3">
          {pkg.deliverables.map((d) => (
            <li key={d} className="flex gap-3 font-sans text-[15px] leading-relaxed text-ink">
              <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-accent" />
              {d}
            </li>
          ))}
        </ul>

        <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
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

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <PackageChip id={pkg.id} label={OFFER.labels.start} prefill={pkg.prefill} />
          <ProofLink pkg={pkg} />
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <div className="night grain flex h-full min-h-[22rem] items-center rounded-3xl bg-canvas p-5 sm:p-8 md:p-10">
          <div className="relative z-[2] w-full">
            <Proof id={pkg.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Offer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = OFFER.packages.length;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next =
      e.key === "ArrowRight" ? (i + 1) % n
      : e.key === "ArrowLeft" ? (i - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <section id="services" className="relative bg-canvas py-20 md:py-28">
      <Shell>
        <ChapterRule chapter={CHAPTERS.services} />

        <div className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] font-[600] tracking-[-0.05em] text-ink lg:col-span-6">
            {OFFER.title}
          </h2>
          <p className="max-w-[46ch] font-sans text-lg leading-relaxed text-muted lg:col-span-6 lg:justify-self-end">
            {OFFER.sub}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={OFFER.labels.tabs}
          className="mt-12 grid w-full grid-cols-3 gap-1 rounded-full border border-line bg-elevated p-1 sm:inline-flex sm:w-auto md:mt-14"
        >
          {OFFER.packages.map((pkg, i) => {
            const on = i === active;
            return (
              <button
                key={pkg.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`service-tab-${pkg.id}`}
                aria-selected={on}
                aria-controls={`service-${pkg.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={clsx(
                  "relative h-11 rounded-full px-3 font-sans text-sm font-medium whitespace-nowrap transition-colors sm:px-5",
                  on ? "text-canvas" : "text-muted hover:text-ink",
                )}
              >
                {on ? (
                  <motion.span
                    aria-hidden
                    layoutId="service-tab"
                    transition={reduce ? { duration: 0 } : SPRING.pill}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                ) : null}
                <span className="relative">
                  <span className="sm:hidden">{pkg.tabShort}</span>
                  <span className="hidden sm:inline">{pkg.tab}</span>
                </span>
              </button>
            );
          })}
        </div>

        {OFFER.packages.map((pkg, i) => (
          <Panel key={pkg.id} pkg={pkg} active={i === active} />
        ))}
      </Shell>
    </section>
  );
}
