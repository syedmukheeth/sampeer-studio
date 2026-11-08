import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BRANDING, REELS, SOCIALS } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { LinkedInCard } from "@/components/ui/LinkedInCard";
import { ReelEmbed } from "@/components/ui/ReelEmbed";
import { STAGGER } from "@/lib/constants";

const INSTAGRAM = [SOCIALS.instagram, SOCIALS.studioInstagram];

/* An asymmetric trio: the argument on the left, the proof on the right. The
   proof is my own founder brand, built the way I build a client's: the
   LinkedIn profile, the reel, the two Instagram accounts. The accounts are two
   compact rows, not two tall cards with nothing in them. */
export function FounderBrand() {
  return (
    <Section id="brand">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeader title={BRANDING.title} />
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted md:text-lg">{BRANDING.sub}</p>

          <ol className="mt-10 space-y-6">
            {BRANDING.moves.map((m, i) => (
              <FadeIn as="li" key={m.title} delay={i * STAGGER.base} className="border-t border-line pt-5">
                <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink font-stretch-semi-expanded">
                  {m.title}
                </h3>
                <p className="mt-2 max-w-md font-sans text-[15px] leading-relaxed text-muted">{m.body}</p>
              </FadeIn>
            ))}
          </ol>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="flex flex-col gap-6">
            <FadeIn>
              <LinkedInCard />
            </FadeIn>
            <FadeIn delay={STAGGER.base}>
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {INSTAGRAM.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-elevated"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-xs text-faint">{s.label}</span>
                        <span className="mt-0.5 block truncate font-sans text-base text-ink">{s.handle}</span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="shrink-0 text-accent-text transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={STAGGER.loose} className="mx-auto w-full max-w-xs sm:max-w-none">
            <ReelEmbed reel={REELS[0]} />
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}
