"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { CHAPTERS, REVIEWS, REVIEWS_HEADER, type Review } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { ReviewTheatre } from "@/components/ui/ReviewTheatre";
import { EVENTS, track } from "@/lib/analytics";
import { SPRING } from "@/lib/constants";
import { FINE_POINTER, useMediaQuery } from "@/lib/media";

/* In their words: the proof chapter, on the lifted ground with the page's
   first light falling on it. Clients on camera, each card a door into the
   theatre. The cards sit on an offset, editorial rhythm rather than a row of
   equal tiles, and each one carries its quote verbatim under it, so the proof
   reads even for someone who never presses play. */

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

function ReviewCard({
  review,
  active,
  onOpen,
}: {
  review: Review;
  active: boolean;
  onOpen: (trigger: HTMLElement) => void;
}) {
  const preview = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const fine = useMediaQuery(FINE_POINTER);
  const [previewing, setPreviewing] = useState(false);

  // a muted preview while the pointer rests on the card; the file is only
  // fetched the first time someone actually hovers
  const start = () => {
    const v = preview.current;
    if (!fine || reduce || !v) return;
    if (!v.getAttribute("src")) v.src = review.video;
    v.muted = true;
    void v.play().catch(() => {});
  };
  const stop = () => {
    const v = preview.current;
    setPreviewing(false);
    if (!v) return;
    v.pause();
    if (v.getAttribute("src")) v.currentTime = 0;
  };

  return (
    <figure className="min-w-0">
      <button
        type="button"
        onClick={(e) => {
          stop();
          onOpen(e.currentTarget);
        }}
        onPointerEnter={start}
        onPointerLeave={stop}
        data-cursor="Play"
        aria-haspopup="dialog"
        aria-label={`${REVIEWS_HEADER.watch}: ${review.name}, ${review.business}`}
        className="group relative block w-full rounded-2xl text-left"
      >
        {active ? (
          // the theatre has the frame; hold its place so nothing below jumps
          <span className="block aspect-4/5 w-full rounded-2xl bg-elevated" />
        ) : (
          <motion.span
            layoutId={`review-${review.slug}`}
            transition={SPRING.theatre}
            style={{ borderRadius: 16 }}
            className="relative block aspect-4/5 w-full overflow-hidden bg-elevated"
          >
            <Image
              src={review.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="media-zoom object-cover object-[center_30%]"
            />
            <video
              ref={preview}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
              tabIndex={-1}
              onPlaying={() => setPreviewing(true)}
              className={clsx(
                "absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-500",
                previewing ? "opacity-100" : "opacity-0",
              )}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-canvas/85 via-canvas/5 to-transparent" />
            <span className="absolute bottom-5 left-5 flex items-center gap-3 md:bottom-6 md:left-6">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-solid text-accent-ink transition-transform duration-500 group-hover:scale-110">
                <Play size={18} weight="fill" aria-hidden />
              </span>
              <span className="font-mono text-xs text-ink">
                {REVIEWS_HEADER.watch} · {time(review.duration)}
              </span>
            </span>
          </motion.span>
        )}
      </button>

      <figcaption className="mt-7">
        <blockquote className="font-display text-2xl leading-snug font-[600] tracking-[-0.02em] text-ink md:text-[1.75rem]">
          <span aria-hidden className="text-accent-text">
            “
          </span>
          {review.quote}
          <span aria-hidden className="text-accent-text">
            ”
          </span>
        </blockquote>
        <p className="mt-4 font-sans text-sm text-muted">
          <span className="font-medium text-ink">{review.name}</span>, {review.business} · {review.place}
        </p>
        {review.translatedFrom ? (
          <p className="mt-1 font-mono text-xs text-faint">
            {REVIEWS_HEADER.translated} {review.translatedFrom}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIndex(null);
    // after the frame has flown home, hand focus back to the card
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }, []);

  if (!REVIEWS.length) return null;

  return (
    <MotionConfig reducedMotion="user">
      <section id="reviews" className="light-top relative py-24 md:py-36">
        <Shell>
          <ChapterRule label={CHAPTERS.reviews} />
          <div className="mt-10 flex flex-col gap-5 md:mt-12 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] font-[650] tracking-[-0.035em] text-ink font-stretch-semi-expanded">
              {REVIEWS_HEADER.title}
            </h2>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-muted lg:text-right">{REVIEWS_HEADER.sub}</p>
          </div>

          <div className="mt-16 grid gap-20 md:mt-20 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
            {REVIEWS.map((r, i) => (
              <FadeIn
                key={r.slug}
                className={i % 2 === 0 ? "lg:col-span-6" : "lg:col-span-5 lg:col-start-8 lg:mt-40"}
              >
                <ReviewCard
                  review={r}
                  active={index === i}
                  onOpen={(el) => {
                    trigger.current = el;
                    setIndex(i);
                    track(EVENTS.reviewOpen, { client: r.business });
                  }}
                />
              </FadeIn>
            ))}
          </div>
        </Shell>

        <ReviewTheatre reviews={REVIEWS} index={index} onClose={close} onIndex={setIndex} />
      </section>
    </MotionConfig>
  );
}
