import Image from "next/image";
import { FOOTER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { Reveal } from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/constants";

/** §09 Footer. Minimal. No version stamps, no locale strips. Blocks fade up
 *  in sequence so the page's last beat still moves like the rest of it. */
export function Footer() {
  return (
    <footer className="border-t border-line py-16 md:py-20">
      <Shell>
        {/* the last word, in display type — the brand line is the sign-off */}
        <Reveal>
          <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            {FOOTER.line}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <Reveal>
            <Image
              src="/logo.png"
              alt={FOOTER.brand}
              width={150}
              height={150}
              className="h-auto w-28 md:w-32"
            />
          </Reveal>

          <Reveal delay={STAGGER.base} className="flex flex-col gap-3 md:items-end">
            <a
              href={`mailto:${FOOTER.email}`}
              className="font-sans text-sm text-ink transition-colors hover:text-accent"
            >
              {FOOTER.email}
            </a>
            <div className="flex gap-5">
              {FOOTER.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-sans text-sm text-muted transition-colors hover:text-ink"
                >
                  {s.label}
                  <span
                    aria-hidden
                    className="ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={STAGGER.loose}
          className="mt-12 border-t border-line pt-6 font-sans text-xs text-faint"
        >
          {FOOTER.year} {FOOTER.brand}. {FOOTER.rights}
        </Reveal>
      </Shell>
    </footer>
  );
}
