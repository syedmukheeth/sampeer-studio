"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { WORK, WORK_GROUPS, WORK_HEADER, type LiveProject, type ProjectKind } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { track, EVENTS } from "@/lib/analytics";
import { DUR, EASE, RISE, SPRING } from "@/lib/constants";

/* Portfolio grid. Every project is live; the filter is there because the
   three kinds are different claims (paid client work, my own product, concept
   builds for fictional brands) and a buyer should be able to look at just the
   one they care about. Concept builds carry their tag on every card, filtered
   or not. */

type Filter = "all" | ProjectKind;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...WORK_GROUPS.map((g) => ({ id: g.kind as Filter, label: g.title })),
];

const TAG: Record<ProjectKind, string> = { client: "Client", product: "Product", concept: "Concept" };

const count = (kind: ProjectKind) => WORK.filter((w) => w.kind === kind).length;
const SUMMARY = `${count("client")} client sites, ${count("product")} product of my own, ${count(
  "concept",
)} concept builds for fictional brands. All of them live.`;

/* Column spans on the 12-column desktop grid. The rhythm is asymmetric on
   purpose (7+5, 5+7, 4+4+4, 6+6) and every row is full: no empty cells, no
   row of identical cards. Filtered views get their own full rows. */
const SPAN: Record<Filter, Record<string, string>> = {
  all: {
    suri: "lg:col-span-7",
    asrg: "lg:col-span-5",
    maa: "lg:col-span-5",
    "business-sos": "lg:col-span-7",
    aurum: "lg:col-span-4",
    liftx: "lg:col-span-4",
    vantara: "lg:col-span-4",
    novacare: "lg:col-span-6",
    uniquirk: "lg:col-span-6",
  },
  client: { suri: "lg:col-span-12", asrg: "lg:col-span-6", maa: "lg:col-span-6" },
  product: { "business-sos": "lg:col-span-12" },
  concept: {
    aurum: "lg:col-span-4",
    liftx: "lg:col-span-4",
    vantara: "lg:col-span-4",
    novacare: "lg:col-span-6",
    uniquirk: "lg:col-span-6",
  },
};

const visit = (w: LiveProject) => () => track(EVENTS.workVisitSite, { client: w.client });

function KindTag({ kind }: { kind: ProjectKind }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2 py-0.5 font-mono text-[11px] font-medium",
        kind === "concept" ? "border border-line text-muted" : "bg-accent-soft text-accent-text",
      )}
    >
      {TAG[kind]}
    </span>
  );
}

function ProjectCard({ project: w, span, wide }: { project: LiveProject; span: string; wide: boolean }) {
  const reduce = useReducedMotion();
  // the poster opens the live site, except for concept builds, whose case
  // study is the better first stop
  const posterHref = w.kind === "concept" && w.caseStudy ? w.caseStudy : w.url;
  const external = posterHref === w.url;

  return (
    <motion.article
      id={`work-${w.id}`}
      layout="position"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
      className={clsx("min-w-0", span)}
    >
      {/* same initial on server and client; reduced motion is data-reveal's
          job in globals.css (see FadeIn) */}
      <motion.div
        data-reveal
        initial={{ opacity: 0, y: RISE }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: reduce ? 0 : DUR.slow, ease: EASE.out }}
      >
        <a
          href={posterHref}
          {...(external ? { target: "_blank", rel: "noopener noreferrer", onClick: visit(w) } : {})}
          tabIndex={-1}
          aria-hidden
          className="group relative block aspect-16/10 overflow-hidden rounded-2xl border border-line bg-elevated transition-colors duration-500 hover:border-accent/60"
        >
          <Image
            src={w.poster}
            alt=""
            fill
            sizes={wide ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"}
            className="media-zoom object-cover object-top"
          />
        </a>

        <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <KindTag kind={w.kind} />
          <span className="font-mono text-xs text-faint">{w.category}</span>
        </div>
        <h3
          className={clsx(
            "mt-2 font-display font-[650] tracking-[-0.02em] text-ink font-stretch-semi-expanded",
            wide ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
          )}
        >
          {w.client}
        </h3>
        <p className="mt-2 max-w-[60ch] font-sans text-[15px] leading-relaxed text-muted">{w.description}</p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={visit(w)}
            className="link-wipe inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-accent-text"
          >
            {w.kind === "product" ? `Try ${w.client}` : "Visit site"}
            <ArrowUpRight size={14} weight="bold" aria-hidden />
          </a>
          {w.caseStudy && (
            <Link
              href={w.caseStudy}
              className="link-wipe inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-ink"
            >
              Case study <ArrowRight size={14} weight="bold" aria-hidden />
            </Link>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

export function Work() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");

  const items = filter === "all" ? WORK : WORK.filter((w) => w.kind === filter);
  const note = filter === "all" ? SUMMARY : WORK_GROUPS.find((g) => g.kind === filter)?.note;

  return (
    <Section id="work">
      <SectionHeader title={WORK_HEADER.title} />

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            const n = f.id === "all" ? WORK.length : count(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={clsx(
                  "btn-press relative inline-flex h-11 items-center gap-2 rounded-full border px-4 font-sans text-sm transition-colors",
                  on ? "border-accent/60 text-ink" : "border-line text-muted hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    aria-hidden
                    layoutId="work-filter"
                    transition={reduce ? { duration: 0 } : SPRING.pill}
                    className="absolute inset-0 rounded-full bg-accent-soft"
                  />
                )}
                <span className="relative">{f.label}</span>
                <span className="relative font-mono text-xs text-faint tabular-nums">{n}</span>
              </button>
            );
          })}
        </div>
        <p className="max-w-md font-sans text-sm text-muted md:text-right">{note}</p>
      </div>

      <motion.div
        layout="position"
        className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-16 lg:grid-cols-12"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((w, i) => {
            const span = SPAN[filter][w.id] ?? "lg:col-span-6";
            // an odd one out at the end of the two-column tablet grid takes the
            // whole row rather than leaving a hole beside it
            const lastOdd = items.length % 2 === 1 && i === items.length - 1;
            return (
              <ProjectCard
                key={w.id}
                project={w}
                span={clsx(span, lastOdd && "md:col-span-2")}
                wide={/col-span-(7|12)/.test(span)}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
