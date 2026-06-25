import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { COLLECTION_QUERIES } from "@/data/products";

const COVERS: Record<string, string> = {
  novidades: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
  tendencias: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80",
  "mais-vendidos": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80",
  vestidos: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80",
  alfaiataria: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80",
  blusas: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=80",
  plus: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80",
};

export const Route = createFileRoute("/colecoes")({
  head: () => ({
    meta: [
      { title: "Coleções | Divina Mulher" },
      { name: "description", content: "Explore todas as coleções da Divina Mulher: vestidos, alfaiataria, blusas, plus size, novidades, tendências e mais vendidos." },
      { property: "og:title", content: "Coleções | Divina Mulher" },
      { property: "og:url", content: "/colecoes" },
    ],
    links: [{ rel: "canonical", href: "/colecoes" }],
  }),
  component: ColecoesPage,
});

function ColecoesPage() {
  const slugs = Object.keys(COLLECTION_QUERIES);
  return (
    <SiteLayout>
      <section className="bg-background-soft border-b border-border">
        <div className="container-dm py-14 md:py-20 max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Catálogo</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">Nossas coleções</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            De vestidos a alfaiataria, do casual ao essencial. Encontre a sua próxima peça favorita.
          </p>
        </div>
      </section>

      <section className="container-dm py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {slugs.map((slug) => {
            const cfg = COLLECTION_QUERIES[slug];
            return (
              <Link
                key={slug}
                to="/colecao/$slug"
                params={{ slug }}
                className="group block overflow-hidden bg-background-soft"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={COVERS[slug] ?? COVERS.vestidos}
                    alt={`Coleção ${cfg.title}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-xl md:text-2xl group-hover:text-primary transition-colors">
                    {cfg.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{cfg.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
