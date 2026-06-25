import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/busca")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Buscar | Divina Mulher" },
      { name: "description", content: "Encontre vestidos, alfaiataria, plus size e novidades Divina Mulher." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: BuscaPage,
});

function BuscaPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    setInput(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchProducts(q.trim(), 60)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: input.trim() } });
  };

  const totalLabel = useMemo(() => {
    if (!q) return null;
    if (loading) return "Buscando…";
    return `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para "${q}"`;
  }, [q, results.length, loading]);

  return (
    <SiteLayout>
      <section className="container-dm py-10 md:py-16">
        <p className="text-xs tracking-[0.25em] uppercase text-primary font-display">Busca</p>
        <h1 className="font-display text-3xl md:text-4xl mt-2 mb-6">O que você procura hoje?</h1>

        <form onSubmit={onSubmit} className="flex items-center border-b border-foreground pb-3 max-w-2xl">
          <SearchIcon className="size-5 text-muted-foreground mr-3" strokeWidth={1.5} />
          <input
            type="search"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Buscar vestidos, alfaiataria, plus…"
            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
          />
          <button type="submit" className="font-display text-sm tracking-wide text-primary hover:opacity-80 ml-3">
            Buscar
          </button>
        </form>

        {totalLabel && <p className="mt-6 text-sm text-muted-foreground">{totalLabel}</p>}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 mt-8">
            {results.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        ) : q ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Nada encontrado para "<span className="text-foreground">{q}</span>". Tente outro termo.
            </p>
          </div>
        ) : (
          <div className="py-20 text-center text-sm text-muted-foreground">
            Digite acima e pressione Enter para buscar.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
