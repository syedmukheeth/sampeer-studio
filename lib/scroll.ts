/**
 * Piecewise-linear map of `p` across `stops` onto `values`, clamped at both
 * ends: the same curve useTransform(value, stops, values) would draw.
 *
 * Use it through the FUNCTION form, `useTransform(progress, (p) => ramp(...))`,
 * for anything driven by a useScroll progress. Given keyframe arrays, Motion
 * hands scroll-linked opacity and transforms to a native scroll timeline, and
 * on the sticky build stages (BuildSequence) that timeline stays frozen on its
 * first frame: captions that never appear, a finished diagram that never fades
 * and sits on top of the next one. A function cannot be handed off, so the
 * value always tracks the real scroll.
 */
export function ramp(p: number, stops: readonly number[], values: readonly number[]) {
  if (p <= stops[0]) return values[0];
  for (let k = 1; k < stops.length; k++) {
    if (p <= stops[k]) {
      const t = (p - stops[k - 1]) / (stops[k] - stops[k - 1] || 1);
      return values[k - 1] + (values[k] - values[k - 1]) * t;
    }
  }
  return values[values.length - 1];
}
