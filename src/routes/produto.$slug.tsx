import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { SizeGuideTable } from "@/components/site/SizeGuideTable";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Truck, RefreshCw, ShieldCheck, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchProductByHandle, fetchProducts, fetchVariantsStock, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import {
  colorHex,
  getProductColors,
  getProductImages,
  getProductSizes,
  isProductNew,
} from "@/data/products";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductByHandle(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product?.node;
    const title = p ? `${p.title} | Divina Mulher` : "Produto | Divina Mulher";
    const image = p?.images?.edges?.[0]?.node?.url;
    return {
      meta: [
        { title },
        { name: "description", content: p?.description ?? "" },
        { property: "og:title", content: title },
        { property: "og:url", content: `/produto/${p?.handle ?? ""}` },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { property: "og:type", content: "product" },
      ],
      links: p ? [{ rel: "canonical", href: `/produto/${p.handle}` }] : [],
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
  errorComponent: () => (
    <SiteLayout>
      <div className="container-dm py-24 text-center">
        <h1 className="font-display text-3xl">Erro ao carregar produto</h1>
        <Link to="/" className="text-primary mt-4 inline-block">Voltar à home</Link>
      </div>
    </SiteLayout>
  ),
});

function ProdutoPage() {
  const { product } = Route.useLoaderData() as { product: ShopifyProduct };
  const node = product.node;
  const images = getProductImages(product);
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);
  const price = node.priceRange.minVariantPrice;
  const installments = 5;
  const priceNum = parseFloat(price.amount);

  const [img, setImg] = useState(0);
  const [color, setColor] = useState(colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  // pick the matching variant based on selected options
  const selectedVariant = useMemo(() => {
    const variants = node.variants.edges.map((e) => e.node);
    return (
      variants.find((v) => {
        const matchColor = !color || v.selectedOptions.some((o) => /cor|color/i.test(o.name) && o.value === color);
        const matchSize = !size || v.selectedOptions.some((o) => /tama|size/i.test(o.name) && o.value === size);
        return matchColor && matchSize;
      }) ?? variants[0]
    );
  }, [node, color, size]);

  // Real-time stock per variant (refetch on focus to stay fresh)
  const variantIds = useMemo(() => node.variants.edges.map((e) => e.node.id), [node]);
  const { data: stockMap = {} } = useQuery({
    queryKey: ["variant-stock", node.id],
    queryFn: () => fetchVariantsStock(variantIds),
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  });

  const variantStock = selectedVariant ? stockMap[selectedVariant.id] : undefined;
  const maxQty = variantStock?.quantityAvailable ?? null;
  const isOutOfStock =
    (variantStock && !variantStock.availableForSale) ||
    selectedVariant?.availableForSale === false ||
    maxQty === 0;

  // Clamp qty when stock or variant changes
  if (maxQty !== null && maxQty > 0 && qty > maxQty) {
    setTimeout(() => setQty(maxQty), 0);
  }

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["products", "related", node.productType],
    queryFn: () => fetchProducts(node.productType ? `product_type:${node.productType}` : undefined, 8),
    enabled: !!node.productType,
  });
  const related = relatedProducts.filter((p) => p.node.id !== node.id).slice(0, 4);

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !size) {
      toast.error("Selecione um tamanho");
      return;
    }
    if (!selectedVariant) {
      toast.error("Variação indisponível");
      return;
    }
    if (isOutOfStock) {
      toast.error("Produto esgotado");
      return;
    }
    if (maxQty !== null && qty > maxQty) {
      toast.error(`Apenas ${maxQty} em estoque`);
      return;
    }
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions,
    });
    toast.success("Adicionado à sacola");
  };

  return (
    <SiteLayout>
      <nav aria-label="Migalhas" className="container-dm pt-6 md:pt-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <span className="text-foreground">{node.title}</span>
      </nav>

      <section className="container-dm grid lg:grid-cols-2 gap-8 lg:gap-14 pt-6 md:pt-10 pb-12 md:pb-20">
        {/* Gallery */}
        <div className="grid grid-cols-[64px_1fr] md:grid-cols-[80px_1fr] gap-3 md:gap-4">
          <div className="flex flex-col gap-2 md:gap-3 order-2 md:order-1">
            {images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)}
                className={`aspect-[4/5] overflow-hidden border-2 ${img === i ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 md:order-2 aspect-[4/5] overflow-hidden bg-background-soft">
            {images[img] ? (
              <img src={images[img]} alt={node.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:pt-4">
          {isProductNew(product) && (
            <span className="inline-block bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2.5 py-1 font-display mb-4">Novo</span>
          )}
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{node.title}</h1>

          <div className="mt-6">
            <p className="font-display text-3xl text-primary">{formatPrice(price.amount, price.currencyCode)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              ou em até {installments}x de {formatPrice(priceNum / installments, price.currencyCode)} sem juros
            </p>
          </div>

          {/* Color */}
          {colors.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-display mb-3">Cor: <span className="text-muted-foreground font-sans">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button key={c.name} onClick={() => setColor(c.name)} title={c.name} aria-pressed={color === c.name}
                    className={`size-10 rounded-full border-2 transition ${color === c.name ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
                    style={{ background: colorHex(c.name) }} />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {sizes.length > 0 && (
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
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} aria-pressed={size === s}
                    className={`min-w-12 h-12 px-4 text-sm font-display border transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          <div className="mt-4">
            <Button onClick={handleAddToCart} disabled={isLoading || !selectedVariant?.availableForSale} size="lg"
              className="w-full h-12 rounded-none bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground font-display tracking-wide">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : selectedVariant?.availableForSale === false ? "Indisponível" : "Adicionar à Sacola"}
            </Button>
          </div>

          {/* Mini benefits */}
          <ul className="mt-8 grid grid-cols-3 gap-2 text-xs md:text-sm">
            <li className="flex flex-col items-center text-center gap-1.5"><Truck className="size-5 text-primary" strokeWidth={1.5} /> Envio rápido</li>
            <li className="flex flex-col items-center text-center gap-1.5"><RefreshCw className="size-5 text-primary" strokeWidth={1.5} /> Troca facilitada</li>
            <li className="flex flex-col items-center text-center gap-1.5"><ShieldCheck className="size-5 text-primary" strokeWidth={1.5} /> Pagamento seguro</li>
          </ul>

          <Accordion type="single" collapsible className="mt-10 border-t border-border">
            <AccordionItem value="desc">
              <AccordionTrigger className="font-display">Descrição</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{node.description || "Sem descrição."}</AccordionContent>
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
            {related.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
