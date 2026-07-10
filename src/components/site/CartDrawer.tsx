import { useEffect, useState } from "react";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import { fbqTrack } from "@/lib/meta-pixel";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const syncCart = useCartStore((s) => s.syncCart);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "BRL";

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

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
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Sacola" className="p-2 hover:text-primary transition relative">
          <ShoppingBag className="size-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Sua sacola</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Sua sacola está vazia"
              : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingBag className="size-10 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-muted-foreground">Adicione peças para começar.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                {items.map((item) => {
                  const img = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-20 aspect-[4/5] bg-background-soft overflow-hidden flex-shrink-0">
                        {img && (
                          <img src={img.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm leading-tight">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.selectedOptions.map((o) => o.value).join(" • ")}
                        </p>
                        <p className="text-sm text-primary font-display mt-1">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-none"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-display">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-none"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto"
                            onClick={() => removeItem(item.variantId)} aria-label="Remover">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex-shrink-0 pt-4 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-display text-base">Subtotal</span>
                  <span className="font-display text-lg text-primary">{formatPrice(totalPrice, currency)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Frete e impostos calculados no checkout.</p>
                <Button onClick={handleCheckout} disabled={isLoading || isSyncing}
                  className="w-full h-12 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide">
                  {isLoading || isSyncing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <><ExternalLink className="size-4 mr-2" /> Finalizar Compra</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
