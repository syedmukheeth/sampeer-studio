"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play, X } from "@phosphor-icons/react/dist/ssr";

type Reel = { code: string; account: string; caption: string; poster: string };

/* The reel as what it is: a 9:16 still with a hairline edge, no drawn phone
   around it (the visitor is already holding the real one). The caption sits
   under the still rather than on it. Instagram's player only loads once the
   visitor asks for it, inside a modal sized to the embed's own layout. */
export function ReelEmbed({ reel }: { reel: Reel }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const url = `https://www.instagram.com/reel/${reel.code}/`;

  const show = () => {
    setOpen(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <figure>
      <button
        type="button"
        onClick={show}
        aria-label={`Play reel by ${reel.account}: ${reel.caption}`}
        className="group relative block aspect-9/16 w-full overflow-hidden rounded-2xl border border-line bg-elevated text-left"
      >
        <Image src={reel.poster} alt="" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="media-zoom object-cover" />
        <span className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent-solid text-accent-ink shadow-[0_18px_36px_-14px_var(--shadow-tint)] transition-transform duration-300 group-hover:scale-110">
          <Play size={24} weight="fill" className="translate-x-0.5" />
        </span>
      </button>
      <figcaption className="mt-4">
        <span className="block font-mono text-xs text-faint">{reel.account}</span>
        <span className="mt-1 block font-sans text-sm leading-snug text-ink">{reel.caption}</span>
      </figcaption>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-label={`Reel by ${reel.account}`}
        className="m-auto w-[min(400px,92vw)] overflow-hidden rounded-2xl border border-line bg-canvas p-0 text-ink shadow-[0_40px_80px_-30px_var(--shadow-tint)] backdrop:bg-canvas/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-wipe inline-flex items-center gap-1 py-1.5 font-sans text-sm font-medium text-accent-text"
          >
            Open on Instagram
            <ArrowUpRight size={14} weight="bold" aria-hidden />
          </a>
          <button
            type="button"
            onClick={close}
            aria-label="Close reel"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-elevated-2 hover:text-ink"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        {open && (
          <iframe
            src={`${url}embed/`}
            title={`Instagram reel by ${reel.account}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="block h-[min(720px,80vh)] w-full border-0 bg-canvas"
          />
        )}
      </dialog>
    </figure>
  );
}
