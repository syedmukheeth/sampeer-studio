import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BRANDING, FOUNDER, SOCIALS } from "@/lib/content";

/* The founder's LinkedIn presence as an honest summary card, linking to the
   real profile. No drawn LinkedIn chrome (banner, Follow pill, verified seal):
   the card is a pointer to the profile, not an imitation of it. The numbers
   sit on one mono line; their big versions live in the proof strip. */
export function LinkedInCard() {
  const stats = BRANDING.linkedin.stats.map((s) => `${s.value} ${s.label}`).join("  /  ");

  return (
    <a
      href={SOCIALS.linkedin.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${FOUNDER.name} on LinkedIn`}
      className="group card-lift flex h-full flex-col rounded-2xl border border-line bg-elevated p-6"
    >
      <div className="flex items-center gap-4">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line">
          <Image
            src={FOUNDER.avatar}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold tracking-[-0.01em] text-ink">{FOUNDER.name}</p>
          <p className="font-mono text-xs text-faint">{SOCIALS.linkedin.label}</p>
        </div>
      </div>

      <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{BRANDING.linkedin.headline}</p>
      <p className="mt-4 font-mono text-xs text-accent-text">{stats}</p>

      <span className="mt-auto inline-flex items-center gap-1 pt-6 font-sans text-sm font-medium text-ink">
        View profile
        <ArrowUpRight
          size={14}
          weight="bold"
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </a>
  );
}
