"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  CHAPTERS,
  CLIENT_WORDS,
  CLIENTS,
  WORK,
  WORK_GROUPS,
  WORK_HEADER,
  type ClientWord,
  type LiveProject,
  type ProjectKind,
} from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { ClientLoop } from "@/components/ui/ClientLoop";
import { track, EVENTS } from "@/lib/analytics";
import { DUR, EASE, REVEAL_INSET, RISE, SPRING } from "@/lib/constants";
import { FINE_POINTER, useMediaQuery } from "@/lib/media";

/* Selected work, in three registers. Client sites are photographs: the live
   site large, wiping open as it arrives, shown whole inside its own 16:10,
   with a caption band under it carrying the client's own words where they
   gave them. The studio's own product is one register down, a diptych. The
   concept builds are an index, a typographic list, with the poster following
   the cursor on desktop. The split is the honesty: paid work is never dressed
   the same as self-initiated work, and every concept row says so. */

const CLIENT_WORK = WORK.filter((w) => w.kind === "client");
const PRODUCTS = WORK.filter((w) => w.kind === "product");
const CONCEPTS = WORK.filter((w) => w.kind === "concept");
const CONCEPT_NOTE = WORK_GROUPS.find((g) => g.kind === "concept")?.note ?? "";

const TAG: Record<ProjectKind, string> = { client: "Client", product: "Studio product", concept: "Concept build" };

const count = (kind: ProjectKind) => WORK.filter((w) => w.kind === kind).length;
const SUMMARY = `${count("client")} client sites, ${count("product")} product of the studio's own, ${count(
  "concept",
)} concept builds for fictional brands. All of them live.`;

const visit = (w: LiveProject) => () => track(EVENTS.workVisitSite, { client: w.client, from: "work" });

function KindTag({ kind }: { kind: ProjectKind }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium whitespace-nowrap",
        kind === "concept" ? "border border-line text-muted" : "bg-accent-soft text-accent-text",
      )}
    >
      {TAG[kind]}
    </span>
  );
}

/** Reads the reduced-motion preference into a ref, for scroll transforms: the
 *  value bound to `style` must be the same on the server and the first client
 *  render, so the preference changes what the transform returns, not whether
 *  it is bound. */
function useStillRef() {
  const reduce = useReducedMotion();
  const still = useRef(false);
  useEffect(() => {
    still.current = Boolean(reduce);
  }, [reduce]);
  return { reduce, still };
}

/** What a client said about this project on camera, beside a few silent
 *  seconds of them. Condensed and translated, and labelled as such. */
function ClientWords({ words }: { words: ClientWord }) {
  return (
    <figure className="flex gap-5 md:gap-6">
      <div className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-elevated-2 md:w-32">
        <ClientLoop src={words.loop} poster={words.poster} sizes="128px" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-xs tracking-[0.06em] text-faint uppercase">{CLIENT_WORDS.label}</p>
        <blockquote className="mt-3">
          <p className="font-display text-xl leading-snug font-[500] tracking-[-0.025em] text-ink md:text-2xl">
            <span aria-hidden className="text-accent-text">&ldquo;</span>
            {words.statement}
            <span aria-hidden className="text-accent-text">&rdquo;</span>
          </p>
        </blockquote>
        <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-sans text-sm font-semibold text-ink">{words.name}</span>
          <span className="font-mono text-xs text-faint">{words.role}</span>
        </figcaption>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-faint">{CLIENT_WORDS.note}</p>
      </div>
    </figure>
  );
}

function ProjectLinks({ project: w }: { project: LiveProject }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={visit(w)}
        className="link-wipe inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-ink"
      >
        {w.kind === "product" ? `Try ${w.client}` : "Visit site"}
        <ArrowUpRight size={14} weight="bold" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {w.caseStudy && (
        <Link
          href={w.caseStudy}
          className="link-wipe inline-flex items-center gap-1 py-1 font-sans text-sm font-medium text-ink"
        >
          Read the case study <ArrowRight size={14} weight="bold" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** The poster, wiping open as it arrives. The frame is the poster's own
 *  16:10, so every site shows whole: its header, its edges, nothing trimmed. */
function Poster({ project: w, sizes, className }: { project: LiveProject; sizes: string; className?: string }) {
  const { reduce } = useStillRef();
  const closed = `inset(${REVEAL_INSET}% ${REVEAL_INSET}% ${REVEAL_INSET}% ${REVEAL_INSET}% round 16px)`;
  return (
    <motion.a
      href={w.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={visit(w)}
      tabIndex={-1}
      aria-hidden
      data-cursor="Open"
      data-reveal-clip
      initial={{ clipPath: closed }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0 : DUR.reveal, ease: EASE.out }}
      className={clsx(
        "group relative block aspect-16/10 overflow-hidden rounded-2xl border border-line bg-elevated",
        className,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={w.poster}
          alt=""
          width={1440}
          height={900}
          sizes={sizes}
          className="media-zoom h-auto w-full origin-top"
        />
      </div>
    </motion.a>
  );
}

function Caption({
  project: w,
  children,
  className,
}: {
  project: LiveProject;
  children?: React.ReactNode;
  className?: string;
}) {
  const { reduce } = useStillRef();
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0 : DUR.slow, ease: EASE.out }}
      className={clsx("min-w-0", className)}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <KindTag kind={w.kind} />
        <span className="font-mono text-xs text-faint">{w.category}</span>
      </div>
      <h3 className="mt-4 font-display text-[clamp(1.85rem,3vw,2.75rem)] leading-[1] font-[600] tracking-[-0.045em] text-ink">
        {w.client}
      </h3>
      {children}
    </motion.div>
  );
}

/* A client project as a photograph: the live site, large, then a caption band
   under it, the facts on the left and the client's own words (or, without
   them, what we built) on the right. The poster is height-capped so a whole
   site fits the screen on a short laptop. */
function ClientRow({ project: w }: { project: LiveProject }) {
  const words = CLIENTS.find((c) => c.workId === w.id);
  return (
    <article id={`work-${w.id}`} className="mx-auto w-full lg:max-w-[min(100%,calc((100svh-9rem)*1.6))]">
      <Poster project={w} sizes="(min-width: 1024px) 80vw, 100vw" />
      <div className="mt-7 grid gap-8 md:mt-8 lg:grid-cols-12 lg:gap-12">
        <Caption project={w} className="lg:col-span-5">
          {words ? (
            <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-muted">{w.description}</p>
          ) : null}
          <ProjectLinks project={w} />
        </Caption>
        <div className="min-w-0 lg:col-span-7">
          {words ? (
            <ClientWords words={words} />
          ) : (
            <p className="max-w-[52ch] font-display text-xl leading-snug font-[500] tracking-[-0.025em] text-ink md:text-2xl">
              {w.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* The studio's own product, one register down from the client work: a
   diptych instead of a full fold. */
function ProductRow({ project: w }: { project: LiveProject }) {
  return (
    <article id={`work-${w.id}`} className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
      <Poster project={w} sizes="(min-width: 1024px) 55vw, 100vw" className="lg:col-span-7" />
      <Caption project={w} className="lg:col-span-5">
        <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-muted">{w.description}</p>
        <ProjectLinks project={w} />
      </Caption>
    </article>
  );
}

function ConceptIndex() {
  const list = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<LiveProject | null>(null);
  // the floating preview is for a mouse; touch gets a thumbnail in each row
  const fine = useMediaQuery(FINE_POINTER);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.cursor);
  const sy = useSpring(y, SPRING.cursor);

  const onMove = (e: React.PointerEvent) => {
    const r = list.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div ref={list} onPointerMove={fine ? onMove : undefined} onPointerLeave={() => setHover(null)} className="relative mt-24 md:mt-32">
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <h3 className="font-display text-2xl font-[600] tracking-[-0.035em] text-ink md:text-3xl">
          {WORK_GROUPS.find((g) => g.kind === "concept")?.title}
        </h3>
        <p className="max-w-md font-sans text-sm text-muted md:text-right">{CONCEPT_NOTE}</p>
      </div>

      <ul className="mt-8 border-t border-line">
        {CONCEPTS.map((w) => (
          <li key={w.id} className="border-b border-line">
            <Link
              href={w.caseStudy ?? w.url}
              data-cursor="View"
              onPointerEnter={() => setHover(w)}
              onFocus={() => setHover(w)}
              onBlur={() => setHover(null)}
              className="group grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-8 md:py-7"
            >
              <span className="relative block aspect-16/10 overflow-hidden rounded-lg bg-elevated md:hidden">
                <Image src={w.poster} alt="" fill sizes="80px" className="object-cover object-top" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl leading-tight font-[600] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-accent-text md:text-4xl">
                  {w.client}
                </span>
                <span className="mt-1 block font-mono text-xs text-faint md:hidden">{w.category}</span>
              </span>
              <span className="hidden font-mono text-xs text-faint md:block">{w.category}</span>
              <span className="flex items-center gap-3">
                <span className="hidden sm:block">
                  <KindTag kind={w.kind} />
                </span>
                <ArrowRight
                  size={18}
                  weight="bold"
                  aria-hidden
                  className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent-text"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {fine && !reduce ? (
        <AnimatePresence>
          {hover ? (
            <motion.div
              key="preview"
              aria-hidden
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: DUR.base, ease: EASE.out }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden w-[22rem] -translate-x-1/2 -translate-y-[60%] lg:block"
            >
              <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_30px_60px_-28px_var(--shadow-tint)]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={hover.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.fast }}
                    className="absolute inset-0"
                  >
                    <Image src={hover.poster} alt="" fill sizes="352px" className="object-cover object-top" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </div>
  );
}

export function Work() {
  return (
    <Section id="work">
      <ChapterRule chapter={CHAPTERS.work} />
      <div className="mt-10 flex flex-col gap-5 md:mt-12 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-3xl font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] font-[600] tracking-[-0.05em] text-ink">
          {WORK_HEADER.title}
        </h2>
        <p className="max-w-sm font-sans text-sm leading-relaxed text-muted lg:text-right">{SUMMARY}</p>
      </div>

      <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
        {CLIENT_WORK.map((w) => (
          <ClientRow key={w.id} project={w} />
        ))}
        {PRODUCTS.map((w) => (
          <ProductRow key={w.id} project={w} />
        ))}
      </div>

      <ConceptIndex />
    </Section>
  );
}
