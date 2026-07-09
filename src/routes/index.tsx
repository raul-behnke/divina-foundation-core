import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroBanner } from "@/components/site/HeroBanner";
import { SectionTitle } from "@/components/site/SectionTitle";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { NewsletterSection } from "@/components/site/NewsletterSection";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/shopify";
import { isProductNew } from "@/data/products";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Divina Mulher | Alfaiataria feminina premium" },
      { name: "description", content: "Coleção de alfaiataria contemporânea para mulheres que buscam elegância em cada detalhe. Vestidos, blazers, calças e Plus Size." },
      { property: "og:title", content: "Divina Mulher | Alfaiataria feminina premium" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const TESTIMONIALS = [
  { name: "Mariana A.", city: "Joinville/SC", text: "As peças têm um caimento que parece feito sob medida. Comprei um conjunto de alfaiataria e já é meu uniforme das reuniões importantes." },
  { name: "Cláudia R.", city: "Curitiba/PR", text: "Encontrei na Divina Mulher a alfaiataria Plus que sempre busquei. Modelagem inteligente, sem perder feminilidade." },
  { name: "Beatriz L.", city: "São Paulo/SP", text: "Atendimento humanizado de verdade. Me ajudaram a escolher o tamanho e a peça chegou impecável." },
];

function HomePage() {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts(),
  });

  const lancamentos = (allProducts.filter(isProductNew).length > 0
    ? allProducts.filter(isProductNew)
    : allProducts
  ).slice(0, 10);
  const tendencias = allProducts.slice(0, 10);
  const maisVendidos = allProducts.slice(0, 10);

  return (
    <SiteLayout>
      {/* 1. Carrossel de Banners */}
      <HeroBanner />

      {/* 2. Lançamentos */}
      <section className="container-dm py-12 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <SectionTitle eyebrow="Recém-chegados" title="Lançamentos" align="left" />
          <Link to="/colecao/$slug" params={{ slug: "novidades" }} className="hidden md:inline-block text-sm font-display tracking-wide text-primary hover:underline underline-offset-4">
            Ver tudo →
          </Link>
        </div>
        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : (
          <ProductCarousel products={lancamentos} ariaLabel="Lançamentos" />
        )}
      </section>

      {/* 3. Coleções (Categorias) */}
      <section className="container-dm py-16 md:py-24">
        <SectionTitle eyebrow="Coleções" title="Encontre seu próximo favorito" description="Selecionadas para mulheres que valorizam alfaiataria, conforto e atitude." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <CategoryCard title="Vestidos" to="/colecao/vestidos" image="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80" alt="Vestidos Divina Mulher" />
          <CategoryCard title="Alfaiataria" to="/colecao/alfaiataria" image="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=1200&q=80" alt="Alfaiataria Divina Mulher" />
          <CategoryCard title="Blusas" to="/colecao/blusas" image="https://images.unsplash.com/photo-1564257577-2d3ee8740fd8?auto=format&fit=crop&w=1200&q=80" alt="Blusas e camisas femininas" />
          <CategoryCard title="Plus Size" to="/colecao/plus" image="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=1200&q=80" alt="Coleção Plus Size" />

        </div>
      </section>

      {/* 4. Tendências */}
      <section className="container-dm py-12 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <SectionTitle eyebrow="Em alta" title="Tendências" align="left" />
        </div>
        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : (
          <ProductCarousel products={tendencias} ariaLabel="Tendências" />
        )}
      </section>

      {/* 5. Mais vendidos */}
      <section className="container-dm py-12 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <SectionTitle eyebrow="Favoritos" title="Mais vendidos" align="left" />
        </div>
        {isLoading ? (
          <div className="py-16 flex justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : (
          <ProductCarousel products={maisVendidos} ariaLabel="Mais vendidos" />
        )}
      </section>

      {/* 6. Desde 2007 — 18 anos */}
      <section className="relative bg-background-soft py-20 md:py-28 monogram-bg overflow-hidden">
        <div className="container-dm grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Desde 2007</p>
            <h2 className="font-display text-3xl md:text-5xl leading-tight text-foreground">
              18 anos vestindo mulheres que escolhem se sentir bem.
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Nascemos em Joinville com uma convicção: alfaiataria não é privilégio — é linguagem. E toda mulher merece falar essa língua, no seu corpo, no seu tempo.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground px-8 h-12 rounded-none font-display tracking-wide">
              <Link to="/sobre">Conheça a Divina Mulher</Link>
            </Button>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80" alt="Editorial Divina Mulher — atelier" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* 7. Quem usa, conta — Mulheres Divina */}
      <section className="container-dm py-16 md:py-24">
        <SectionTitle eyebrow="Quem usa, conta" title="Mulheres Divina" />
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} t={t} />)}
        </div>
      </section>

      {/* 8. Clube VIP */}
      <NewsletterSection />
    </SiteLayout>
  );
}
