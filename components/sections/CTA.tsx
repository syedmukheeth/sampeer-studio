import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CTA as C } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { Section } from "@/components/ui/Section";

/** §08 Dead-simple CTA. One input, one button. Single CTA intent page-wide. */
export function CTA() {
  return (
    <Section id="contact" size="lg">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tighter md:text-6xl">
          {C.heading}
        </h2>
        <p className="mt-5 font-sans text-base text-muted md:text-lg">{C.sub}</p>

        <form
          action={C.action}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="email" className="sr-only">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={C.placeholder}
            className="h-12 flex-1 rounded-md border border-line bg-elevated px-4 font-sans text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <TrackClick event={EVENTS.ctaSubmit}>
            <Magnetic strength={0.3}>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md bg-accent px-6 font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98]"
              >
                {C.button}
                <ArrowUpRight size={16} weight="bold" />
              </button>
            </Magnetic>
          </TrackClick>
        </form>
      </div>
    </Section>
  );
}
