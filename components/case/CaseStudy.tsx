"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import type { CASE_ASRG } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Shell } from "@/components/ui/Shell";
import { Reveal } from "@/components/ui/Reveal";
import { LiveSiteFrame } from "@/components/ui/LiveSiteFrame";
import { track, EVENTS } from "@/lib/analytics";

/**
 * A single case study, data-driven. Built for ASRG first but takes any object
 * of the CASE_ASRG shape, so the second and third clients drop in without a
 * new component. Reuses the site's primitives (Section, Reveal, LiveSiteFrame)
 * so a case study reads as the same brand, not a bolt-on.
 */
export function CaseStudy({ data }: { data: typeof CASE_ASRG }) {
  return (
    <main>
      {/* ---------------------------------------------------------- hero */}
      <Section size="base">
        <Reveal>
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} weight="bold" />
            Work
          </Link>
        </Reveal>

        <div className="mt-10 max-w-4xl">
          <Reveal>
            <p className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.22em] text-faint">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {data.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.03] tracking-tight md:text-6xl">
              {data.client}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted">
              {data.tagline}
            </p>
          </Reveal>
        </div>

        {/* fact row */}
        <Reveal delay={0.15}>
          <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
            {data.meta.map((m) => (
              <div key={m.label} className="bg-canvas p-5">
                <dt className="font-sans text-xs uppercase tracking-[0.18em] text-faint">
                  {m.label}
                </dt>
                <dd className="mt-2 font-sans text-sm text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* ------------------------------------------------- live exhibit */}
      <Section size="flush" shell={false}>
        <Shell>
          <Reveal>
            <a
              href={data.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.workVisitSite, { client: data.client })}
              className="group relative block aspect-16/10 overflow-hidden rounded-md border border-line bg-elevated transition-colors duration-500 hover:border-accent/40"
            >
              <LiveSiteFrame
                url={data.liveUrl}
                title={`${data.client}, live site`}
                poster={data.poster}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-accent/8 transition-opacity duration-700 group-hover:opacity-0"
              />
              <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-md border border-line bg-canvas/80 px-3 py-1.5 font-sans text-xs text-ink backdrop-blur-sm transition-colors group-hover:border-accent/40">
                {data.visit}
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </a>
          </Reveal>
        </Shell>
      </Section>

      {/* --------------------------------------------- challenge + solution */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {[data.challenge, data.solution].map((block, i) => (
            <Reveal key={block.title} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {block.title}
                </h2>
                <p className="mt-5 font-display text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
                  {block.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------- services */}
      <Section>
        <SectionHeader title={data.servicesTitle} />
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((s, i) => (
            <li key={s} className="bg-canvas">
              <Reveal delay={(i % 3) * 0.05} className="flex h-full items-center gap-3 p-6">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-sm border border-accent/30 text-accent">
                  <Check size={13} weight="bold" />
                </span>
                <span className="font-sans text-sm text-ink">{s}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------ gallery */}
      <Section>
        <SectionHeader title={data.gallery.title} />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {data.gallery.photos.map((p, i) => (
            <Reveal key={p.src} delay={i * 0.08}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 45vw"
                  className="object-cover grayscale transition-[filter] duration-700 ease-out group-hover:grayscale-0"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 font-sans text-sm text-muted">{data.gallery.caption}</p>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ outcome */}
      <Section>
        <div className="max-w-3xl border-t border-line pt-6">
          <Reveal>
            <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {data.outcome.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl">
              {data.outcome.body}
            </p>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
