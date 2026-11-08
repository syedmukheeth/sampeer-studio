"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play, X } from "@phosphor-icons/react/dist/ssr";

type Reel = { code: string; account: string; caption: string; poster: string };

/* A local still in a phone frame; Instagram's player only loads once the
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
    <>
      <button
        type="button"
        onClick={show}
        aria-label={`Play reel by ${reel.account}: ${reel.caption}`}
        className="group relative block aspect-9/16 w-full overflow-hidden rounded-[2rem] border-[6px] border-ink bg-ink text-left shadow-[0_24px_60px_rgba(30,26,42,0.25)]"
      >
        <Image
          src={reel.poster}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 80vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-ink/30" />
        <span className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-2 px-4 pt-4 font-sans text-xs font-medium text-canvas">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          Reel
        </span>
        <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-canvas/30 motion-reduce:hidden" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-canvas text-accent shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play size={26} weight="fill" className="translate-x-0.5" />
          </span>
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-5 font-sans text-canvas">
          <span className="block text-xs text-canvas/80">{reel.account}</span>
          <span className="mt-1 block text-sm font-medium leading-snug">{reel.caption}</span>
        </span>
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-label={`Reel by ${reel.account}`}
        className="m-auto w-[min(400px,92vw)] overflow-hidden rounded-xl border border-line bg-canvas p-0 text-ink shadow-2xl backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-1.5 font-sans text-sm font-medium text-accent-text hover:underline"
          >
            Open on Instagram
            <ArrowUpRight size={14} weight="bold" />
          </a>
          <button
            type="button"
            onClick={close}
            aria-label="Close reel"
            className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-elevated-2 hover:text-ink"
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
    </>
  );
}
