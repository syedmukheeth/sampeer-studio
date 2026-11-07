"use client";

import Image from "next/image";
import Link from "next/link";
import { WORK, WORK_HEADER, type LiveProject } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { track, EVENTS } from "@/lib/analytics";

export function Work() {
  return (
    <Section id="work">
      <div className="flex items-baseline justify-between border-t border-line pt-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {WORK_HEADER.title}
        </h2>
        <span className="font-sans text-sm tabular-nums text-faint">
          {String(WORK.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
        {WORK.map((w, i) => (
          <Project key={w.id} project={w} index={i} />
        ))}
      </div>
    </Section>
  );
}

function Project({ project: w, index }: { project: LiveProject; index: number }) {
  const visit = () => track(EVENTS.workVisitSite, { client: w.client });

  return (
    <article>
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={visit}
        className="group block overflow-hidden rounded-lg border border-line bg-elevated shadow-[0_10px_36px_rgba(30,26,42,0.06)]"
      >
        <span className="sr-only">{`Visit ${w.client}'s live site`}</span>
        <div className="relative aspect-16/10">
          <Image
            src={w.poster}
            alt=""
            fill
            sizes="(min-width: 1400px) 1320px, 100vw"
            priority={index === 0}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </a>

      <div className="mt-6 grid gap-4 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <p className="font-sans text-xs text-faint">
            <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden> · </span>
            {w.category}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {w.client}
          </h3>
        </div>

        <div className="md:col-span-7">
          <p className="font-sans text-base leading-relaxed text-muted">{w.description}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={visit}
              className="py-1 font-sans text-sm font-medium text-accent-text underline-offset-4 hover:underline"
            >
              Visit site ↗
            </a>
            {w.caseStudy && (
              <Link
                href={w.caseStudy}
                className="py-1 font-sans text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Read the case study →
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
