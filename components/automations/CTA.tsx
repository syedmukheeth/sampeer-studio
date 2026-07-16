import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { A_CTA } from "@/lib/content-automations";
import { Magnetic } from "@/components/ui/Magnetic";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { Section } from "@/components/ui/Section";

/** §A7 The one ask on this page. Deliberately a near-copy of sections/CTA
 *  rather than a shared prop-driven component: that one is the site's single
 *  CTA intent ("tell me about your startup"), this one sells a specific
 *  30-minute audit and tracks its own event. Merging them would mean a
 *  component whose every field is a prop — a template, not an abstraction. */
export function CTA() {
  return (
    <Section id="audit" size="lg">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
          {A_CTA.heading}
        </h2>
        <p className="mt-5 font-sans text-base text-muted md:text-lg">
          {A_CTA.sub}
        </p>

        <form
          action={A_CTA.action}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="audit-email" className="sr-only">
            Your email
          </label>
          <input
            id="audit-email"
            name="email"
            type="email"
            required
            placeholder={A_CTA.placeholder}
            className="h-12 flex-1 rounded-md border border-line bg-elevated px-4 font-sans text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <TrackClick event={EVENTS.auditSubmit}>
            <Magnetic strength={0.3}>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md bg-accent px-6 font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98]"
              >
                {A_CTA.button}
                <ArrowUpRight size={16} weight="bold" />
              </button>
            </Magnetic>
          </TrackClick>
        </form>
      </div>
    </Section>
  );
}
