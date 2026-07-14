"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { DUR } from "@/lib/constants";

/** Virtual desktop viewport the embedded site renders at. 1440x900 is 16:10,
 *  matching the card's aspect-[16/10] exactly — one measured width scales
 *  both axes. */
const FRAME_W = 1440;
const FRAME_H = 900;

/**
 * Live, scaled-down embed of a real site. The iframe mounts only once the
 * card nears the viewport (IntersectionObserver sees through the GSAP
 * track translate, so cards mount just-in-time during the pin sweep) and is
 * never unmounted — a reload flash is worse than the memory.
 *
 * The iframe is inert (pointer-events none, tabIndex -1, aria-hidden): the
 * parent card owns hover, click, and keyboard; embedded sites can never
 * hijack scroll.
 */
export function LiveSiteFrame({ url, title }: { url: string; title: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const inView = useInView(wrapper, { once: true, margin: "0px 50% 0px 50%" });

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / FRAME_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0 overflow-hidden bg-elevated">
      {/* skeleton — client initial, pulses until the site arrives */}
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 flex animate-pulse items-center justify-center motion-reduce:animate-none"
        >
          <span className="font-display text-6xl font-medium text-faint">
            {title.charAt(0)}
          </span>
        </div>
      )}
      {inView && scale > 0 && (
        <iframe
          src={url}
          title={title}
          width={FRAME_W}
          height={FRAME_H}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          tabIndex={-1}
          aria-hidden
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity ease-out"
          style={{
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
            transitionDuration: `${DUR.base}s`,
          }}
        />
      )}
    </div>
  );
}
