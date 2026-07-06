import Image from "next/image";
import { FOOTER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";

/** §09 Footer. Minimal. No version stamps, no locale strips. */
export function Footer() {
  return (
    <footer className="border-t border-line py-16">
      <Shell>
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Image
              src="/logo.png"
              alt={FOOTER.brand}
              width={150}
              height={150}
              className="h-auto w-32 md:w-36"
            />
            <p className="mt-4 max-w-xs font-sans text-sm text-muted">{FOOTER.line}</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
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
                  className="font-sans text-sm text-muted transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 font-sans text-xs text-faint">
          {FOOTER.year} {FOOTER.brand}. All rights reserved.
        </div>
      </Shell>
    </footer>
  );
}
