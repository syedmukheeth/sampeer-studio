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
import { CHAPTERS, WORK, WORK_GROUPS, WORK_HEADER, type LiveProject, type ProjectKind } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { track, EVENTS } from "@/lib/analytics";
import { DUR, EASE, REVEAL_INSET, RISE, SPRING } from "@/lib/constants";
import { FINE_POINTER, useMediaQuery } from "@/lib/media";

/* Selected work, in two registers. The real projects (client sites and the
   studio's own product) are full showcase rows: big, alternating sides, each
   poster wiping open as it arrives and shown whole inside a frame cut to its own 16:10. The concept
   builds are an index, a typographic list, with the poster following the
   cursor on desktop. The split is the honesty: paid work is never dressed the
   same as self-initiated work, and every concept row says so. */

const FEATURED = WORK.filter((w) => w.kind !== "concept");
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

function FeaturedRow({ project: w, index }: { project: LiveProject; index: number }) {
  const row = useRef<HTMLElement>(null);
  const { reduce } = useStillRef();
  // function form, so Motion keeps it on the real scroll (see lib/scroll.ts)
  const flip = index % 2 === 1;
  const closed = `inset(${REVEAL_INSET}% ${REVEAL_INSET}% ${REVEAL_INSET}% ${REVEAL_INSET}% round 16px)`;

  return (
    <article ref={row} id={`work-${w.id}`} className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
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
          "group relative block aspect-16/10 overflow-hidden rounded-2xl border border-line bg-elevated lg:col-span-8",
          flip && "lg:order-last",
        )}
      >
        {/* the frame is the poster's own 16:10, so every site shows whole: its
            header, its edges, nothing trimmed by a drift */}
        <div className="absolute inset-0">
          <Image
            src={w.poster}
            alt=""
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="media-zoom h-auto w-full origin-top"
          />
        </div>
      </motion.a>

      <motion.div
        data-reveal
        initial={{ opacity: 0, y: RISE }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: reduce ? 0 : DUR.slow, ease: EASE.out }}
        className="min-w-0 lg:col-span-4"
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <KindTag kind={w.kind} />
          <span className="font-mono text-xs text-faint">{w.category}</span>
        </div>
        <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1] font-[600] tracking-[-0.045em] text-ink">
          {w.client}
        </h3>
        <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-muted">{w.description}</p>
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
              Case study <ArrowRight size={14} weight="bold" aria-hidden />
            </Link>
          )}
        </div>
      </motion.div>
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

      <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
        {FEATURED.map((w, i) => (
          <FeaturedRow key={w.id} project={w} index={i} />
        ))}
      </div>

      <ConceptIndex />
    </Section>
  );
}
