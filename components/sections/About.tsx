import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT, BRAND_MEANING, FOUNDER, SOCIALS } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

export function About() {
  return (
    <Section id="about">
      <div className="grid items-start gap-12 border-t border-line pt-16 md:grid-cols-12 md:gap-16 md:pt-20">
        <FadeIn className="md:col-span-5">
          <figure>
            <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-line bg-elevated">
              <Image
                src={FOUNDER.photo}
                alt={FOUNDER.name}
                fill
                sizes="(min-width: 768px) 38vw, 100vw"
                className="object-cover"
                style={{ objectPosition: FOUNDER.photoPosition }}
              />
            </div>
            <figcaption className="mt-4 font-sans text-sm">
              <span className="block font-medium text-ink">{FOUNDER.name}</span>
              <span className="block text-muted">{FOUNDER.role}</span>
            </figcaption>
          </figure>
        </FadeIn>

        <div className="md:col-span-7">
          <SectionHeader eyebrow={ABOUT.eyebrow} title={ABOUT.title} />
          <div className="mt-8 space-y-5">
            {ABOUT.body.map((p, i) => (
              <p
                key={i}
                className={
                  i === ABOUT.body.length - 1
                    ? "border-l-2 border-accent/40 pl-4 font-display text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl"
                    : "font-sans text-base leading-relaxed text-muted md:text-lg"
                }
              >
                {p}
              </p>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {Object.values(SOCIALS).map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3.5 py-2 font-sans text-sm text-ink transition-colors hover:border-accent/40 hover:text-accent-text"
                >
                  {s.handle}
                  <ArrowUpRight size={13} weight="bold" aria-hidden />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 border-t border-line pt-8">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-faint">{BRAND_MEANING.title}</p>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              {[...BRAND_MEANING.letters, { letter: "", ...BRAND_MEANING.suffix }].map((l, i) => (
                <FadeIn key={l.word} delay={i * STAGGER.base}>
                  <dt className="flex items-baseline gap-2">
                    {l.letter && (
                      <span aria-hidden className="font-display text-3xl font-bold leading-none text-accent-text">
                        {l.letter}
                      </span>
                    )}
                    <span className={`font-display text-lg font-semibold tracking-tight ${l.letter ? "text-ink" : "text-accent-text"}`}>
                      {l.word}
                    </span>
                  </dt>
                  <dd className="mt-1.5 font-sans text-sm leading-relaxed text-muted">{l.body}</dd>
                </FadeIn>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
