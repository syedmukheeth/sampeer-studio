import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SERVICES, SERVICES_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

export function Services() {
  return (
    <Section id="services">
      <SectionHeader eyebrow={SERVICES_HEADER.eyebrow} title={SERVICES_HEADER.title} />
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted md:text-lg">{SERVICES_HEADER.sub}</p>

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <FadeIn as="li" key={s.id} delay={i * STAGGER.loose}>
            <a
              href={s.href}
              className="group flex h-full flex-col justify-between gap-10 rounded-lg border border-line bg-elevated p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_44px_rgba(30,26,42,0.1)] md:p-8"
            >
              <div>
                <span className="font-sans text-sm font-medium tabular-nums text-accent-text">{s.index}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted md:text-base">{s.body}</p>
              </div>
              <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-ink">
                {s.cta}
                <ArrowRight
                  size={16}
                  weight="bold"
                  aria-hidden
                  className="text-accent transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </a>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
