import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/shopify";
import { getProductColors, getProductImages, isProductNew, isProductPlus } from "@/data/products";
import { useWishlistStore } from "@/stores/wishlistStore";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const images = getProductImages(product);
  const colors = getProductColors(product);
  const price = product.node.priceRange.minVariantPrice;
  const isNew = isProductNew(product);
  const isPlus = isProductPlus(product);
  const installments = 5;
  const priceNum = parseFloat(price.amount);

  return (
    <article className="group">
      <Link to="/produto/$slug" params={{ slug: product.node.handle }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-background-soft">
          {images[0] ? (
            <img src={images[0]} alt={product.node.title} loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              Sem imagem
            </div>
          )}
          {images[1] && (
            <img src={images[1]} alt="" aria-hidden="true" loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          {isNew && (
            <span className="absolute top-3 left-3 bg-background text-foreground text-[10px] tracking-widest uppercase px-2.5 py-1 font-display">
              Novo
            </span>
          )}
          {isPlus && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2.5 py-1 font-display">
              Plus
            </span>
          )}
          <button aria-label="Favoritar"
            onClick={(e) => { e.preventDefault(); toast.success("Adicionado aos favoritos"); }}
            className="absolute bottom-3 right-3 bg-background/90 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition hover:text-primary">
            <Heart className="size-4" />
          </button>
        </div>
        <div className="pt-4 pb-2">
          <h3 className="text-sm md:text-base font-normal font-sans text-foreground leading-snug">
            {product.node.title}
          </h3>
          <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
            <span className="text-sm md:text-base text-primary font-display">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            <span className="text-xs text-muted-foreground">
              ou {installments}x de {formatPrice(priceNum / installments, price.currencyCode)}
            </span>
          </div>
          {colors.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {colors.slice(0, 4).map((c) => (
                <span key={c.name} title={c.name}
                  className="size-3.5 rounded-full border border-border"
                  style={{ background: c.hex }} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
