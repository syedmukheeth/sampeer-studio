"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** A few silent seconds of a client, looping like a GIF. The file has no
 *  audio track at all. Nothing downloads until the frame is near the screen,
 *  it pauses whenever it leaves, and under reduced motion or Save-Data it
 *  stays on its poster. Decorative: the words beside it carry the meaning. */
export function ClientLoop({ src, poster, sizes }: { src: string; poster: string; sizes: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData === true) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.getAttribute("src")) v.src = src;
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <div aria-hidden className="absolute inset-0">
      <Image src={poster} alt="" fill sizes={sizes} className="object-cover" />
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
