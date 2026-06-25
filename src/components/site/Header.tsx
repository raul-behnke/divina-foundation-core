import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Search, Menu, X, User, ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/shopify";

import logoAsset from "@/assets/logo-divina.png.asset.json";
const LOGO = logoAsset.url;

const NAV = [
  { label: "Novidades", to: "/colecao/novidades" },
  {
    label: "Vestidos",
    to: "/colecao/vestidos",
    children: [
      { label: "Midi", to: "/colecao/vestidos" },
      { label: "Longo", to: "/colecao/vestidos" },
      { label: "Curto", to: "/colecao/vestidos" },
      { label: "Chemise", to: "/colecao/vestidos" },
    ],
  },
  {
    label: "Alfaiataria",
    to: "/colecao/alfaiataria",
    children: [
      { label: "Blazers", to: "/colecao/alfaiataria" },
      { label: "Calças de alfaiataria", to: "/colecao/alfaiataria" },
      { label: "Conjuntos", to: "/colecao/alfaiataria" },
      { label: "Bermudas & Shorts", to: "/colecao/alfaiataria" },
    ],
  },
  {
    label: "Blusas & Camisas",
    to: "/colecao/blusas",
    children: [
      { label: "Blusas", to: "/colecao/blusas" },
      { label: "Camisas", to: "/colecao/blusas" },
      { label: "Regatas", to: "/colecao/blusas" },
    ],
  },
  {
    label: "Plus Size",
    to: "/colecao/plus",
    children: [
      { label: "Vestidos Plus", to: "/colecao/plus" },
      { label: "Blusas Plus", to: "/colecao/plus" },
      { label: "Calças Plus", to: "/colecao/plus" },
      { label: "Conjuntos Plus", to: "/colecao/plus" },
    ],
  },
  { label: "Sobre a Marca", to: "/sobre" },
];

const ICON_BTN =
  "p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSoon = () => toast.success("Funcionalidade em breve");

  // sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // focus search on open + ESC to close
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [searchOpen]);

  const totalItems = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  return (
    <header
      className={`sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border transition-shadow ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      {/* TOP ROW — 3 zones */}
      <div className="container-dm grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20 gap-4">
        {/* LEFT — empty on desktop, hamburger on mobile */}
        <div className="flex items-center justify-start">
          <button
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className={`${ICON_BTN} lg:hidden -ml-2`}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* CENTER — logo */}
        <Link to="/" aria-label="Divina Mulher — Início" className="shrink-0 justify-self-center">
          <img src={LOGO} alt="Divina Mulher" className="h-9 md:h-12 w-auto" />
        </Link>

        {/* RIGHT — 4 icons */}
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <button
            aria-label={searchOpen ? "Fechar busca" : "Buscar"}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => setSearchOpen((v) => !v)}
            className={ICON_BTN}
          >
            <Search className="size-5" strokeWidth={1.5} />
          </button>
          <button aria-label="Lista de desejos" onClick={handleSoon} className={ICON_BTN}>
            <Heart className="size-5" strokeWidth={1.5} />
          </button>
          <button aria-label="Minha conta" onClick={handleSoon} className={ICON_BTN}>
            <User className="size-5" strokeWidth={1.5} />
          </button>
          <button
            aria-label={`Sacola${totalItems ? `, ${totalItems} ${totalItems === 1 ? "item" : "itens"}` : ""}`}
            onClick={() => setCartOpen(true)}
            className={`${ICON_BTN} relative`}
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            {totalItems > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Desktop secondary nav row */}
      <nav
        className="hidden lg:block border-t border-border/60"
        aria-label="Principal"
      >
        <div className="container-dm flex items-center justify-center gap-8 h-11">
          {NAV.map((item) => (
            <div key={item.label} className="relative group h-full flex items-center">
              <Link
                to={item.to}
                className="text-[13px] font-medium tracking-[0.08em] uppercase text-foreground hover:text-primary transition-colors"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all">
                  <div className="bg-background border border-border shadow-soft min-w-[220px] py-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.to}
                        className="block px-5 py-2 text-sm text-foreground hover:bg-background-soft hover:text-primary transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Expanding search bar */}
      {searchOpen && (
        <div
          id="site-search"
          className="border-t border-border bg-background animate-in fade-in slide-in-from-top-2 duration-200"
          role="search"
        >
          <div className="container-dm py-4 flex items-center gap-3">
            <Search className="size-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Buscar produtos, coleções, tamanhos…"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  toast.success("Busca em breve");
                  setSearchOpen(false);
                }
              }}
            />
            <button
              aria-label="Fechar busca"
              onClick={() => setSearchOpen(false)}
              className={ICON_BTN}
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu drawer — Sheet uses a portal so it escapes the header's backdrop-filter containing block */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-[85%] max-w-sm p-0 flex flex-col bg-background lg:hidden"
        >
          <SheetHeader className="p-5 border-b border-border flex-row items-center justify-between space-y-0">
            <img src={LOGO} alt="Divina Mulher" className="h-8" />
            <SheetTitle className="sr-only">Menu principal</SheetTitle>
            <SheetDescription className="sr-only">Navegação por categorias</SheetDescription>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto p-5" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.label} className="py-1.5 border-b border-border/40 last:border-0">
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-display tracking-wide text-foreground py-2.5"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-3 pb-2 space-y-0.5 border-l border-border">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.to}
                        onClick={() => setMenuOpen(false)}
                        className="block text-sm text-muted-foreground py-1.5 hover:text-primary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart side drawer (controlled here so right-icon button opens it) */}
      <CartSideDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

function CartSideDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
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
      window.open(url, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Sua sacola</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Sua sacola está vazia" : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
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
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-none"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-display">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-none"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto"
                            onClick={() => removeItem(item.variantId)}
                            aria-label="Remover item"
                          >
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
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing}
                  className="w-full h-12 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="size-4 mr-2" /> Finalizar Compra
                    </>
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
