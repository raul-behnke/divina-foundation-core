import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt: string };

const SLIDES: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80",
    alt: "Modelo com look de alfaiataria feminina em editorial de moda",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80",
    alt: "Mulher elegante com vestido contemporâneo em cenário minimalista",
  },
  {
    src: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=2000&q=80",
    alt: "Editorial de moda feminina premium com luz natural",
  },
];

const AUTOPLAY_MS = 5000;

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;
  const goTo = useCallback((i: number) => setIndex((i + total) % total), [total]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, total]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };

  return (
    <section
      ref={regionRef}
      aria-label="Carrossel de destaques"
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      className="relative w-full overflow-hidden bg-background-soft outline-none h-[60vh] md:h-[80vh]"
    >
      <div
        aria-live="polite"
        className="relative h-full w-full"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-10 md:size-12 bg-white/80 hover:bg-white text-foreground transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="size-5 md:size-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-10 md:size-12 bg-white/80 hover:bg-white text-foreground transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="size-5 md:size-6" />
      </button>

      <div className="absolute bottom-5 md:bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
