import { clsx } from "clsx";

/**
 * The one container. Every section's content lives inside a Shell so the page
 * has a single, consistent measure and gutter. No more ad-hoc
 * `mx-auto max-w-[1400px] px-6` repeated (and drifting) per section.
 */
export function Shell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1400px] px-6 md:px-10", className)}>
      {children}
    </div>
  );
}
