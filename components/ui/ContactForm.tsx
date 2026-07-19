"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE, DUR } from "@/lib/constants";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The one contact form, shared by both CTAs. Email + a short message,
 * honeypot for bots, full state cycle (sending / sent / error). If the
 * endpoint isn't configured yet it degrades to opening the visitor's mail
 * app — a lead is never dropped on the floor.
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
        // endpoint not wired yet — hand off to the visitor's mail app
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
      {/* honeypot — hidden from people, irresistible to bots */}
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
      <input
        id={`${idPrefix}-email`}
        name="email"
        type="email"
        required
        placeholder={emailPlaceholder}
        className="h-12 rounded-md border border-line bg-elevated px-4 font-sans text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />

      <label htmlFor={`${idPrefix}-message`} className="sr-only">
        What are you building?
      </label>
      <textarea
        id={`${idPrefix}-message`}
        name="message"
        rows={3}
        placeholder={messagePlaceholder}
        className="resize-none rounded-md border border-line bg-elevated px-4 py-3 font-sans text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />

      <Magnetic strength={0.3}>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-md bg-accent-solid px-6 font-sans text-sm font-medium text-accent-ink transition-[transform,background-color] active:scale-[0.98] active:bg-accent-dim disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : buttonLabel}
          <ArrowUpRight size={16} weight="bold" />
        </button>
      </Magnetic>

      {status === "error" && (
        <p className="font-sans text-sm text-muted" role="alert">
          That didn&apos;t go through. Email directly:{" "}
          <a href={`mailto:${fallbackEmail}`} className="text-ink underline underline-offset-4">
            {fallbackEmail}
          </a>
        </p>
      )}
    </form>
  );
}
