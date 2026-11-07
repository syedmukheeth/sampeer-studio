import Image from "next/image";
import { ABOUT, TEAM } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="about" size="flush">
      <div className="grid gap-10 border-t border-line py-16 md:grid-cols-12 md:gap-14 md:py-20">
        <div className="md:col-span-5">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {ABOUT.title}
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-muted">{ABOUT.body}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 md:col-span-7">
          {TEAM.map((m) => (
            <li key={m.id} className="rounded-lg border border-line bg-elevated p-5">
              <div className="flex items-center gap-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    style={{ objectPosition: m.photoPosition ?? "center 15%" }}
                  />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-base font-semibold leading-tight">{m.name}</div>
                  <div className="font-sans text-sm text-muted">{m.role}</div>
                </div>
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{m.line}</p>
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block py-1.5 font-sans text-xs font-medium text-accent-text hover:underline"
                >
                  LinkedIn ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
