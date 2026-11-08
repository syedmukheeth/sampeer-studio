import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT, BRAND_MEANING, FOUNDER, SOCIALS } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

/* Who actually does the work: one person, with a face. Then the name, which is
   also the services list: S, A and M are the three things I sell, and Peer is
   how I sell them. */
export function About() {
  return (
    <Section id="about">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-5">
          <figure>
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-line bg-elevated">
              <Image
                src={FOUNDER.photo}
                alt={FOUNDER.name}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
                style={{ objectPosition: FOUNDER.photoPosition }}
              />
            </div>
            <figcaption className="mt-4">
              <span className="block font-sans text-base font-medium text-ink">{FOUNDER.name}</span>
              <span className="block font-mono text-xs text-faint">{FOUNDER.role}</span>
            </figcaption>
          </figure>
        </FadeIn>

        <div className="lg:col-span-7 lg:pt-6">
          <SectionHeader title={ABOUT.title} />
          <div className="mt-8 space-y-5">
            {ABOUT.body.map((p, i) =>
              i === ABOUT.body.length - 1 ? (
                <p
                  key={i}
                  className="border-l-2 border-accent pl-5 font-display text-xl leading-snug font-semibold tracking-[-0.01em] text-ink md:text-2xl"
                >
                  {p}
                </p>
              ) : (
                <p key={i} className="max-w-[60ch] font-sans text-base leading-relaxed text-muted md:text-lg">
                  {p}
                </p>
              ),
            )}
          </div>

          <ul className="mt-9 flex flex-wrap gap-2">
            {Object.values(SOCIALS).map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-elevated px-4 font-sans text-sm text-ink hover:border-accent hover:text-accent-text"
                >
                  {s.handle}
                  <ArrowUpRight size={13} weight="bold" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* the name, spelled out: three letters, three services, one way of working */}
      <div className="mt-24 md:mt-32">
        <p className="font-mono text-xs font-medium tracking-[0.04em] text-accent-text">{BRAND_MEANING.label}</p>
        <h3 className="mt-5 max-w-3xl font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] font-[650] tracking-[-0.03em] text-ink font-stretch-semi-expanded">
          {BRAND_MEANING.title}
        </h3>
        <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">{BRAND_MEANING.sub}</p>

        <ul className="mt-12 border-t border-line">
          {BRAND_MEANING.letters.map((l, i) => (
            <FadeIn
              as="li"
              key={l.letter}
              delay={i * STAGGER.base}
              className="grid items-baseline gap-x-8 gap-y-3 border-b border-line py-8 md:grid-cols-12 md:py-10"
            >
              <span
                aria-hidden
                className="font-display text-6xl leading-none font-bold tracking-[-0.04em] text-accent font-stretch-expanded md:col-span-2 md:text-8xl"
              >
                {l.letter}
              </span>
              <div className="md:col-span-4">
                <p className="font-display text-2xl font-[650] tracking-[-0.02em] text-ink font-stretch-semi-expanded md:text-3xl">
                  {l.word}
                </p>
                <p className="mt-1.5 font-sans text-base text-muted">{l.body}</p>
              </div>
              <div className="md:col-span-6">
                <p className="font-mono text-xs text-faint">{l.service}</p>
                <p className="mt-1.5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-muted">{l.detail}</p>
                <a
                  href={l.href}
                  className="link-wipe mt-3 inline-flex items-center gap-1.5 py-1 font-sans text-sm font-medium text-accent-text"
                >
                  {l.cta} <ArrowRight size={14} weight="bold" aria-hidden />
                </a>
              </div>
            </FadeIn>
          ))}
          <FadeIn
            as="li"
            delay={BRAND_MEANING.letters.length * STAGGER.base}
            className="grid items-baseline gap-x-8 gap-y-3 border-b border-line py-8 md:grid-cols-12 md:py-10"
          >
            <span
              aria-hidden
              className="font-display text-6xl leading-none font-bold tracking-[-0.04em] text-accent-text font-stretch-expanded md:col-span-2 md:text-8xl"
            >
              +
            </span>
            <div className="md:col-span-10">
              <p className="font-display text-2xl font-[650] tracking-[-0.02em] text-ink font-stretch-semi-expanded md:text-3xl">
                {BRAND_MEANING.suffix.word}
              </p>
              <p className="mt-1.5 max-w-[60ch] font-sans text-base text-muted">{BRAND_MEANING.suffix.body}</p>
            </div>
          </FadeIn>
        </ul>
      </div>
    </Section>
  );
}
