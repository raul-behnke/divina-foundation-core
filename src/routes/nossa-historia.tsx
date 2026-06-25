import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/nossa-historia")({
  head: () => ({
    meta: [
      { title: "Nossa História | Divina Mulher" },
      { name: "description", content: "Desde 2007, a Divina Mulher veste mulheres que escolhem se sentir bem. Conheça os marcos de 18 anos de alfaiataria feminina." },
      { property: "og:title", content: "Nossa História | Divina Mulher" },
      { property: "og:url", content: "/nossa-historia" },
    ],
    links: [{ rel: "canonical", href: "/nossa-historia" }],
  }),
  component: HistoriaPage,
});

const TIMELINE = [
  { year: "2007", title: "Os primeiros cortes", text: "Em Joinville, nasce uma oficina dedicada à alfaiataria feminina. Cada peça, feita à mão, vestia uma cliente conhecida pelo nome." },
  { year: "2010", title: "A vitrine cresce", text: "A demanda exige uma equipe maior e um espaço de atendimento dedicado." },
  { year: "2012", title: "Primeira loja", text: "Inauguramos nosso primeiro endereço físico no centro de Joinville." },
  { year: "2017", title: "Coleção Plus", text: "Lançamos uma linha completa Plus Size, sem comprometer modelagem nem estética." },
  { year: "2020", title: "Online", text: "A loja digital nasce para levar nossas peças para todo o Brasil." },
  { year: "2022", title: "Atelier ampliado", text: "Expandimos o atelier para acompanhar a demanda nacional." },
  { year: "Hoje", title: "18 anos", text: "Vestimos mulheres em todo o Brasil com a mesma obsessão pelo caimento — e o mesmo cuidado de quem conhece cada cliente pelo nome." },
];

function HistoriaPage() {
  return (
    <SiteLayout>
      <section className="relative bg-background-soft">
        <div className="container-dm py-16 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Desde 2007</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              18 anos vestindo mulheres que escolhem se sentir bem.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              A Divina Mulher é uma marca de Joinville/SC dedicada à alfaiataria contemporânea para todos os corpos. Tudo começou com poucas máquinas, muita técnica e a convicção de que toda mulher merece se sentir bem vestida.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80"
              alt="Atelier Divina Mulher"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-dm py-16 md:py-24 max-w-3xl">
        <div className="relative border-l border-border pl-8 space-y-12">
          {TIMELINE.map((t) => (
            <div key={t.year} className="relative">
              <span className="absolute -left-[42px] top-1 size-3 rounded-full bg-primary ring-4 ring-background" />
              <p className="font-display text-primary text-sm tracking-wider uppercase">{t.year}</p>
              <h3 className="font-display text-xl md:text-2xl mt-1">{t.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background-soft border-t border-border">
        <div className="container-dm py-16 md:py-20 text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl">Vista uma peça que conta essa história.</h2>
          <Link
            to="/colecoes"
            className="inline-flex items-center justify-center h-12 px-8 mt-6 bg-primary text-primary-foreground font-display tracking-wide hover:opacity-90 transition"
          >
            Ver coleções
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
