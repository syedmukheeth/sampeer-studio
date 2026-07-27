"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Magnetic } from "@/components/ui/Magnetic";
import { CurvedInput } from "@/components/ui/CurvedInput";
import { EASE, DUR } from "@/lib/constants";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The one contact form, shared by both CTAs. Email + a short message,
 * honeypot for bots, full state cycle (sending / sent / error). If the
 * endpoint isn't configured yet it degrades to opening the visitor's mail
 * app, a lead is never dropped on the floor.
 */
export function ContactForm({
  idPrefix,
  emailPlaceholder,
  messagePlaceholder,
  buttonLabel,
  submitEvent,
  source,
  fallbackEmail,
}: {
  idPrefix: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  buttonLabel: string;
  submitEvent: string;
  source: string;
  fallbackEmail: string;
}) {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const company = String(data.get("company") ?? "");

    setStatus("sending");
    track(submitEvent, { source });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, company, source }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      if (res.status === 503) {
        // endpoint not wired yet, hand off to the visitor's mail app
        window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
          "New project",
        )}&body=${encodeURIComponent(message)}`;
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : DUR.base, ease: EASE.out }}
        className="mx-auto mt-10 max-w-md font-sans text-base text-ink"
        role="status"
      >
        Got it. You will hear back within a day.
      </motion.p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3">
      {/* honeypot, hidden from people, irresistible to bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <label htmlFor={`${idPrefix}-email`} className="sr-only">
        Your email
      </label>
      {/* CurvedInput draws the border and background; the control keeps every
          attribute it had, so nothing about validation or submission changes */}
      <CurvedInput>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          // autoComplete lets the browser fill a known address; inputMode swaps
          // the phone keyboard to the one with @ and . on the primary row.
          // Spellcheck on an address only ever produces a red squiggle.
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          placeholder={emailPlaceholder}
          // text-base under md: iOS Safari zooms the whole page when a focused
          // input is under 16px, and the zoom does not come back out
          className="h-14 w-full rounded-[1.75rem] bg-transparent px-7 font-sans text-base text-ink placeholder:text-muted touch-manipulation focus-visible:outline-none md:text-sm"
        />
      </CurvedInput>

      <label htmlFor={`${idPrefix}-message`} className="sr-only">
        What are you building?
      </label>
      <CurvedInput>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={3}
          autoComplete="off"
          placeholder={messagePlaceholder}
          // extra vertical padding so three rows of text clear the bowed edges
          className="w-full resize-none rounded-[1.75rem] bg-transparent px-7 py-5 font-sans text-base text-ink placeholder:text-muted touch-manipulation focus-visible:outline-none md:text-sm"
        />
      </CurvedInput>

      <Magnetic strength={0.3}>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-md bg-accent-solid px-6 font-sans text-sm font-medium text-accent-ink transition-[transform,background-color] active:scale-[0.98] active:bg-accent-dim disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : buttonLabel}
          <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </button>
      </Magnetic>

      {status === "error" && (
        <p className="font-sans text-sm text-muted" role="alert">
          That didn&apos;t go through. Check the address and try again, or email
          us directly:{" "}
          <a href={`mailto:${fallbackEmail}`} className="text-ink underline underline-offset-4">
            {fallbackEmail}
          </a>
        </p>
      )}
    </form>
  );
}
