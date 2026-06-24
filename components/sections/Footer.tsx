import { FOOTER } from "@/lib/content";

/** §09 Footer. Minimal. No version stamps, no locale strips. */
export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <div className="font-display text-lg font-semibold">{FOOTER.brand}</div>
            <p className="mt-2 max-w-xs font-sans text-sm text-muted">{FOOTER.line}</p>
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
      </div>
    </footer>
  );
}
