import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/shopify";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos | Divina Mulher" },
      { name: "description", content: "Suas peças favoritas Divina Mulher salvas em um só lugar." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);

  return (
    <SiteLayout>
      <section className="container-dm py-10 md:py-16">
        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display">Lista de Desejos</p>
            <h1 className="font-display text-3xl md:text-4xl mt-2">Seus favoritos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length === 0
                ? "Você ainda não favoritou nenhuma peça."
                : `${items.length} ${items.length === 1 ? "peça" : "peças"} salvas`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
            >
              Limpar tudo
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="border border-border py-20 flex flex-col items-center text-center">
            <Heart className="size-10 text-muted-foreground mb-4" strokeWidth={1.5} />
            <p className="text-muted-foreground mb-6">Toque no coração nas peças para salvar aqui.</p>
            <Button asChild className="bg-primary text-primary-foreground rounded-none h-12 px-8 font-display tracking-wide">
              <Link to="/">Explorar coleção</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {items.map((item) => (
              <article key={item.id} className="group">
                <Link to="/produto/$slug" params={{ slug: item.handle }} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-background-soft">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    <button
                      aria-label="Remover dos favoritos"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(item.id);
                      }}
                      className="absolute top-3 right-3 bg-background/90 backdrop-blur p-2 hover:text-primary"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-sm md:text-base text-foreground leading-snug">{item.title}</h3>
                    <p className="text-sm text-primary font-display mt-1.5">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
