import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BRANDING, REELS, SOCIALS } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { LinkedInCard } from "@/components/ui/LinkedInCard";
import { ReelEmbed } from "@/components/ui/ReelEmbed";
import { STAGGER } from "@/lib/constants";

const INSTAGRAMS = [SOCIALS.instagram, SOCIALS.studioInstagram];

export function FounderBrand() {
  return (
    <Section id="brand">
      <div className="grid gap-14 md:grid-cols-12 md:gap-12 lg:gap-16">
        <div className="md:col-span-7">
          <SectionHeader eyebrow={BRANDING.eyebrow} title={BRANDING.title} />
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">{BRANDING.sub}</p>

          <ol className="mt-10 border-t border-line">
            {BRANDING.moves.map((m, i) => (
              <FadeIn
                as="li"
                key={m.title}
                delay={i * STAGGER.base}
                className="grid gap-2 border-b border-line py-6 sm:grid-cols-[3rem_1fr]"
              >
                <span className="font-sans text-sm font-medium tabular-nums text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{m.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted md:text-base">{m.body}</p>
                </div>
              </FadeIn>
            ))}
          </ol>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <FadeIn>
              <LinkedInCard />
            </FadeIn>
            <FadeIn delay={STAGGER.base} className="flex flex-col gap-4">
              {INSTAGRAMS.map((ig) => (
                <a
                  key={ig.href}
                  href={ig.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-1 items-center justify-between gap-4 rounded-lg border border-line bg-elevated p-5 transition-colors duration-300 hover:border-accent/40"
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] font-sans text-xs font-bold text-white"
                    >
                      IG
                    </span>
                    <span>
                      <span className="block font-sans text-sm font-semibold text-ink">{ig.handle}</span>
                      <span className="block font-sans text-xs text-muted">{ig.label}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    aria-hidden
                    className="text-muted transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              ))}
            </FadeIn>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="mx-auto max-w-[320px] md:sticky md:top-28">
            <FadeIn>
              <ReelEmbed reel={REELS[0]} />
            </FadeIn>
            <p className="mt-4 text-center font-sans text-xs text-muted">Latest reel · tap to play</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
