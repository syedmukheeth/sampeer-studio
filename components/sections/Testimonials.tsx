import Image from "next/image";
import { TESTIMONIAL } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";

export function Testimonials() {
  return (
    <Section id="testimonials" size="flush">
      <figure className="grid items-center gap-12 border-t border-line py-16 md:grid-cols-12 md:gap-14 md:py-24">
        <blockquote className="md:col-span-7">
          <span aria-hidden className="block font-display text-7xl leading-none text-accent-text">
            &ldquo;
          </span>
          <p className="-mt-4 font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
            {TESTIMONIAL.quote}
          </p>
          <figcaption className="mt-6 font-sans text-sm">
            <span className="block text-ink">{TESTIMONIAL.name}</span>
            <span className="mt-0.5 block text-muted">{TESTIMONIAL.role}</span>
          </figcaption>
        </blockquote>

        <FadeIn className="relative mx-auto w-full max-w-md pb-10 pl-10 md:col-span-5 md:max-w-none">
          <div className="relative aspect-[1072/1200] overflow-hidden rounded-lg border border-line bg-elevated">
            <Image
              src={TESTIMONIAL.photo}
              alt={TESTIMONIAL.photoAlt}
              fill
              sizes="(min-width: 768px) 38vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 aspect-4/5 w-[38%] overflow-hidden rounded-lg border-4 border-canvas bg-elevated shadow-xl">
            <Image
              src={TESTIMONIAL.photoSecondary}
              alt={TESTIMONIAL.photoSecondaryAlt}
              fill
              sizes="(min-width: 768px) 15vw, 35vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
      </figure>
    </Section>
  );
}
