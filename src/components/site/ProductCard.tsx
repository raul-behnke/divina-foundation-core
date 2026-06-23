import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { formatBRL } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link to="/produto/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-background-soft">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-background text-foreground text-[10px] tracking-widest uppercase px-2.5 py-1 font-display">
              Novo
            </span>
          )}
          {product.isPlus && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2.5 py-1 font-display">
              Plus
            </span>
          )}
          <button
            aria-label="Favoritar"
            onClick={(e) => { e.preventDefault(); toast.success("Adicionado aos favoritos"); }}
            className="absolute bottom-3 right-3 bg-background/90 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition hover:text-primary"
          >
            <Heart className="size-4" />
          </button>
        </div>
        <div className="pt-4 pb-2">
          <h3 className="text-sm md:text-base font-normal font-sans text-foreground leading-snug">{product.name}</h3>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm md:text-base text-primary font-display">{formatBRL(product.price)}</span>
            <span className="text-xs text-muted-foreground">
              ou {product.installments}x de {formatBRL(product.price / product.installments)}
            </span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3.5 rounded-full border border-border"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
