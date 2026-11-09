"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { FILM } from "@/lib/content";
import { EVENTS, track } from "@/lib/analytics";
import { ramp } from "@/lib/scroll";

/* The founder film, framed in the founder chapter.

   Load order is the whole design:
   1. The poster is a plain lazy image; nothing about the film loads with the
      page.
   2. The <video> ships with no src. It gets its file only when the frame
      comes into view, so a reader who never scrolls that far never pays for it.
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
      if (!v.getAttribute("src")) v.src = FILM.src;
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

/** The film layer: poster, video and a light foot scrim, filling its
 *  positioned parent. */
export function FilmMedia({ sizes }: { sizes: string }) {
  const { register, userPaused, playing, setPlaying } = useFilm();
  const video = useRef<HTMLVideoElement | null>(null);

  // attach the source the first time the frame is on screen; after that, play
  // on screen and pause off it or in a background tab, unless the reader paused
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const auto = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && conn?.saveData !== true;
    let inView = false;
    const sync = () => {
      if (inView && auto && !userPaused.current && !v.getAttribute("src")) v.src = FILM.src;
      if (!v.getAttribute("src")) return;
      if (inView && !document.hidden && !userPaused.current) void v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
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

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-elevated">
      <Image
        src={FILM.poster}
        alt=""
        width={FILM.w}
        height={FILM.h}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
      />
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
    </div>
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
        "btn-press grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/25 bg-canvas/40 text-ink backdrop-blur-md hover:border-ink/60",
        className,
      )}
    >
      {playing ? <Pause size={15} weight="fill" aria-hidden /> : <Play size={15} weight="fill" aria-hidden />}
    </button>
  );
}

/** Day breaking: the night hero is a panel on paper. As it scrolls away it
 *  draws in from the edges and its corners round, so the night settles into
 *  the page as a card instead of being cut off by it. */
export function NightFold({ children, className }: { children: React.ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const still = useRef(false);
  useEffect(() => {
    still.current = Boolean(reduce);
  }, [reduce]);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end start"] });
  // function form, so Motion keeps it on the real scroll (see lib/scroll.ts)
  const scale = useTransform(scrollYProgress, (p) => (still.current ? 1 : ramp(p, [0, 0.8], [1, 0.94])));
  const radius = useTransform(scrollYProgress, (p) => (still.current ? "0px" : `${ramp(p, [0, 0.4], [0, 28])}px`));
  return (
    <motion.div ref={wrap} data-parallax style={{ scale, borderRadius: radius }} className={clsx("origin-top", className)}>
      {children}
    </motion.div>
  );
}
