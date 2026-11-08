import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CASE_ASRG, HOME_CASE, REVIEWS, REVIEWS_HEADER, TESTIMONIAL } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

/* The one case study the home page goes deep on, with the client's own words
   folded in. Where they were, what we built, what they said. No invented
   numbers: ASRG has not shared any, so the outcome is the owner's quote, and
   his review on camera sits just above. */
const onCamera = REVIEWS.some((r) => r.workId === "asrg");

export function CaseFeature() {
  return (
    <Section id="case">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* the photos: the owner and Syed at his office, the handshake inset */}
        <FadeIn className="relative mx-auto w-full max-w-md pr-10 pb-12 lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[1072/1200] overflow-hidden rounded-2xl border border-line bg-elevated">
            <Image
              src={TESTIMONIAL.photo}
              alt={TESTIMONIAL.photoAlt}
              fill
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-4/5 w-[40%] overflow-hidden rounded-xl border-4 border-canvas bg-elevated shadow-[0_24px_48px_-24px_var(--shadow-tint)]">
            <Image
              src={TESTIMONIAL.photoSecondary}
              alt={TESTIMONIAL.photoSecondaryAlt}
              fill
              sizes="(min-width: 1024px) 15vw, 36vw"
              className="object-cover"
            />
          </div>
        </FadeIn>

        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="font-mono text-xs font-medium tracking-[0.04em] text-accent-text">{HOME_CASE.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] font-[650] tracking-[-0.03em] text-ink font-stretch-semi-expanded">
            {CASE_ASRG.client}
          </h2>
          <p className="mt-5 max-w-[46ch] font-sans text-lg leading-relaxed text-ink md:text-xl">
            {CASE_ASRG.tagline}
          </p>

          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              { label: HOME_CASE.challengeLabel, body: CASE_ASRG.challenge.body },
              { label: HOME_CASE.solutionLabel, body: CASE_ASRG.solution.body },
            ].map((b, i) => (
              <FadeIn key={b.label} delay={i * STAGGER.base} className="border-t border-line pt-5">
                <dt className="font-mono text-xs text-faint">{b.label}</dt>
                <dd className="mt-3 font-sans text-[15px] leading-relaxed text-muted">{b.body}</dd>
              </FadeIn>
            ))}
          </dl>

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
              className="link-wipe inline-flex items-center gap-1.5 py-1 font-sans text-[15px] font-medium text-accent-text"
            >
              Visit site <ArrowUpRight size={15} weight="bold" aria-hidden />
            </a>
            {onCamera ? (
              <a
                href="#reviews"
                className="link-wipe inline-flex items-center gap-1.5 py-1 font-sans text-[15px] font-medium text-ink"
              >
                {REVIEWS_HEADER.watch} <ArrowUp size={15} weight="bold" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* the client's words, set wide, attribution in the margin */}
      <figure className="mt-20 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-14">
        <span aria-hidden className="rule-scrub block h-px bg-line lg:col-span-12" />
        <figcaption className="order-last font-mono text-xs leading-relaxed text-faint lg:order-none lg:col-span-3 lg:pt-2">
          <span className="block text-ink">{TESTIMONIAL.name}</span>
          {TESTIMONIAL.role}
        </figcaption>
        <blockquote className="lg:col-span-9">
          <p className="font-display text-[clamp(1.5rem,2.7vw,2.4rem)] leading-[1.25] font-[520] tracking-[-0.015em] text-ink">
            <span aria-hidden className="text-accent-text">&ldquo;</span>
            {TESTIMONIAL.quote}
            <span aria-hidden className="text-accent-text">&rdquo;</span>
          </p>
        </blockquote>
      </figure>
    </Section>
  );
}
