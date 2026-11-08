"use client";

import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { EVENTS, track } from "@/lib/analytics";
import { OFFER } from "@/lib/content";

const PREFILLS = new Set<string>(OFFER.packages.map((p) => p.prefill));

/** "Start with this": jumps to the contact form and writes the package into
 *  the message box, so the first line of the enquiry is already the right
 *  one. The form stays uncontrolled; this only sets the textarea's value when
 *  it is empty or still holds another chip's line, never over the reader's
 *  own words. */
export function PackageChip({ id, label, prefill }: { id: string; label: string; prefill: string }) {
  return (
    <a
      href="#contact"
      onClick={() => {
        const box = document.getElementById("contact-message");
        if (box instanceof HTMLTextAreaElement) {
          const current = box.value.trim();
          if (!current || PREFILLS.has(current)) box.value = prefill;
        }
        track(EVENTS.packageSelect, { id });
      }}
      className="btn-press inline-flex h-11 items-center gap-2 rounded-full bg-accent-solid px-5 font-sans text-sm font-medium whitespace-nowrap text-accent-ink hover:bg-accent-dim"
    >
      {label}
      <ArrowDown size={14} weight="bold" aria-hidden />
    </a>
  );
}
