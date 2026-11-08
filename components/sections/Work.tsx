"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { WORK, WORK_GROUPS, WORK_HEADER, type LiveProject, type ProjectKind } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { track, EVENTS } from "@/lib/analytics";
import { EASE } from "@/lib/constants";

const visit = (w: LiveProject) => () => track(EVENTS.workVisitSite, { client: w.client });

/* The frame rises in while the screenshot inside settles from a slight
   push-in: one deliberate move per poster, played once. */
function Poster({
  project: w,
  sizes,
  hint,
  framed = true,
}: {
  project: LiveProject;
  sizes: string;
  hint: string;
  framed?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE.out }}
      className={`group/poster relative overflow-hidden bg-elevated ${
        framed
          ? "rounded-lg border border-line shadow-[0_10px_36px_rgba(30,26,42,0.07)] transition-colors duration-500 hover:border-accent/40"
          : ""
      }`}
    >
      <motion.div
        initial={reduce ? false : { scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: reduce ? 0 : 1.1, ease: EASE.out }}
        className="relative aspect-16/10"
      >
        <Image
          src={w.poster}
          alt={`${w.client} website`}
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/poster:scale-[1.03]"
        />
      </motion.div>
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex translate-y-1 items-center gap-1 rounded-md bg-canvas/90 px-3 py-1.5 font-sans text-xs font-medium text-ink opacity-0 shadow-sm backdrop-blur-sm transition duration-300 group-hover/poster:translate-y-0 group-hover/poster:opacity-100">
        {hint}
      </span>
    </motion.div>
  );
}

function Tag({ kind, children }: { kind: ProjectKind; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-sm px-1.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider ${
        kind === "concept" ? "border border-line text-muted" : "bg-accent-soft text-accent-text"
      }`}
    >
      {children}
    </span>
  );
}

function ClientProject({ project: w, index }: { project: LiveProject; index: number }) {
  return (
    <article id={`work-${w.id}`}>
      <a href={w.url} target="_blank" rel="noopener noreferrer" onClick={visit(w)} className="block">
        <span className="sr-only">{`Visit ${w.client}'s live site`}</span>
        <Poster project={w} sizes="(min-width: 1400px) 1320px, 100vw" hint="Visit site ↗" />
      </a>

      <div className="mt-6 grid gap-4 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p className="font-sans text-xs text-faint">
            <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden> · </span>
            {w.category}
          </p>
          <h4 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">{w.client}</h4>
        </div>
        <div className="md:col-span-7">
          <p className="font-sans text-base leading-relaxed text-muted">{w.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={visit(w)}
              className="inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-accent-text underline-offset-4 hover:underline"
            >
              Visit site <ArrowUpRight size={14} weight="bold" aria-hidden />
            </a>
            {w.caseStudy && (
              <Link
                href={w.caseStudy}
                className="inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Read the case study <ArrowRight size={14} weight="bold" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductProject({ project: w }: { project: LiveProject }) {
  return (
    <article
      id={`work-${w.id}`}
      className="grid overflow-hidden rounded-lg border border-line bg-elevated md:grid-cols-12"
    >
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={visit(w)}
        className="block md:col-span-7"
        tabIndex={-1}
        aria-hidden
      >
        <Poster project={w} sizes="(min-width: 768px) 60vw, 100vw" hint="Open the app ↗" framed={false} />
      </a>
      <div className="flex flex-col justify-center p-6 md:col-span-5 md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag kind={w.kind}>Product</Tag>
          <span className="font-sans text-xs text-faint">{w.category}</span>
        </div>
        <h4 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">{w.client}</h4>
        <p className="mt-4 font-sans text-base leading-relaxed text-muted">{w.description}</p>
        <a
          href={w.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={visit(w)}
          className="btn-press mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-ink px-5 py-2.5 font-sans text-sm font-medium text-canvas transition-colors hover:bg-accent-solid"
        >
          Try {w.client} <ArrowUpRight size={15} weight="bold" aria-hidden />
        </a>
      </div>
    </article>
  );
}

function ConceptProject({ project: w }: { project: LiveProject }) {
  const href = w.caseStudy ?? w.url;

  return (
    <article id={`work-${w.id}`}>
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <Poster project={w} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" hint="Case study →" />
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Tag kind={w.kind}>Concept</Tag>
        <span className="font-sans text-xs text-faint">{w.category}</span>
      </div>
      <h4 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
        <Link href={href} className="hover:text-accent-text">
          {w.client}
        </Link>
      </h4>
      <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{w.description}</p>
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={visit(w)}
        className="mt-2 inline-flex items-center gap-1 py-1 font-sans text-xs font-medium text-accent-text underline-offset-4 hover:underline"
      >
        Live site <ArrowUpRight size={12} weight="bold" aria-hidden />
      </a>
    </article>
  );
}

export function Work() {
  return (
    <Section id="work">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader eyebrow={WORK_HEADER.eyebrow} title={WORK_HEADER.title} />
        <span className="font-display text-5xl font-semibold tabular-nums text-line md:text-7xl" aria-hidden>
          {String(WORK.length).padStart(2, "0")}
        </span>
      </div>

      {WORK_GROUPS.map((g) => {
        const items = WORK.filter((w) => w.kind === g.kind);
        return (
          <div key={g.kind} className="mt-16 md:mt-24">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line pt-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                {g.title}
                <span className="ml-2 font-sans text-sm font-normal tabular-nums text-faint">{items.length}</span>
              </h3>
              <p className="max-w-md font-sans text-sm text-muted">{g.note}</p>
            </div>

            {g.kind === "client" && (
              <div className="mt-10 space-y-20 md:space-y-28">
                {items.map((w, i) => (
                  <ClientProject key={w.id} project={w} index={i} />
                ))}
              </div>
            )}

            {g.kind === "product" && (
              <div className="mt-10 space-y-8">
                {items.map((w) => (
                  <ProductProject key={w.id} project={w} />
                ))}
              </div>
            )}

            {g.kind === "concept" && (
              <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((w) => (
                  <ConceptProject key={w.id} project={w} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </Section>
  );
}
