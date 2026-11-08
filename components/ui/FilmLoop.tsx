"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { getImageProps } from "next/image";
import { clsx } from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { FILM } from "@/lib/content";
import { EVENTS, track } from "@/lib/analytics";
import { ramp } from "@/lib/scroll";

/* The founder film behind the hero.

   Load order is the whole design:
   1. The poster is the first paint (art-directed: the three-panel still from
      768px, the tall still below), eager and high priority, so it is the LCP.
   2. The <video> ships with no src. Only after the page's load event, and an
      idle moment after that, does it get the one file this screen needs, so
      the film never competes with the page for bandwidth.
   3. It fades up over the poster only once it is actually playing.
   It pauses whenever it is off screen or the tab is hidden, and never
   autoplays under reduced motion or Save-Data; the toggle still plays it on
   request. The toggle is the WCAG 2.2.2 pause control for moving content. */

type FilmContext = {
  /** the media layer hands its <video> to the provider, for the toggle */
  register: (el: HTMLVideoElement | null) => void;
  userPaused: MutableRefObject<boolean>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  toggle: () => void;
};

const Ctx = createContext<FilmContext | null>(null);

function useFilm() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Film components must sit inside <FilmProvider>.");
  return ctx;
}

const WIDE_QUERY = "(min-width: 768px)";

function pickSrc() {
  return window.matchMedia(WIDE_QUERY).matches ? FILM.wide.src : FILM.tall.src;
}

export function FilmProvider({ children }: { children: React.ReactNode }) {
  const video = useRef<HTMLVideoElement | null>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      // the reduced-motion / Save-Data path never attached a source
      if (!v.getAttribute("src")) v.src = pickSrc();
      void v.play().catch(() => {});
      track(EVENTS.filmToggle, { to: "play" });
    } else {
      userPaused.current = true;
      v.pause();
      track(EVENTS.filmToggle, { to: "pause" });
    }
  }, []);

  const register = useCallback((el: HTMLVideoElement | null) => {
    video.current = el;
  }, []);

  const value = useMemo(
    () => ({ register, userPaused, playing, setPlaying, toggle }),
    [register, playing, toggle],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** The film layer: poster, video and scrim, filling its positioned parent. As
 *  the hero scrolls away the frame draws in from the edges and its corners
 *  round, so the film settles into the page instead of being cut off by it. */
export function FilmMedia() {
  const { register, userPaused, playing, setPlaying } = useFilm();
  const video = useRef<HTMLVideoElement | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const still = useRef(false);
  useEffect(() => {
    still.current = Boolean(reduce);
  }, [reduce]);

  // attach the source after load, then idle
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const auto = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && conn?.saveData !== true;
    if (!auto) return;

    let cancelled = false;
    let idleId = 0;
    const start = () => {
      if (cancelled || userPaused.current) return;
      v.src = pickSrc();
      void v.play().catch(() => {});
    };
    // Safari has no requestIdleCallback; a short timeout stands in for it
    const idle = typeof window.requestIdleCallback === "function";
    const later = () => {
      idleId = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300);
    };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", later);
      if (idle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, [userPaused]);

  // pause off screen and in background tabs; resume unless the reader paused
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let inView = true;
    const sync = () => {
      if (!v.getAttribute("src")) return;
      if (inView && !document.hidden && !userPaused.current) void v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
    };
  }, [userPaused, setPlaying]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end start"] });
  // function form, so Motion keeps it on the real scroll (see lib/scroll.ts)
  const scale = useTransform(scrollYProgress, (p) => (still.current ? 1 : ramp(p, [0, 1], [1, 0.9])));
  const radius = useTransform(scrollYProgress, (p) => (still.current ? "0px" : `${ramp(p, [0, 0.5], [0, 28])}px`));

  // Next 16 only serves the qualities listed in images.qualities (default 75)
  const common = { alt: "", sizes: "100vw" } as const;
  const {
    props: { srcSet: wideSet },
  } = getImageProps({ ...common, src: FILM.wide.poster, width: FILM.wide.w, height: FILM.wide.h });
  const {
    props: { srcSet: tallSet, ...img },
  } = getImageProps({
    ...common,
    src: FILM.tall.poster,
    width: FILM.tall.w,
    height: FILM.tall.h,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <motion.div
      ref={wrap}
      data-parallax
      aria-hidden
      style={{ scale, borderRadius: radius }}
      className="absolute inset-0 -z-10 origin-top overflow-hidden bg-canvas"
    >
      <picture>
        <source media={WIDE_QUERY} srcSet={wideSet} />
        <img {...img} srcSet={tallSet} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <video
        ref={(el) => {
          video.current = el;
          register(el);
        }}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        data-playing={playing ? "true" : "false"}
        className="film-video absolute inset-0 h-full w-full object-cover"
      />
      <div className="film-scrim absolute inset-0" />
    </motion.div>
  );
}

/** The pause/play control, placed wherever the hero's layout wants it. */
export function FilmToggle({ className }: { className?: string }) {
  const { playing, toggle } = useFilm();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? FILM.pause : FILM.play}
      className={clsx(
        "btn-press grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/25 bg-canvas/35 text-ink backdrop-blur-md hover:border-accent-text",
        className,
      )}
    >
      {playing ? <Pause size={15} weight="fill" aria-hidden /> : <Play size={15} weight="fill" aria-hidden />}
    </button>
  );
}

/** The statement drifts up a little faster than the page as the hero leaves,
 *  so the type and the film part ways instead of scrolling as one slab. */
export function FilmDrift({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const still = useRef(false);
  useEffect(() => {
    still.current = Boolean(reduce);
  }, [reduce]);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => (still.current ? 0 : -Math.min(v, 900) * 0.16));
  const opacity = useTransform(scrollY, (v) => (still.current ? 1 : ramp(v, [0, 700], [1, 0.25])));
  return (
    <motion.div data-parallax style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
