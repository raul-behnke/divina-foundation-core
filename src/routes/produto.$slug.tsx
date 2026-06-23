import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { SizeGuideTable } from "@/components/site/SizeGuideTable";
import { getProduct, products, formatBRL } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Truck, RefreshCw, ShieldCheck, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }): { product: import("@/data/products").Product } => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} | Divina Mulher` : "Produto | Divina Mulher";
    return {
      meta: [
        { title },
        { name: "description", content: p?.description ?? "" },
        { property: "og:title", content: title },
        { property: "og:url", content: `/produto/${p?.slug ?? ""}` },
        ...(p?.images[0] ? [{ property: "og:image", content: p.images[0] }] : []),
        { property: "og:type", content: "product" },
      ],
      links: p ? [{ rel: "canonical", href: `/produto/${p.slug}` }] : [],
    };
  },
  component: ProdutoPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-dm py-24 text-center">
        <h1 className="font-display text-3xl">Produto não encontrado</h1>
        <Link to="/" className="text-primary mt-4 inline-block">Voltar à home</Link>
      </div>
    </SiteLayout>
  ),
});

function ProdutoPage() {
  const { product } = Route.useLoaderData();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const buy = () => {
    if (!size) { toast.error("Selecione um tamanho"); return; }
    toast.success("Produto adicionado à sacola");
  };

  return (
    <SiteLayout>
      <nav aria-label="Migalhas" className="container-dm pt-6 md:pt-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <Link to="/colecao/$slug" params={{ slug: product.category }} className="hover:text-primary capitalize">{product.category}</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <section className="container-dm grid lg:grid-cols-2 gap-8 lg:gap-14 pt-6 md:pt-10 pb-12 md:pb-20">
        {/* Gallery */}
        <div className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr] gap-3 md:gap-4">
          <div className="flex flex-col gap-2 md:gap-3 order-2 md:order-1">
            {product.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)}
                className={`aspect-[4/5] overflow-hidden border-2 ${img === i ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 md:order-2 aspect-[4/5] overflow-hidden bg-background-soft">
            <img src={product.images[img]} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="lg:pt-4">
          {product.isNew && <span className="inline-block bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2.5 py-1 font-display mb-4">Novo</span>}
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-primary text-primary" strokeWidth={0} />
              ))}
            </div>
            <span>(24 avaliações)</span>
          </div>

          <div className="mt-6">
            <p className="font-display text-3xl text-primary">{formatBRL(product.price)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              ou em até {product.installments}x de {formatBRL(product.price / product.installments)} sem juros
            </p>
          </div>

          {/* Color */}
          <div className="mt-8">
            <p className="text-sm font-display mb-3">Cor: <span className="text-muted-foreground font-sans">{color.name}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c)} title={c.name} aria-pressed={color.name === c.name}
                  className={`size-10 rounded-full border-2 transition ${color.name === c.name ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
                  style={{ background: c.hex }} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-display">Tamanho</p>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs text-primary underline underline-offset-4 hover:no-underline">Guia de medidas</button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Guia de Medidas</DialogTitle>
                  </DialogHeader>
                  <SizeGuideTable />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} aria-pressed={size === s}
                  className={`min-w-12 h-12 px-4 text-sm font-display border transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border border-border h-12">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-full grid place-items-center hover:bg-background-soft" aria-label="Diminuir">
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-display">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-12 h-full grid place-items-center hover:bg-background-soft" aria-label="Aumentar">
                <Plus className="size-4" />
              </button>
            </div>
            <button onClick={() => toast.success("Adicionado aos favoritos")} aria-label="Favoritar" className="size-12 grid place-items-center border border-border hover:border-primary hover:text-primary">
              <Heart className="size-5" />
            </button>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <Button onClick={buy} size="lg" className="h-12 rounded-none bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-display tracking-wide">
              Adicionar à Sacola
            </Button>
            <Button onClick={buy} size="lg" variant="outline" className="h-12 rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background font-display tracking-wide">
              Comprar Agora
            </Button>
          </div>

          {/* Mini benefits */}
          <ul className="mt-8 grid grid-cols-3 gap-2 text-xs md:text-sm">
            <li className="flex flex-col items-center text-center gap-1.5"><Truck className="size-5 text-primary" strokeWidth={1.5} /> Envio rápido</li>
            <li className="flex flex-col items-center text-center gap-1.5"><RefreshCw className="size-5 text-primary" strokeWidth={1.5} /> Troca facilitada</li>
            <li className="flex flex-col items-center text-center gap-1.5"><ShieldCheck className="size-5 text-primary" strokeWidth={1.5} /> Pagamento seguro</li>
          </ul>

          {/* Accordions */}
          <Accordion type="single" collapsible className="mt-10 border-t border-border">
            <AccordionItem value="desc">
              <AccordionTrigger className="font-display">Descrição</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="comp">
              <AccordionTrigger className="font-display">Composição</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{product.composition}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="font-display">Cuidados</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{product.care}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
              <AccordionTrigger className="font-display">Guia de Medidas</AccordionTrigger>
              <AccordionContent><SizeGuideTable /></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-dm py-12 md:py-20 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl mb-8 md:mb-10">Você também pode gostar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Avaliações */}
      <section className="container-dm py-12 md:py-20 border-t border-border">
        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">Avaliações</h2>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-5 fill-primary text-primary" strokeWidth={0} />)}
              </div>
              <p className="font-display text-lg">5,0</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Baseado em 24 avaliações</p>
            <Button onClick={() => toast.success("Em breve")} className="mt-6 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground rounded-none font-display tracking-wide">
              Avaliar produto
            </Button>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-border md:pl-10 pt-8 md:pt-0">
            <p className="text-muted-foreground">Seja a primeira a deixar uma avaliação detalhada deste produto.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
