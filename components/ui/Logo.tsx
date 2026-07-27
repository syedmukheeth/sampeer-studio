import Image from "next/image";

/**
 * The SAMPeer brand signature lockup, drawn from the supplied brand PNGs
 * (transparent ground, so it sits on paper or elevated cards alike):
 *  - `mark`: the round S-ribbon medallion, for small square containers.
 *  - `full`: horizontal medallion + "SAMPeer / STUDIO" lockup.
 */
export function Logo({
  variant = "full",
  className = "",
  sizes,
  priority,
}: {
  variant?: "full" | "mark";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (variant === "mark") {
    return (
      <Image
        src="/logo-mark.png"
        alt="SAMPeer Studio"
        width={399}
        height={411}
        sizes={sizes ?? "56px"}
        priority={priority}
        className={`h-full w-full object-cover ${className}`.trim()}
      />
    );
  }

  return (
    <Image
      src="/logo-full.png"
      alt="SAMPeer Studio"
      width={1212}
      height={411}
      sizes={sizes}
      priority={priority}
      className={`h-auto ${className}`.trim()}
    />
  );
}
