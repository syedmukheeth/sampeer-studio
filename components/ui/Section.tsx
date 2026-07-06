import { clsx } from "clsx";
import { Shell } from "@/components/ui/Shell";

/**
 * VERTICAL RHYTHM — one source of truth.
 * Before this, every section invented its own padding (py-20 / py-32 md:py-40 /
 * py-40 md:py-48 ...). The eye read that randomness as "cheap". Now there are
 * three deliberate sizes and nothing else.
 */
const SIZE = {
  /** standard storytelling block */
  base: "py-28 md:py-40",
  /** climactic block (the CTA) — extra air, feels like an arrival */
  lg: "py-36 md:py-56",
  /** section owns its own spacing (pinned/full-bleed/horizontal) */
  flush: "py-0",
} as const;

export function Section({
  id,
  children,
  className,
  size = "base",
  shell = true,
  as: Tag = "section",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof SIZE;
  /** wrap children in the standard Shell container */
  shell?: boolean;
  as?: "section" | "div";
}) {
  const inner = shell ? <Shell>{children}</Shell> : children;
  return (
    <Tag id={id} className={clsx("relative", SIZE[size], className)}>
      {inner}
    </Tag>
  );
}

/**
 * The one eyebrow + heading pattern. Kills the three different eyebrow styles
 * that were scattered across sections. Indigo tick = the "noticed" accent,
 * rationed to one per header.
 */
export function SectionHeader({
  eyebrow,
  title,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={clsx(
        align === "center" && "mx-auto text-center",
        "max-w-3xl",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={clsx(
            "flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.22em] text-faint",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={clsx(
          "mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
