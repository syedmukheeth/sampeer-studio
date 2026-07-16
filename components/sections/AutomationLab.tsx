import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { AUTOMATION_TEASER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/constants";

/** §04b The doorway to the Growth Automation Lab. Sits directly under Work on
 *  purpose: the reader has just watched six live sites, which is the strongest
 *  possible moment to say "and then we make it run itself".
 *
 *  Static by design. Every diagram on /automations is a Flow driving an
 *  interval, and the home page already carries a pinned GSAP sweep and a live
 *  embed — this section earns the click, it does not re-stage the show. */
export function AutomationLab() {
  return (
    <Section id="automation-lab" className="border-t border-line">
      <SectionHeader
        eyebrow={AUTOMATION_TEASER.eyebrow}
        title={AUTOMATION_TEASER.title}
      />

      <Reveal delay={STAGGER.base}>
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {AUTOMATION_TEASER.sub}
        </p>
      </Reveal>

      <ul className="mt-14 grid max-w-4xl grid-cols-1 sm:grid-cols-2">
        {AUTOMATION_TEASER.systems.map((s, i) => (
          <Reveal
            key={s}
            as="li"
            delay={STAGGER.base * (i + 2)}
            className={`border-t border-line py-5 font-sans text-sm text-muted ${
              i % 2 !== 0 ? "sm:border-l sm:pl-6" : ""
            }`}
          >
            {s}
          </Reveal>
        ))}
      </ul>

      <Reveal delay={STAGGER.base * 6}>
        <Link
          href={AUTOMATION_TEASER.cta.href}
          className="group mt-14 inline-flex items-center gap-2 font-sans text-sm font-medium text-ink"
        >
          <span className="border-b border-accent pb-1">
            {AUTOMATION_TEASER.cta.label}
          </span>
          <ArrowRight
            size={16}
            weight="bold"
            aria-hidden
            className="text-accent transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </Section>
  );
}
