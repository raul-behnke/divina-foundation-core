import { Quote } from "lucide-react";

export interface Testimonial { name: string; city: string; text: string; }

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="bg-background border border-border p-7 md:p-9 h-full flex flex-col">
      <Quote className="size-7 text-primary mb-4" strokeWidth={1.25} />
      <blockquote className="text-base md:text-lg text-foreground font-display leading-relaxed flex-1">
        “{t.text}”
      </blockquote>
      <figcaption className="mt-6 pt-5 border-t border-border">
        <p className="text-sm font-medium text-foreground">{t.name}</p>
        <p className="text-xs text-muted-foreground">{t.city}</p>
      </figcaption>
    </figure>
  );
}
