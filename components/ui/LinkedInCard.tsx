import Image from "next/image";
import { ArrowUpRight, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { BRANDING, FOUNDER, SOCIALS } from "@/lib/content";

/* The real LinkedIn profile as a card, linking to the real profile. */
export function LinkedInCard() {
  return (
    <a
      href={SOCIALS.linkedin.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${FOUNDER.name} on LinkedIn`}
      className="group relative block h-full overflow-hidden rounded-lg border border-line bg-elevated shadow-[0_10px_36px_rgba(30,26,42,0.07)] transition-colors duration-500 hover:border-accent/40"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full z-20 w-full animate-[card-sheen_3s_ease-out_infinite] bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] motion-reduce:hidden"
      />

      <div className="relative h-16 bg-linear-to-r from-accent/40 via-accent/15 to-canvas">
        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-[4px] bg-[#0a66c2] text-[11px] font-bold lowercase text-white">
          in
        </span>
      </div>

      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-elevated">
            <Image src={FOUNDER.photo} alt="" fill sizes="64px" className="origin-[46%_41%] scale-[2.4] object-cover object-[46%_41%]" />
          </span>
          <span className="rounded-full bg-accent-solid px-3 py-1 font-sans text-xs font-medium text-accent-ink">
            Follow
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1">
          <span className="font-sans text-sm font-semibold text-ink">{FOUNDER.name}</span>
          <SealCheck size={14} weight="fill" className="text-accent" />
        </div>
        <p className="mt-1 font-sans text-xs leading-relaxed text-muted">{BRANDING.linkedin.headline}</p>

        <div className="mt-4 flex gap-6 border-t border-line pt-4">
          {BRANDING.linkedin.stats.map((s) => (
            <span key={s.label} className="flex flex-col">
              <span className="font-display text-lg font-semibold tabular-nums text-ink">{s.value}</span>
              <span className="font-sans text-xs text-muted">{s.label}</span>
            </span>
          ))}
        </div>

        <span className="mt-4 flex items-center gap-1 border-t border-line pt-3 font-sans text-xs font-medium text-muted transition-colors group-hover:text-accent-text">
          View full profile
          <ArrowUpRight
            size={13}
            weight="bold"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </a>
  );
}
