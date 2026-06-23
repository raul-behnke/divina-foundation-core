import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SizeGuideTable } from "@/components/site/SizeGuideTable";
import { Ruler } from "lucide-react";

export const Route = createFileRoute("/guia-de-medidas")({
  head: () => ({
    meta: [
      { title: "Guia de Medidas | Divina Mulher" },
      { name: "description", content: "Tabela de medidas Divina Mulher do PP ao G3, com instruções de como medir busto, cintura e quadril." },
      { property: "og:title", content: "Guia de Medidas | Divina Mulher" },
      { property: "og:url", content: "/guia-de-medidas" },
    ],
    links: [{ rel: "canonical", href: "/guia-de-medidas" }],
  }),
  component: GuiaPage,
});

function GuiaPage() {
  return (
    <SiteLayout>
      <nav aria-label="Migalhas" className="container-dm pt-8 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> <span className="mx-1">/</span>
        <span className="text-foreground">Guia de Medidas</span>
      </nav>
      <header className="container-dm pt-6 pb-10 md:pt-10 md:pb-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-3">Tabela de Medidas</p>
        <h1 className="font-display text-3xl md:text-5xl leading-tight">Encontre o tamanho perfeito.</h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          Medidas em centímetros, do PP ao G3. Se você ficar entre dois tamanhos, recomendamos o maior — alfaiataria gosta de respirar.
        </p>
      </header>

      <section className="container-dm grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 pb-16 md:pb-24">
        <div>
          <SizeGuideTable />
        </div>
        <aside className="bg-background-soft p-7 md:p-9">
          <Ruler className="size-7 text-primary mb-4" strokeWidth={1.25} />
          <h2 className="font-display text-xl md:text-2xl">Como medir</h2>
          <ul className="mt-5 space-y-5 text-sm md:text-base">
            <li>
              <p className="font-display text-foreground">Busto</p>
              <p className="text-muted-foreground mt-1">Passe a fita métrica horizontalmente, sobre a parte mais cheia do busto.</p>
            </li>
            <li>
              <p className="font-display text-foreground">Cintura</p>
              <p className="text-muted-foreground mt-1">Meça na parte mais estreita do tronco, geralmente acima do umbigo.</p>
            </li>
            <li>
              <p className="font-display text-foreground">Quadril</p>
              <p className="text-muted-foreground mt-1">Mantenha a fita horizontal e meça na parte mais larga do quadril.</p>
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">Dica: meça sobre roupas finas e mantenha a fita justa, sem apertar.</p>
        </aside>
      </section>
    </SiteLayout>
  );
}
