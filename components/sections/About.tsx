import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT, FILM, FOUNDER, SOCIALS } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { FilmMedia, FilmProvider, FilmToggle } from "@/components/ui/FilmLoop";

/* Behind the studio: the one chapter in Syed's own voice. A portrait that
   looks at the reader, with the founder film inset at its corner (a client
   seeing his new site, then the city, the desk and the build), beside the
   words, the founder's own reach and the ways to find him. No parallax. */
export function About() {
  // the last line is the pull line; the rest are the paragraphs
  const paragraphs = ABOUT.body.slice(0, -1);
  const pull = ABOUT.body.at(-1);

  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className="min-w-0 lg:col-span-5">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-line bg-elevated">
              <Image
                src={FOUNDER.portrait.src}
                alt={FOUNDER.portrait.alt}
                fill
                sizes="(min-width: 1024px) 36vw, 92vw"
                className="object-cover"
              />
            </div>
            {/* the film, inset at the corner: the founder first, the work beside him */}
            <FilmProvider>
              <div className="night absolute right-3 bottom-3 aspect-4/5 w-[38%] overflow-hidden rounded-xl border-[3px] border-canvas bg-canvas shadow-[0_24px_48px_-24px_var(--shadow-tint)] lg:-right-8 lg:-bottom-8 lg:w-[42%] lg:rounded-2xl lg:border-[6px]">
                <FilmMedia sizes="(min-width: 1024px) 16vw, 38vw" />
                <FilmToggle className="absolute right-2 bottom-2 z-[2]" />
              </div>
            </FilmProvider>
          </div>
          <figcaption className="mx-auto mt-4 max-w-md font-mono text-xs leading-relaxed text-faint lg:mt-12 lg:max-w-none">
            {FOUNDER.portrait.caption} {FILM.label}
          </figcaption>
        </figure>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <FadeIn>
            <h2 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.02] font-[600] tracking-[-0.05em] text-ink">
              {ABOUT.title}
            </h2>
          </FadeIn>
          <div className="mt-8 space-y-5">
            {paragraphs.map((p) => (
              <FadeIn key={p}>
                <p className="max-w-[56ch] font-sans text-base leading-relaxed text-muted md:text-lg">{p}</p>
              </FadeIn>
            ))}
            {pull ? (
              <FadeIn>
                <p className="border-l-2 border-accent pl-5 font-display text-xl leading-snug font-[560] tracking-[-0.03em] text-ink md:text-2xl">
                  {pull}
                </p>
              </FadeIn>
            ) : null}
          </div>

          <p className="mt-8 font-sans text-sm text-muted">
            <span className="font-medium text-ink">{FOUNDER.name}</span>
            <span className="mx-2 text-faint">·</span>
            {FOUNDER.role}
          </p>

          <dl className="mt-6 grid max-w-sm grid-cols-2 gap-6 border-t border-line pt-6">
            {ABOUT.proof.map((p) => (
              <div key={p.label} className="flex flex-col-reverse">
                <dt className="mt-1 font-mono text-xs text-faint">{p.label}</dt>
                <dd className="font-display text-3xl font-[600] tracking-[-0.04em] text-ink tabular-nums">{p.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex flex-wrap gap-2">
            {Object.values(SOCIALS).map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-elevated px-4 font-sans text-sm text-ink hover:border-ink"
                >
                  {s.handle}
                  <ArrowUpRight size={13} weight="bold" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
