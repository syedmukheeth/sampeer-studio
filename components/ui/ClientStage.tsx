"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import type { HeroReel } from "@/lib/content";

type StageLabels = {
  label: string;
  pause: string;
  play: string;
  show: string;
  open: string;
};

/** The hero's client stage: one card where the real clients take turns, a
 *  few silent seconds each, crossfading from one to the next and looping.
 *  The card links to the client on screen; the segments along the top show
 *  how far the current clip has run and jump straight to a client.
 *
 *  Only the clip on screen plays, and the next one buffers behind it. The
 *  card pauses when it leaves the viewport or the tab is hidden. Under
 *  reduced motion or Save-Data it never starts on its own: the first poster
 *  stands, the segments switch posters, and the toggle plays on request. The
 *  toggle is the WCAG 2.2.2 pause control for the moving content. */
export function ClientStage({
  reels,
  labels,
  className,
}: {
  reels: readonly HeroReel[];
  labels: StageLabels;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(0);
  const userPaused = useRef(false);
  const inView = useRef(false);
  const sync = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  /** fill the segments: done ones full, later ones empty, the current one at `f` */
  const paint = useCallback((current: number, f: number) => {
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      const v = i < current ? 1 : i > current ? 0 : f;
      bar.style.transform = `scaleX(${v})`;
    });
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData === true) {
      userPaused.current = true;
    }

    sync.current = () => {
      const go = inView.current && !document.hidden && !userPaused.current;
      const now = activeRef.current;
      const next = (now + 1) % reels.length;
      videos.current.forEach((v, i) => {
        if (!v) return;
        v.muted = true;
        if (i === now && go) {
          if (!v.getAttribute("src")) v.src = reels[i].loop;
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
        // buffer the next clip behind the playing one, so the cut is clean
        if (i === next && go && !v.getAttribute("src")) {
          v.preload = "auto";
          v.src = reels[i].loop;
        }
      });
      setPlaying(go);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        sync.current();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    const onVisibility = () => sync.current();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reels]);

  // the current segment fills with its clip; transform only, no re-renders
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const i = activeRef.current;
      const v = videos.current[i];
      if (v && v.duration > 0) paint(i, Math.min(1, v.currentTime / v.duration));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, paint]);

  const goTo = useCallback(
    (n: number) => {
      const prev = activeRef.current;
      activeRef.current = n;
      setActive(n);
      const v = videos.current[n];
      if (v && v.getAttribute("src")) v.currentTime = 0;
      paint(n, 0);
      sync.current();
      const pv = videos.current[prev];
      if (pv && prev !== n) {
        // rewind the outgoing clip once it has faded away
        window.setTimeout(() => {
          if (activeRef.current !== prev && pv.getAttribute("src")) pv.currentTime = 0;
        }, 600);
      }
    },
    [paint],
  );

  const toggle = () => {
    userPaused.current = !userPaused.current;
    sync.current();
  };

  const current = reels[active];

  return (
    <div ref={root} className={className}>
      <div className="relative aspect-4/5 overflow-hidden rounded-xl border-[5px] border-canvas bg-elevated shadow-[0_32px_64px_-24px_var(--shadow-tint)]">
        {reels.map((r, i) => (
          <div
            key={r.id}
            aria-hidden
            data-active={i === active}
            className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out data-[active=true]:opacity-100 motion-reduce:transition-none"
          >
            <Image
              src={r.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 15rem, 46vw"
              className="object-cover"
            />
            <video
              ref={(el) => {
                videos.current[i] = el;
              }}
              muted
              playsInline
              preload="none"
              tabIndex={-1}
              disablePictureInPicture
              disableRemotePlayback
              onEnded={() => {
                if (activeRef.current === i) goTo((i + 1) % reels.length);
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}

        {/* a scrim, then each client's caption, crossfading with its clip */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 via-45% to-black/30" />
        {reels.map((r, i) => (
          <div
            key={r.id}
            aria-hidden
            data-active={i === active}
            className="absolute inset-x-0 bottom-0 flex flex-col p-3 opacity-0 transition-opacity duration-500 ease-out data-[active=true]:opacity-100 motion-reduce:transition-none sm:p-3.5"
          >
            <span className="font-sans text-[11px] font-medium text-accent-text sm:text-xs">{labels.label}</span>
            <span className="mt-0.5 font-sans text-[13px] leading-snug font-semibold text-white sm:text-sm">{r.name}</span>
            <span className="mt-0.5 hidden font-sans text-xs leading-snug text-white/80 xl:line-clamp-2">{r.what}</span>
          </div>
        ))}

        {/* the card itself is the link to the client on screen */}
        <a
          href={current.href}
          aria-label={`${current.name}: ${current.what} ${labels.open}`}
          className="absolute inset-0 z-[1] rounded-[7px]"
        />

        {/* progress segments (each jumps to its client) and the pause toggle */}
        <div className="absolute inset-x-0 top-0 z-[2] flex items-center gap-2 px-2 pt-1.5">
          <div role="group" aria-label={labels.label} className="flex flex-1 gap-1">
            {reels.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${labels.show} ${r.name}`}
                aria-current={i === active ? "true" : undefined}
                className="relative h-6 min-w-6 flex-1 cursor-pointer"
              >
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/35">
                  <span
                    ref={(el) => {
                      bars.current[i] = el;
                    }}
                    className="block h-full w-full origin-left bg-white"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? labels.pause : labels.play}
            className="btn-press grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65"
          >
            {playing ? <Pause size={11} weight="fill" aria-hidden /> : <Play size={11} weight="fill" aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
