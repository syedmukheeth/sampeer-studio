import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT, FOUNDER, SOCIALS } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Marked } from "@/components/ui/Marked";

/* The person who answers: the one chapter in Syed's own voice. A portrait
   alone in its 4:5 frame with nothing laid over it
   (the film now sits with ASRG, the client it is about), beside the words,
   his own reach and every place to find him. No parallax. */
export function About() {
  // the last line is the pull line; the rest are the paragraphs
  const paragraphs = ABOUT.body.slice(0, -1);
  const pull = ABOUT.body.at(-1);

  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <figure className="min-w-0 lg:col-span-5">
          <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-elevated-2 shadow-[0_30px_60px_-40px_var(--shadow-tint)] lg:max-w-none">
            <Image
              src={FOUNDER.portrait.src}
              alt={FOUNDER.portrait.alt}
              fill
              sizes="(min-width: 1024px) 36vw, 92vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
        </figure>

        <div className="min-w-0 lg:col-span-7">
          <FadeIn>
            <p className="label">{ABOUT.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[clamp(2.25rem,4.6vw,3.9rem)] leading-[1.04] font-normal text-ink">
              <Marked text={ABOUT.title} />
            </h2>
          </FadeIn>
          <div className="mt-8 space-y-5">
            {paragraphs.map((p) => (
              <FadeIn key={p}>
                <p className="max-w-[54ch] font-sans text-base leading-relaxed text-muted md:text-lg">{p}</p>
              </FadeIn>
            ))}
            {pull ? (
              <FadeIn>
                <p className="max-w-[30ch] pt-3 font-serif text-2xl leading-snug font-normal text-ink md:text-3xl">
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

          {/* the guide's stat row: big orange figures, small mono labels */}
          <dl className="mt-8 grid max-w-lg grid-cols-3 border-t border-line">
            {ABOUT.proof.map((p, i) => (
              <div key={p.label} className={`flex flex-col-reverse pt-6 ${i > 0 ? "border-l border-line pl-4 sm:pl-6" : "pr-4"}`}>
                <dt className="mt-2 font-mono text-[11px] leading-snug tracking-[0.12em] text-faint uppercase">{p.label}</dt>
                <dd className="font-sans text-3xl leading-none font-semibold tracking-tight text-accent-text tabular-nums sm:text-4xl">
                  {p.value}
                </dd>
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
                  <span className="text-faint">{s.label}</span>
                  {s.handle}
                  <ArrowUpRight size={13} weight="bold" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href={ABOUT.cta.href}
            className="btn-press mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-accent-solid px-6 font-sans text-[15px] font-semibold whitespace-nowrap text-accent-ink hover:bg-accent-dim"
          >
            {ABOUT.cta.label}
            <ArrowUpRight size={16} weight="bold" aria-hidden />
          </a>
        </div>
      </div>
    </Section>
  );
}
