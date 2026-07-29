import Image from "next/image";
import mark from "../../public/logo-mark.png";

/** The S-ribbon mark on its own, for the nav bubble and anywhere the lockup
 *  would collapse to mush at small sizes.
 *
 *  The `full` variant that used to live here rendered `logo-full.png`, a lockup
 *  built for a black ground: its wordmark is baked in at #d6d6d6 silver, which
 *  measured 1.3:1 on the paper canvas, and it still read "sampeer studio" in
 *  the old lowercase. `LogoLockup` replaced it and sets the wordmark as live
 *  text, so the raster is gone rather than re-exported.
 *
 *  The mark ships with a real alpha channel (white ground removed), so it drops
 *  onto any surface with no framed rectangle and no blend hack. Never
 *  re-typeset; size with a width/height utility plus the paired `-auto` and let
 *  the intrinsic ratio hold. */
export function Logo({
  className = "",
  sizes,
  priority = false,
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={mark}
      alt="SAMPeer Studio"
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
