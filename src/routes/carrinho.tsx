import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import { fbqTrack } from "@/lib/meta-pixel";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Sua sacola | Divina Mulher" },
      { name: "description", content: "Revise as peças da sua sacola antes de finalizar a compra." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "BRL";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      fbqTrack("InitiateCheckout", {
        num_items: totalItems,
        value: totalPrice,
        currency,
        contents: items.map((i) => ({ id: i.variantId, quantity: i.quantity })),
        content_ids: items.map((i) => i.variantId),
      });
      window.open(url, "_blank");
    }
  };

  return (
    <SiteLayout>
      <section className="container-dm py-10 md:py-16">
        <header className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display">Sacola</p>
          <h1 className="font-display text-3xl md:text-4xl mt-2">Sua sacola</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems === 0 ? "Sua sacola está vazia." : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="border border-border py-20 flex flex-col items-center text-center">
            <ShoppingBag className="size-10 text-muted-foreground mb-4" strokeWidth={1.5} />
            <p className="text-muted-foreground mb-6">Sua sacola está esperando peças especiais.</p>
            <Button
              onClick={() => navigate({ to: "/" })}
              className="bg-primary text-primary-foreground rounded-none h-12 px-8 font-display tracking-wide"
            >
              Continuar comprando
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => {
                const img = item.product.node.images?.edges?.[0]?.node;
                return (
                  <li key={item.variantId} className="py-6 flex gap-4 md:gap-6">
                    <Link
                      to="/produto/$slug"
                      params={{ slug: item.product.node.handle }}
                      className="block w-24 md:w-32 aspect-[4/5] bg-background-soft overflow-hidden flex-shrink-0"
                    >
                      {img && <img src={img.url} alt={item.product.node.title} className="w-full h-full object-cover" />}
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link
                            to="/produto/$slug"
                            params={{ slug: item.product.node.handle }}
                            className="font-display text-base md:text-lg hover:text-primary"
                          >
                            {item.product.node.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(" • ")}
                          </p>
                        </div>
                        <button
                          aria-label="Remover item"
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto pt-4 flex items-end justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            aria-label="Diminuir"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-display">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label="Aumentar"
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <p className="font-display text-primary">
                          {formatPrice(parseFloat(item.price.amount) * item.quantity, item.price.currencyCode)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="bg-background-soft p-6 h-fit lg:sticky lg:top-28">
              <h2 className="font-display text-xl mb-4">Resumo</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-display">{formatPrice(totalPrice, currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Frete</dt>
                  <dd className="text-muted-foreground">Calculado no checkout</dd>
                </div>
              </dl>
              <div className="flex justify-between mt-4 pt-4 border-t border-border">
                <span className="font-display text-base">Total</span>
                <span className="font-display text-xl text-primary">{formatPrice(totalPrice, currency)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
                className="w-full h-12 mt-6 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide"
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="size-4 mr-2" /> Finalizar Compra
                  </>
                )}
              </Button>
              <Link
                to="/"
                className="block text-center text-sm text-muted-foreground hover:text-primary mt-4"
              >
                ou continuar comprando
              </Link>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
