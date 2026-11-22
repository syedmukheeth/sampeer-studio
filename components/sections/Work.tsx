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
import { Marked } from "@/components/ui/Marked";
import { ClientLoop } from "@/components/ui/ClientLoop";
import { FilmMedia, FilmProvider, FilmToggle } from "@/components/ui/FilmLoop";
import { track, EVENTS } from "@/lib/analytics";
import { DUR, EASE, RISE, SPRING } from "@/lib/constants";
import { FINE_POINTER, useMediaQuery } from "@/lib/media";

/* The work. The hero's happy clients, in the same order: each client opens
   on the live site whole inside its own 16:10, then what we built and the
   client's own words beside a few silent seconds of them (for ASRG, the film
   of the owner seeing his new site).

   One register down, the studio's own product as a diptych, and the concept
   builds as a typographic index with the poster following the cursor. The
   split is the honesty: paid work is never dressed the same as
   self-initiated work, and every concept row says so.

   Media never stretches: every frame owns its ratio (16:10 sites, 4:5 people)
   and sits at the top of its row (self-start), so a long quote can never pull
   a face into a strip. Posters are visible from the first paint on a tone
   that matches the paper; nothing wipes open from a blank box. */

const CLIENT_WORK = WORK.filter((w) => w.kind === "client");
const PRODUCTS = WORK.filter((w) => w.kind === "product");
const CONCEPTS = WORK.filter((w) => w.kind === "concept");
const CONCEPT_NOTE = WORK_GROUPS.find((g) => g.kind === "concept")?.note ?? "";

const TAG: Record<ProjectKind, string> = { client: "Client", product: "Studio product", concept: "Concept build" };


const visit = (w: LiveProject) => () => track(EVENTS.workVisitSite, { client: w.client, from: "work" });

function KindTag({ kind }: { kind: ProjectKind }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-0.5 font-sans text-xs font-medium whitespace-nowrap",
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
  const frame =
    "relative aspect-4/5 w-28 shrink-0 self-start overflow-hidden rounded-xl border border-line bg-elevated-2 md:w-40 xl:w-52";
  return (
    <figure className="flex items-start gap-5 md:gap-7">
      {words.film ? (
        <FilmProvider>
          <div className={frame}>
            <FilmMedia sizes="(min-width: 1280px) 208px, 160px" />
            <FilmToggle className="absolute right-2 bottom-2 h-9 w-9" />
          </div>
        </FilmProvider>
      ) : (
        <div className={frame}>
          <ClientLoop src={words.loop} poster={words.poster} sizes="(min-width: 1280px) 208px, 160px" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-sans text-sm text-faint">{CLIENT_WORDS.label}</p>
        <blockquote className="mt-2">
          <p className="font-serif text-xl leading-snug font-normal text-ink md:text-2xl">
            <span aria-hidden className="text-accent-text">&ldquo;</span>
            {words.statement}
            <span aria-hidden className="text-accent-text">&rdquo;</span>
          </p>
        </blockquote>
        <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-sans text-sm font-semibold text-ink">{words.name}</span>
          <span className="font-sans text-[13px] text-faint">{words.role}</span>
        </figcaption>
        <p className="mt-2 font-sans text-xs leading-relaxed text-faint">{CLIENT_WORDS.note}</p>
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

/** The poster in its own 16:10, so every site shows whole: its header, its
 *  edges, nothing trimmed. Visible from the first paint; the well behind it is
 *  a paper tone, so a slow image reads as a quiet card, never a white hole. */
function Poster({ project: w, sizes, className }: { project: LiveProject; sizes: string; className?: string }) {
  return (
    <a
      href={w.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={visit(w)}
      tabIndex={-1}
      aria-hidden
      data-cursor="Open"
      className={clsx(
        "group relative block aspect-16/10 overflow-hidden rounded-2xl border border-line bg-elevated-2 shadow-[0_30px_60px_-40px_var(--shadow-tint)]",
        className,
      )}
    >
      <Image src={w.poster} alt="" fill sizes={sizes} className="media-zoom origin-top object-cover object-top" />
    </a>
  );
}

function Caption({
  project: w,
  index,
  children,
  className,
}: {
  project: LiveProject;
  /** client rows are numbered, like the guide's plugins */
  index?: number;
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
      {index !== undefined ? <p className="label">Client {String(index + 1).padStart(2, "0")}</p> : null}
      <div className={clsx("flex flex-wrap items-center gap-x-2.5 gap-y-1.5", index !== undefined && "mt-3")}>
        <KindTag kind={w.kind} />
        <span className="font-sans text-[13px] text-faint">{w.category}</span>
      </div>
      <h3 className="mt-4 font-serif text-[clamp(1.85rem,3vw,2.75rem)] leading-[1.02] font-normal text-ink">
        {w.client}
      </h3>
      {w.fixed ? (
        <p className="mt-4 max-w-[46ch] border-l-2 border-accent pl-4 font-sans text-base leading-relaxed text-ink">
          <span className="text-accent-text">Fixed: </span>
          {w.fixed}
        </p>
      ) : null}
      {children}
    </motion.div>
  );
}

/* A client: the live site, then a caption band, the facts on the left and the
   client's own words (or, without them, what we built) on the right. The
   poster is height-capped so a whole site fits the screen on a short laptop. */
function ClientRow({ project: w, index }: { project: LiveProject; index: number }) {
  const words = CLIENTS.find((c) => c.workId === w.id);
  return (
    <article id={`work-${w.id}`} className="mx-auto w-full scroll-mt-28 lg:max-w-[min(100%,calc((100svh-9rem)*1.6))]">
      <Poster project={w} sizes="(min-width: 1024px) 80vw, 100vw" />
      <div className="mt-7 grid gap-8 md:mt-8 lg:grid-cols-12 lg:gap-12">
        <Caption project={w} index={index} className="lg:col-span-5">
          {words ? (
            <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-muted">{w.built ?? w.description}</p>
          ) : null}
          <ProjectLinks project={w} />
        </Caption>
        <div className="min-w-0 lg:col-span-7">
          {words ? (
            <ClientWords words={words} />
          ) : (
            <p className="max-w-[52ch] font-serif text-xl leading-snug font-normal text-ink md:text-2xl">
              {w.built ?? w.description}
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
        <h3 className="font-serif text-2xl font-normal text-ink md:text-3xl">
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
                <span className="block font-serif text-xl leading-tight font-normal text-ink transition-colors duration-300 group-hover:text-accent-text md:text-4xl">
                  {w.client}
                </span>
                <span className="mt-1 block font-sans text-[13px] text-faint md:hidden">{w.category}</span>
              </span>
              <span className="hidden font-sans text-[13px] text-faint md:block">{w.category}</span>
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
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="label">{WORK_HEADER.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02] font-normal text-ink">
            <Marked text={WORK_HEADER.title} />
          </h2>
        </div>
        <p className="max-w-sm font-sans text-sm leading-relaxed text-muted lg:text-right">
          {WORK_HEADER.sub}
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
        {CLIENT_WORK.map((w, i) => (
          <ClientRow key={w.id} project={w} index={i} />
        ))}
        {PRODUCTS.map((w) => (
          <ProductRow key={w.id} project={w} />
        ))}
      </div>

      <ConceptIndex />
    </Section>
  );
}
