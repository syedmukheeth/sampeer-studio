import { clsx } from "clsx";
import { Shell } from "@/components/ui/Shell";

/**
 * VERTICAL RHYTHM, one source of truth.
 * Before this, every section invented its own padding (py-20 / py-32 md:py-40 /
 * py-40 md:py-48 ...). The eye read that randomness as "cheap". Now there are
 * three deliberate sizes and nothing else.
 */
const SIZE = {
  /** standard storytelling block */
  base: "py-20 md:py-28",
  /** climactic block (the CTA), extra air, feels like an arrival */
  lg: "py-28 md:py-40",
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
 * The one eyebrow + heading pattern. Eyebrows are rationed (at most one per
 * three sections on a page), set in the mono, with no decorative dot: the
 * label names the topic and nothing else. Headings stretch on the width axis
 * like the hero, one notch quieter.
 */
export function SectionHeader({
  eyebrow,
  title,
  className,
  align = "left",
  accent = false,
  rule = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  /** Put the section's label and title in the violet, the same colour that
   *  marks the struck word up top. Rationed, a page of violet headings spends
   *  the accent and it stops meaning anything. */
  accent?: boolean;
  /** Draw a hairline under the header. Opt-in, not default: most headers are
   *  followed immediately by their own sub-paragraph, and a rule between a
   *  title and its subtitle divides the two things that belong together.
   *  Reserved for headers that open a grid or a stack. */
  rule?: boolean;
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
            "mb-5 font-mono text-xs font-medium tracking-[0.04em]",
            accent ? "text-accent-text" : "text-faint",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={clsx(
          "font-display text-[clamp(2rem,4.2vw,3.5rem)] font-[650] leading-[1.02] tracking-[-0.03em] font-stretch-semi-expanded",
          accent && "text-accent-text",
        )}
      >
        {title}
      </h2>
      {/* The header's closing rule. It draws against the scrollbar rather than
          on an entrance trigger (see `.rule-scrub`), so it is motion the reader
          drives, it reverses when they scroll back, and it can never leave the
          heading sitting above an invisible line. */}
      {rule ? (
        <span
          aria-hidden
          className={clsx(
            "rule-scrub mt-7 block h-px w-full",
            align === "center" && "rule-scrub--center",
            accent ? "bg-accent/35" : "bg-line",
          )}
        />
      ) : null}
    </div>
  );
}
