"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DUR } from "@/lib/constants";

/** Virtual desktop viewport the embedded site renders at. 1440x900 is 16:10,
 *  matching the card's aspect-[16/10] exactly — one measured width scales
 *  both axes. */
const FRAME_W = 1440;
const FRAME_H = 900;

/**
 * Live, scaled-down embed of a real site — mounted ONLY while the card is
 * hovered.
 *
 * The earlier version mounted every frame on approach and never unmounted, on
 * the logic that a reload flash is worse than the memory. With six cards that
 * left six full websites — six sets of scripts, fonts, and hero animations —
 * running for the rest of the session, including long after the section had
 * been scrolled past. That is a permanent frame-rate tax on every section
 * below Work, so the trade is inverted here: at most ONE site is ever live,
 * and the reload flash is paid for at the moment of hover, where the user is
 * asking for it.
 *
 * At rest the card shows `poster` if given, otherwise a monogram plate. Touch
 * devices never hover, so they only ever see the poster — which is the right
 * outcome for a phone anyway.
 *
 * The iframe is inert (pointer-events none, tabIndex -1, aria-hidden): the
 * parent card owns hover, click, and keyboard; embedded sites can never
 * hijack scroll.
 */
export function LiveSiteFrame({
  url,
  title,
  poster,
}: {
  url: string;
  title: string;
  /** still frame shown at rest; falls back to a monogram plate */
  poster?: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / FRAME_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // a card that goes cold drops its frame; the next hover starts clean
  function leave() {
    setHot(false);
    setLoaded(false);
  }

  return (
    <div
      ref={wrapper}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={leave}
      className="absolute inset-0 overflow-hidden bg-elevated"
    >
      {/* rest state — also the loading state, since the frame fades in over it */}
      {poster ? (
        <Image
          src={poster}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover object-top"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="font-display text-6xl font-medium text-faint">
            {title.charAt(0)}
          </span>
        </div>
      )}

      {hot && scale > 0 && (
        <iframe
          src={url}
          title={title}
          width={FRAME_W}
          height={FRAME_H}
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
