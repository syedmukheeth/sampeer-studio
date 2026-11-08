import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CASE_ASRG, CHAPTERS, CLIENTS, CLIENTS_HEADER, HOME_CASE, TESTIMONIAL } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { ClientLoop } from "@/components/ui/ClientLoop";
import { STAGGER } from "@/lib/constants";

/* 03 / Clients. What two clients said on camera, condensed and translated
   and said so, each beside a few silent seconds of them (no player, no
   sound). Then the one case study the home page goes deep on, on a night
   card: where ASRG was, what we built, and the owner's written words. No
   invented numbers: ASRG has not shared any, so the outcome is the owner's. */
export function Clients() {
  return (
    <section id="clients" className="relative bg-canvas py-24 md:py-36">
      <Shell>
        <ChapterRule chapter={CHAPTERS.clients} />

        <div className="mt-10 flex flex-col gap-5 md:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] font-[600] tracking-[-0.05em] text-ink">
            {CLIENTS_HEADER.title}
          </h2>
          <p className="max-w-sm font-sans text-sm leading-relaxed text-muted lg:text-right">
            {CLIENTS_HEADER.sub} {CLIENTS_HEADER.note}
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-24">
          {CLIENTS.map((c, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={c.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <FadeIn className={clsx("min-w-0 lg:col-span-4", flip && "lg:order-last lg:col-start-9")}>
                  <div className="relative mx-auto aspect-4/5 w-full max-w-[22rem] overflow-hidden rounded-3xl border border-line bg-elevated-2 lg:max-w-none">
                    <ClientLoop src={c.loop} poster={c.poster} sizes="(min-width: 1024px) 28vw, 22rem" />
                  </div>
                </FadeIn>
                <FadeIn delay={STAGGER.loose} className={clsx("min-w-0 lg:col-span-7", !flip && "lg:col-start-6", flip && "lg:col-start-1 lg:row-start-1")}>
                  <figure>
                    <span aria-hidden className="block h-2 w-2 bg-accent" />
                    <blockquote className="mt-6">
                      <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.18] font-[500] tracking-[-0.03em] text-ink">
                        {c.statement}
                      </p>
                    </blockquote>
                    <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-sans text-base font-semibold text-ink">{c.name}</span>
                      <span className="font-mono text-xs text-faint">
                        {c.role} · {c.place}
                      </span>
                    </figcaption>
                    <a
                      href={`#work-${c.workId}`}
                      className="link-wipe mt-5 inline-flex items-center gap-1.5 py-1 font-sans text-sm font-medium text-ink"
                    >
                      See what we built <ArrowRight size={14} weight="bold" aria-hidden />
                    </a>
                  </figure>
                </FadeIn>
              </article>
            );
          })}
        </div>

        {/* the case study, on night */}
        <FadeIn className="mt-24 md:mt-32">
          <article id="case" className="night grain overflow-hidden rounded-3xl bg-canvas">
            <div className="relative z-[2] grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
              <div className="relative aspect-[1072/1200] overflow-hidden rounded-2xl bg-elevated lg:col-span-5">
                <Image
                  src={TESTIMONIAL.photo}
                  alt={TESTIMONIAL.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 90vw"
                  className="mono object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center lg:col-span-7">
                <p className="font-mono text-xs tracking-[0.06em] text-faint uppercase">
                  <span className="text-accent-text">{HOME_CASE.eyebrow}</span> / {CASE_ASRG.meta[2]?.value}
                </p>
                <h3 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] font-[600] tracking-[-0.045em] text-ink">
                  {CASE_ASRG.client}
                </h3>
                <p className="mt-5 max-w-[46ch] font-sans text-lg leading-relaxed text-muted">{CASE_ASRG.tagline}</p>

                <dl className="mt-10 grid gap-8 sm:grid-cols-2">
                  {[
                    { label: HOME_CASE.challengeLabel, body: CASE_ASRG.challenge.body },
                    { label: HOME_CASE.solutionLabel, body: CASE_ASRG.solution.body },
                  ].map((b) => (
                    <div key={b.label} className="border-t border-line pt-5">
                      <dt className="font-mono text-xs text-faint">{b.label}</dt>
                      <dd className="mt-3 font-sans text-[15px] leading-relaxed text-muted">{b.body}</dd>
                    </div>
                  ))}
                </dl>

                <figure className="mt-10 border-t border-line pt-8">
                  <blockquote>
                    <p className="font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.35] font-[500] tracking-[-0.02em] text-ink">
                      <span aria-hidden className="text-accent-text">&ldquo;</span>
                      {TESTIMONIAL.quote}
                      <span aria-hidden className="text-accent-text">&rdquo;</span>
                    </p>
                  </blockquote>
                  <figcaption className="mt-4 font-mono text-xs text-faint">
                    {TESTIMONIAL.name} · {TESTIMONIAL.role}
                  </figcaption>
                </figure>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                  <Link
                    href={HOME_CASE.link.href}
                    className="link-wipe inline-flex items-center gap-1.5 py-1 font-sans text-[15px] font-medium text-ink"
                  >
                    {HOME_CASE.link.label} <ArrowRight size={15} weight="bold" aria-hidden />
                  </Link>
                  <a
                    href={CASE_ASRG.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-wipe inline-flex items-center gap-1.5 py-1 font-sans text-[15px] font-medium text-ink"
                  >
                    Visit site <ArrowUpRight size={15} weight="bold" aria-hidden />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </FadeIn>
      </Shell>
    </section>
  );
}
