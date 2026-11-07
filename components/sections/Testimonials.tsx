import Image from "next/image";
import { TESTIMONIAL } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function Testimonials() {
  return (
    <Section id="testimonials" size="flush">
      <figure className="grid items-center gap-10 border-t border-line py-16 md:grid-cols-12 md:gap-14 md:py-20">
        <blockquote className="md:col-span-7">
          <p className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </p>
          <figcaption className="mt-6 font-sans text-sm">
            <span className="block text-ink">{TESTIMONIAL.name}</span>
            <span className="mt-0.5 block text-muted">{TESTIMONIAL.role}</span>
          </figcaption>
        </blockquote>

        <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-line bg-elevated md:col-span-5">
          <Image
            src={TESTIMONIAL.photo}
            alt={`${TESTIMONIAL.name} with the SAMPeer Studio team`}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </figure>
    </Section>
  );
}
