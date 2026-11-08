import Image from "next/image";
import mark from "../../public/logo-mark.png";

/** The S-ribbon mark on its own, for the nav pill and anywhere the lockup
 *  would collapse to mush at small sizes.
 *
 *  The mark ships with a real alpha channel, so it drops onto paper and night
 *  alike with no framed rectangle and no blend mode. (mix-blend-multiply, the
 *  usual trick for white-boxed raster logos, would sink the violet into the
 *  night panels; it is not needed.) Never re-typeset; size with a width or height
 *  utility plus the paired `-auto` and let the intrinsic ratio hold.
 *
 *  Eager, because the only caller is the nav, which is above every fold. */
export function Logo({
  className = "",
  sizes,
}: {
  className?: string;
  sizes?: string;
}) {
  return <Image src={mark} alt="" aria-hidden loading="eager" sizes={sizes} className={className} />;
}
