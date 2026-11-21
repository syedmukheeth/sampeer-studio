"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import type { HeroReel } from "@/lib/content";

/** The hero's happy-client reels: a few silent seconds of each real client,
 *  looping side by side. Each card links to that client's work below.
 *
 *  The files attach only once the row is on screen; the row pauses when it
 *  leaves or the tab is hidden. Under reduced motion or Save-Data it stays on
 *  the posters until the reader presses play. The one toggle pauses all of
 *  them, the WCAG 2.2.2 control for moving content. */
export function ReelWall({
  reels,
  label,
  pause,
  play,
}: {
  reels: readonly HeroReel[];
  label: string;
  pause: string;
  play: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const userPaused = useRef(false);
  const sync = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData === true) {
      userPaused.current = true;
    }
    let inView = false;
    sync.current = () => {
      const go = inView && !document.hidden && !userPaused.current;
      videos.current.forEach((v, i) => {
        if (!v) return;
        v.muted = true;
        if (go) {
          if (!v.getAttribute("src")) v.src = reels[i].loop;
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
      setPlaying(go);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync.current();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    const onVisibility = () => sync.current();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reels]);

  const toggle = () => {
    userPaused.current = !userPaused.current;
    sync.current();
  };

  return (
    <div ref={root}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-sm font-medium text-ink">{label}</p>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? pause : play}
          className="btn-press grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink hover:border-ink/60"
        >
          {playing ? <Pause size={13} weight="fill" aria-hidden /> : <Play size={13} weight="fill" aria-hidden />}
        </button>
      </div>

      {/* a swipe row on phones, all four across from the tablet up */}
      <ul className="-mx-6 mt-3 flex snap-x snap-mandatory gap-3 [scroll-padding-inline:1.5rem] overflow-x-auto px-6 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {reels.map((r, i) => (
          <li key={r.id} className="w-[44vw] shrink-0 snap-start sm:w-auto">
            <a href={r.href} className="group block rounded-xl">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-line bg-elevated">
                <Image
                  src={r.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 11vw, (min-width: 640px) 22vw, 44vw"
                  className="object-cover"
                />
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  aria-hidden
                  muted
                  loop
                  playsInline
                  preload="none"
                  tabIndex={-1}
                  disablePictureInPicture
                  disableRemotePlayback
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-2.5 font-sans text-sm font-medium text-ink">{r.name}</p>
              <p className="mt-0.5 font-sans text-xs leading-snug text-muted">{r.what}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
