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
  phonePlaceholder,
  messagePlaceholder,
  buttonLabel,
  submitEvent,
  source,
  fallbackEmail,
}: {
  idPrefix: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
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
    const phone = String(data.get("phone") ?? "");
    const message = String(data.get("message") ?? "");
    const company = String(data.get("company") ?? "");

    setStatus("sending");
    track(submitEvent, { source });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, message, company, source }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      if (res.status === 503) {
        // endpoint not wired yet, hand off to the visitor's mail app
        // the number rides along on this path too, or a lead that arrives
        // while the endpoint is unconfigured is the one lead we cannot call
        window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
          "New project",
        )}&body=${encodeURIComponent(
          phone ? `${message}\n\nPhone: ${phone}` : message,
        )}`;
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
        className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2.5 font-sans text-base text-ink"
        role="status"
      >
        {/* The tick draws itself once. This is the one place on the page where
            the animation IS the message: the stroke completing is what says
            the send landed. Under reduced motion it is simply already drawn. */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path className="check-draw" d="M4 12.5 L9.5 18 L20 6.5" />
        </svg>
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
          className="h-14 w-full rounded-[1.75rem] bg-transparent px-7 font-sans text-base text-ink placeholder:text-muted touch-manipulation outline-none focus:outline-none focus-visible:outline-none md:text-sm"
        />
      </CurvedInput>

      <label htmlFor={`${idPrefix}-phone`} className="sr-only">
        Your phone number (optional)
      </label>
      {/* Optional, and labelled as optional in the placeholder. A required
          number on a lead form is a bigger drop than the calls it wins; asking
          for it is what turns a reply-by-email lead into one that can be rung
          the same afternoon. `type="tel"` for the numeric keypad, not for
          validation, browsers do not validate it, and any pattern strict
          enough to be useful rejects half the world's real numbers. */}
      <CurvedInput>
        <input
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          spellCheck={false}
          placeholder={phonePlaceholder}
          className="h-14 w-full rounded-[1.75rem] bg-transparent px-7 font-sans text-base text-ink placeholder:text-muted touch-manipulation outline-none focus:outline-none focus-visible:outline-none md:text-sm"
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
          className="w-full resize-none rounded-[1.75rem] bg-transparent px-7 py-5 font-sans text-base text-ink placeholder:text-muted touch-manipulation outline-none focus:outline-none focus-visible:outline-none md:text-sm"
        />
      </CurvedInput>

      <Magnetic strength={0.3}>
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-press inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-md bg-accent-solid px-6 font-sans text-sm font-medium text-accent-ink active:bg-accent-dim disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : buttonLabel}
          {/* the trailing glyph reports the state rather than decorating it:
              the arrow becomes a spinner for exactly as long as the request is
              in flight, so a slow network is visible instead of just dimming
              the control */}
          {status === "sending" ? (
            <span aria-hidden className="spinner h-3.5 w-3.5 shrink-0" />
          ) : (
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          )}
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
