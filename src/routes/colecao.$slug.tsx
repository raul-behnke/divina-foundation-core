import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import {
  COLLECTION_QUERIES,
  getProductColors,
  getProductPrice,
  getProductSizes,
  isProductNew,
} from "@/data/products";
import { ChevronDown, SlidersHorizontal, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/colecao/$slug")({
  loader: ({ params }) => {
    const cfg = COLLECTION_QUERIES[params.slug];
    if (!cfg) throw notFound();
    return { slug: params.slug, cfg };
  },
  head: ({ params }) => {
    const cfg = COLLECTION_QUERIES[params.slug];
    const title = cfg ? `${cfg.title} | Divina Mulher` : "Coleção | Divina Mulher";
    return {
      meta: [
        { title },
        { name: "description", content: cfg?.description ?? "Coleção Divina Mulher" },
        { property: "og:title", content: title },
        { property: "og:url", content: `/colecao/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/colecao/${params.slug}` }],
    };
  },
  component: ColecaoPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-dm py-24 text-center">
        <h1 className="font-display text-3xl">Coleção não encontrada</h1>
        <Link to="/" className="text-primary mt-4 inline-block">Voltar à home</Link>
      </div>
    </SiteLayout>
  ),
});

const SORTS = [
  { id: "relevance", label: "Relevância" },
  { id: "price-asc", label: "Menor preço" },
  { id: "price-desc", label: "Maior preço" },
  { id: "new", label: "Novidades" },
];

const COLOR_SWATCHES = [
  { name: "Preto", hex: "#171717" },
  { name: "Vinho", hex: "#7E2145" },
  { name: "Off-white", hex: "#F2EFE9" },
  { name: "Rosé", hex: "#E296B0" },
  { name: "Marinho", hex: "#1E2A44" },
  { name: "Caramelo", hex: "#A86B3C" },
];
const SIZE_CHIPS = ["PP", "P", "M", "G", "GG", "G1", "G2", "G3"];

function ColecaoPage() {
  const { cfg, slug } = Route.useLoaderData();
  const [sort, setSort] = useState("relevance");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [drawer, setDrawer] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", slug, cfg.query ?? null],
    queryFn: () => fetchProducts(cfg.query),
  });

  const filtered = useMemo(() => {
    let r: ShopifyProduct[] = [...products];
    if (slug === "novidades") r = r.filter(isProductNew).length > 0 ? r.filter(isProductNew) : r;
    if (colors.length) {
      r = r.filter((p) => getProductColors(p).some((c) => colors.some((sel) => sel.toLowerCase() === c.name.toLowerCase())));
    }
    if (sizes.length) {
      r = r.filter((p) => getProductSizes(p).some((s) => sizes.includes(s.toUpperCase())));
    }
    if (sort === "price-asc") r = [...r].sort((a, b) => getProductPrice(a) - getProductPrice(b));
    if (sort === "price-desc") r = [...r].sort((a, b) => getProductPrice(b) - getProductPrice(a));
    if (sort === "new") r = [...r].sort((a, b) => Number(isProductNew(b)) - Number(isProductNew(a)));
    return r;
  }, [products, slug, colors, sizes, sort]);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <SiteLayout>
      <nav aria-label="Migalhas" className="container-dm pt-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <span className="text-foreground">{cfg.title}</span>
      </nav>

      <header className="container-dm pt-6 pb-10 md:pt-10 md:pb-14 max-w-3xl">
        <h1 className="font-display text-3xl md:text-5xl leading-tight">{cfg.title}</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{cfg.description}</p>
      </header>

      <div className="container-dm flex items-center justify-between gap-4 pb-6 border-b border-border">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Carregando..." : `${filtered.length} produto${filtered.length === 1 ? "" : "s"}`}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => setDrawer(true)} className="lg:hidden inline-flex items-center gap-2 text-sm font-display tracking-wide border border-border px-4 h-10">
            <SlidersHorizontal className="size-4" /> Filtrar
          </button>
          <label className="relative inline-flex items-center">
            <span className="sr-only">Ordenar</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none bg-transparent border border-border px-4 pr-9 h-10 text-sm font-display tracking-wide focus:outline-none focus:border-primary">
              {SORTS.map((s) => <option key={s.id} value={s.id}>Ordenar: {s.label}</option>)}
            </select>
            <ChevronDown className="size-4 absolute right-3 pointer-events-none" />
          </label>
        </div>
      </div>

      <section className="container-dm grid lg:grid-cols-[260px_1fr] gap-10 py-10 md:py-14">
        <aside className="hidden lg:block">
          <FilterContent
            colors={colors} sizes={sizes}
            toggleColor={(v) => toggle(colors, v, setColors)}
            toggleSize={(v) => toggle(sizes, v, setSizes)}
            clear={() => { setColors([]); setSizes([]); }}
          />
        </aside>

        <div>
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border">
              <p className="font-display text-lg text-foreground">Nenhum produto encontrado</p>
              <p className="text-sm text-muted-foreground mt-2">Cadastre produtos na Shopify para vê-los nesta coleção.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6">
              {filtered.map((p) => <ProductCard key={p.node.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-background flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <p className="font-display text-lg">Filtros</p>
              <button onClick={() => setDrawer(false)} aria-label="Fechar"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent
                colors={colors} sizes={sizes}
                toggleColor={(v) => toggle(colors, v, setColors)}
                toggleSize={(v) => toggle(sizes, v, setSizes)}
                clear={() => { setColors([]); setSizes([]); }}
              />
            </div>
            <div className="p-5 border-t border-border">
              <button onClick={() => setDrawer(false)} className="w-full h-12 bg-primary text-primary-foreground font-display tracking-wide">
                Ver {filtered.length} produtos
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

function FilterContent({
  colors, sizes, toggleColor, toggleSize, clear,
}: {
  colors: string[]; sizes: string[];
  toggleColor: (v: string) => void; toggleSize: (v: string) => void; clear: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-sm tracking-wider uppercase">Filtros</p>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-primary">Limpar</button>
      </div>
      <div>
        <p className="font-display text-sm mb-3">Cor</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => {
            const on = colors.includes(c.name);
            return (
              <button key={c.name} onClick={() => toggleColor(c.name)} title={c.name} aria-pressed={on}
                className={`size-8 rounded-full border-2 transition ${on ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
                style={{ background: c.hex }} />
            );
          })}
        </div>
      </div>
      <div>
        <p className="font-display text-sm mb-3">Tamanho</p>
        <div className="flex flex-wrap gap-2">
          {SIZE_CHIPS.map((s) => {
            const on = sizes.includes(s);
            return (
              <button key={s} onClick={() => toggleSize(s)} aria-pressed={on}
                className={`min-w-10 h-10 px-3 text-sm font-display border transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
