import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCarouselProps {
  products: ShopifyProduct[];
  ariaLabel?: string;
}

/**
 * Reusable product carousel.
 * - Uses ProductCard (no duplication).
 * - Images already lazy-load via ProductCard (loading="lazy").
 * - Keyboard accessible: ← → navigate, arrows focusable, aria-labels on controls.
 */
export function ProductCarousel({ products, ariaLabel = "Carrossel de produtos" }: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (products.length === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!api) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          api.scrollNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          api.scrollPrev();
        }
      }}
      className="relative outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((p) => (
            <CarouselItem
              key={p.node.id}
              className="pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          aria-label="Produto anterior"
          className="hidden md:flex -left-4 lg:-left-6 size-10 rounded-none border-border bg-background hover:bg-primary hover:text-primary-foreground"
        />
        <CarouselNext
          aria-label="Próximo produto"
          className="hidden md:flex -right-4 lg:-right-6 size-10 rounded-none border-border bg-background hover:bg-primary hover:text-primary-foreground"
        />
      </Carousel>

      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-6" aria-hidden="true">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`h-0.5 transition-all ${
                i === selected ? "w-8 bg-primary" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
