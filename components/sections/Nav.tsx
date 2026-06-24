import { NAV } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

/** §00 Top nav. One line, <=72px. Magnetic CTA added in Phase 3. */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-canvas/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a href="#hero" className="font-display text-base font-semibold tracking-tight">
          {NAV.brand}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-sans text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <Magnetic>
          <a
            href={NAV.cta.href}
            className="inline-block rounded-md bg-accent px-4 py-2 font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98]"
          >
            {NAV.cta.label}
          </a>
        </Magnetic>
      </nav>
    </header>
  );
}
