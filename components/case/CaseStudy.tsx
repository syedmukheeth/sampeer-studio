"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import type { CaseStudyData } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Shell } from "@/components/ui/Shell";
import { Reveal } from "@/components/ui/Reveal";
import { LiveSiteFrame } from "@/components/ui/LiveSiteFrame";
import { track, EVENTS } from "@/lib/analytics";

/**
 * A single case study, data-driven. Takes any CaseStudyData object, so a new
 * client drops in without a new component. Reuses the site's primitives
 * (Section, Reveal, LiveSiteFrame) so a case study reads as the same brand,
 * not a bolt-on.
 *
 * Visual proof has two variants: `gallery` (real on-site photos, ASRG) or
 * `shots` (desktop + mobile captures of the live site, the concept builds).
 * Whichever the data carries is rendered; the object never carries both.
 */
export function CaseStudy({ data }: { data: CaseStudyData }) {
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
      {data.gallery && (
        <Section>
          <SectionHeader title={data.gallery.title} />
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
            {data.gallery.photos.map((p, i) => (
              <Reveal key={p.src} delay={i * 0.08}>
                <figure className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line ring-1 ring-transparent transition duration-500 hover:border-accent/40 hover:ring-accent/20">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* legibility scrim + caption, revealed on the image itself */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas/90 to-transparent"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 font-sans text-xs text-ink">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                    {p.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-4xl font-sans text-sm text-muted">{data.gallery.caption}</p>
          </Reveal>
        </Section>
      )}

      {/* -------------------------------------------------------- shots */}
      {/* Live-site proof for the concept builds: the desktop still (the poster,
          a real capture already in the repo) in a browser frame, with a LIVE
          phone-frame render of the site overlapping its lower-right — one figure
          reading as "the same build, both screens". No separate capture files:
          desktop is data.poster, mobile is a scaled live iframe of data.liveUrl. */}
      {data.shots && (
        <Section>
          <SectionHeader title={data.shots.title} />
          <Reveal>
            <div className="mx-auto mt-12 max-w-5xl">
              <div className="relative pb-20 sm:pb-0 sm:pr-32 md:pr-44">
                {/* desktop — the poster in a browser chrome frame */}
                <figure className="group relative aspect-16/10 overflow-hidden rounded-md border border-line bg-elevated ring-1 ring-transparent transition duration-500 hover:border-accent/40 hover:ring-accent/20">
                  <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-line bg-canvas/80 px-3 backdrop-blur-sm">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-line" />
                    <span aria-hidden className="h-2 w-2 rounded-full bg-line" />
                    <span aria-hidden className="h-2 w-2 rounded-full bg-line" />
                    <span className="ml-2 truncate font-sans text-[10px] text-faint">
                      {hostOf(data.liveUrl)}
                    </span>
                  </div>
                  <Image
                    src={data.poster}
                    alt={`${data.client} live site, desktop view`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover object-top pt-7 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </figure>

                {/* phone — a live, inert render of the site at mobile width */}
                <figure className="absolute bottom-0 right-0 w-32 overflow-hidden rounded-[1.25rem] border border-line bg-elevated p-1 shadow-xl ring-1 ring-transparent transition duration-500 hover:border-accent/40 hover:ring-accent/20 sm:w-36 md:w-44">
                  <div className="overflow-hidden rounded-[1rem]">
                    <MobilePreview
                      url={data.liveUrl}
                      title={`${data.client}, mobile view`}
                    />
                  </div>
                </figure>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-5xl font-sans text-sm text-muted">{data.shots.caption}</p>
          </Reveal>
        </Section>
      )}

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

/** Bare host of a URL for the browser-chrome label (falls back to the raw URL). */
function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Virtual mobile viewport the embedded site renders at, then scales down to
 *  the phone frame's measured width. 390x844 ~ a modern phone. */
const M_W = 390;
const M_H = 844;

/**
 * A live, inert render of a site at mobile width, scaled into a phone frame.
 * Same guarantees as LiveSiteFrame's embed — sandboxed, pointer-events none,
 * aria-hidden — but sized for a phone so the case study shows the responsive
 * build without needing a separate captured screenshot. Only one mounts per
 * case-study page, so the cost is a single frame.
 */
function MobilePreview({ url, title }: { url: string; title: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / M_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className="relative w-full overflow-hidden bg-elevated"
      style={{ aspectRatio: `${M_W} / ${M_H}` }}
    >
      {/* monogram plate until the frame paints in */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: loaded ? 0 : 1, transition: "opacity 0.5s ease-out" }}
      >
        <span className="font-display text-3xl font-medium text-faint">
          {title.charAt(0)}
        </span>
      </div>

      {scale > 0 && (
        <iframe
          src={url}
          title={title}
          width={M_W}
          height={M_H}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          aria-hidden
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500 ease-out"
          style={{ transform: `scale(${scale})`, opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
