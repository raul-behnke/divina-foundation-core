import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeBanners, type HomeBanner } from "@/lib/shopify";

type Slide = {
  src: string;
  alt: string;
  headline?: string | null;
  subheadline?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

const FALLBACK_SLIDES: Slide[] = [
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

function toSlide(b: HomeBanner): Slide {
  return {
    src: b.image,
    alt: b.alt,
    headline: b.headline,
    subheadline: b.subheadline,
    ctaLabel: b.ctaLabel,
    ctaUrl: b.ctaUrl,
  };
}

export function HeroBanner() {
  const { data: banners } = useQuery({
    queryKey: ["home-banners"],
    queryFn: fetchHomeBanners,
    staleTime: 60_000,
  });

  const slides: Slide[] = banners && banners.length > 0 ? banners.map(toSlide) : FALLBACK_SLIDES;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  // Clamp index if the slide list shrinks after banners load
  useEffect(() => {
    if (index >= total) setIndex(0);
  }, [total, index]);

  const goTo = useCallback((i: number) => setIndex((i + total) % total), [total]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused || total <= 1) return;
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
      <div aria-live="polite" className="relative h-full w-full">
        {slides.map((slide, i) => (
          <div
            key={`${slide.src}-${i}`}
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

            {(slide.headline || slide.subheadline || slide.ctaLabel) && (
              <div className="absolute inset-0 flex items-end md:items-center">
                <div className="container-dm pb-16 md:pb-0">
                  <div className="max-w-xl text-white">
                    {slide.headline && (
                      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] drop-shadow-md">
                        {slide.headline}
                      </h2>
                    )}
                    {slide.subheadline && (
                      <p className="mt-3 md:mt-4 text-sm md:text-lg opacity-95 drop-shadow max-w-md">
                        {slide.subheadline}
                      </p>
                    )}
                    {slide.ctaLabel && slide.ctaUrl && (
                      <a
                        href={slide.ctaUrl}
                        className="inline-block mt-5 md:mt-8 bg-white text-foreground hover:bg-white/90 transition-colors px-6 md:px-8 h-11 md:h-12 leading-[44px] md:leading-[48px] font-display tracking-wide text-sm"
                      >
                        {slide.ctaLabel}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
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
            {slides.map((_, i) => (
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
        </>
      )}
    </section>
  );
}
