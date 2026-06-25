import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const SHOTS = [
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80",
    alt: "Editorial alfaiataria neutra",
    span: "md:col-span-2 md:row-span-2",
    caption: "Capítulo I · Alfaiataria",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
    alt: "Vestido fluido tom terroso",
    caption: "Vestidos",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80",
    alt: "Blazer estruturado vinho",
    caption: "Sob Medida",
  },
  {
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=80",
    alt: "Look monocromático rosa",
    span: "md:col-span-2",
    caption: "Capítulo II · Romance",
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80",
    alt: "Conjunto de festa preto",
    caption: "Noite",
  },
  {
    src: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=900&q=80",
    alt: "Look casual de dia",
    caption: "Dia a dia",
  },
  {
    src: "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=1400&q=80",
    alt: "Saia midi em movimento",
    span: "md:col-span-2 md:row-span-2",
    caption: "Capítulo III · Movimento",
  },
  {
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80",
    alt: "Camisa branca clássica",
    caption: "Essenciais",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80",
    alt: "Look plus size empoderado",
    caption: "Plus Size",
  },
];

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook | Divina Mulher" },
      { name: "description", content: "Editorial visual da coleção atual: alfaiataria, vestidos e essenciais Divina Mulher." },
      { property: "og:title", content: "Lookbook | Divina Mulher" },
      { property: "og:description", content: "Editorial visual da coleção atual Divina Mulher." },
      { property: "og:url", content: "https://divina-foundation-core.lovable.app/lookbook" },
    ],
    links: [{ rel: "canonical", href: "https://divina-foundation-core.lovable.app/lookbook" }],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  return (
    <SiteLayout>
      <section className="bg-background-soft border-b border-border">
        <div className="container-dm py-14 md:py-20 max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Lookbook · Coleção Atual</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">Vestir uma mulher é contar uma história.</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Três capítulos visuais que traduzem a coleção: alfaiataria contemporânea, romance moderno e o movimento do dia a dia.
          </p>
        </div>
      </section>

      <section className="container-dm py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[260px] gap-3 md:gap-4">
          {SHOTS.map((s) => (
            <figure key={s.src} className={`relative overflow-hidden group ${s.span ?? ""}`}>
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-xs md:text-sm font-display tracking-wide">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-background-soft border-t border-border">
        <div className="container-dm py-14 md:py-20 text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl">Compre o editorial</h2>
          <p className="mt-3 text-muted-foreground">Explore as peças que compõem cada cena.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/colecoes" className="bg-primary text-primary-foreground px-6 py-3 text-sm font-display tracking-wide hover:bg-[var(--primary-hover)] transition">
              Ver coleções
            </Link>
            <Link to="/novidades" className="border border-foreground text-foreground px-6 py-3 text-sm font-display tracking-wide hover:bg-foreground hover:text-background transition">
              Lançamentos
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
