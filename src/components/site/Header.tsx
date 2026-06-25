import { Link } from "@tanstack/react-router";
import { Heart, Search, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CartDrawer } from "@/components/site/CartDrawer";


const LOGO = "https://divinamulher.com.br/wp-content/uploads/2025/07/logoDivinaMulher.webp";

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

export function Header() {
  const [open, setOpen] = useState(false);
  const handle = () => toast.success("Funcionalidade em breve");

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="container-dm flex items-center justify-between h-16 md:h-20 gap-4">
        <button
          aria-label="Abrir menu"
          className="lg:hidden p-2 -ml-2 text-foreground"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-6" />
        </button>

        <Link to="/" className="shrink-0">
          <img src={LOGO} alt="Divina Mulher" className="h-9 md:h-11 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Principal">
          {NAV.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                to={item.to}
                className="text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors py-6"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-background border border-border shadow-soft min-w-[200px] py-3">
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
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <button aria-label="Buscar" onClick={handle} className="p-2 hover:text-primary transition">
            <Search className="size-5" />
          </button>
          <button aria-label="Favoritos" onClick={handle} className="hidden md:inline-flex p-2 hover:text-primary transition">
            <Heart className="size-5" />
          </button>
          <button aria-label="Conta" onClick={handle} className="hidden md:inline-flex p-2 hover:text-primary transition">
            <User className="size-5" />
          </button>
          <CartDrawer />
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <img src={LOGO} alt="Divina Mulher" className="h-8" />
              <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="p-2">
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-1">
              {NAV.map((item) => (
                <div key={item.label} className="py-2">
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block text-base font-medium text-foreground py-2"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-3 mt-1 space-y-1 border-l border-border">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          to={c.to}
                          onClick={() => setOpen(false)}
                          className="block text-sm text-muted-foreground py-1.5"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
