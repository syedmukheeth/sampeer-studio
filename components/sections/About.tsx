import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/** §07 About Syed. Asymmetric split. Manifesto, not bio. */
export function About() {
  return (
    <section id="about" className="px-6 py-32 md:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-line">
            <Image
              src={ABOUT.photo}
              alt={ABOUT.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="space-y-5">
            {ABOUT.manifesto.map((line, i) => (
              <Reveal
                key={i}
                as="p"
                delay={i * 0.1}
                className="font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl"
              >
                {line}
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div>
              <div className="font-display text-base font-semibold">{ABOUT.name}</div>
              <div className="font-sans text-sm text-muted">{ABOUT.role}</div>
            </div>
            <a
              href={ABOUT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 font-sans text-sm text-ink transition-colors hover:text-accent"
            >
              LinkedIn
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
