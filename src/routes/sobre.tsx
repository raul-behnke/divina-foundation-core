import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Marca | Divina Mulher" },
      { name: "description", content: "Há 18 anos em Joinville/SC, a Divina Mulher é especialista em alfaiataria feminina contemporânea para todos os corpos." },
      { property: "og:title", content: "Sobre a Marca | Divina Mulher" },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

const TIMELINE = [
  { year: "2007", title: "Os primeiros cortes", text: "Nasce em Joinville uma pequena oficina dedicada à alfaiataria feminina." },
  { year: "2012", title: "Primeira loja", text: "Inauguramos nosso primeiro endereço físico no centro de Joinville." },
  { year: "2017", title: "Coleção Plus", text: "Lançamos uma linha completa Plus Size, sem comprometer modelagem nem estética." },
  { year: "2022", title: "Atelier ampliado", text: "Expandimos o atelier para acompanhar a demanda nacional." },
  { year: "Hoje", title: "18 anos", text: "Vestimos mulheres em todo o Brasil com a mesma obsessão pelo caimento." },
];

function SobrePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-background-soft">
        <div className="container-dm py-16 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Sobre a Marca</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Alfaiataria com alma feminina.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Há 18 anos, em Joinville, desenhamos peças que respeitam o corpo de cada mulher. Nossa especialidade é a alfaiataria contemporânea — e nossa convicção é que toda mulher merece se sentir bem vestida.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src="https://divinamulher.com.br/wp-content/uploads/2025/12/15386744535-estudio-divina-mulher-16-10-2025-0031.jpg" alt="Editorial Divina Mulher" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="container-dm py-16 md:py-24">
        <SectionTitle eyebrow="O que nos move" title="Três compromissos, uma marca" />
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { t: "Alfaiataria", d: "Modelagens estruturadas, caimentos pensados milímetro a milímetro." },
            { t: "Diversidade de corpos", d: "PP ao G3 com a mesma atenção. Plus Size é coleção, não adaptação." },
            { t: "Qualidade verdadeira", d: "Tecidos selecionados e acabamentos de atelier, em cada peça." },
          ].map((p) => (
            <div key={p.t} className="border-t border-primary pt-6">
              <h3 className="font-display text-xl md:text-2xl">{p.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background-soft py-16 md:py-24 monogram-bg">
        <div className="container-dm">
          <SectionTitle eyebrow="Nossa trajetória" title="18 anos, contados em peças" />
          <ol className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" aria-hidden />
            {TIMELINE.map((m, i) => (
              <li key={m.year} className={`relative grid md:grid-cols-2 gap-4 md:gap-12 pb-10 md:pb-14 pl-12 md:pl-0 ${i % 2 ? "md:[&>div:first-child]:col-start-2" : ""}`}>
                <span className="absolute left-4 md:left-1/2 top-2 size-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background-soft" />
                <div className={`md:text-right ${i % 2 ? "md:order-2 md:text-left" : ""}`}>
                  <p className="font-display text-primary text-2xl md:text-3xl">{m.year}</p>
                </div>
                <div>
                  <h3 className="font-display text-lg md:text-xl">{m.title}</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">{m.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="container-dm py-20 md:py-28 text-center">
        <h2 className="font-display text-3xl md:text-4xl max-w-2xl mx-auto leading-tight">
          Visite o atelier ou explore a coleção online.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Joinville/SC · Atendimento humanizado, presencial ou pelo Instagram.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-[var(--primary-hover)] text-primary-foreground px-8 h-12 rounded-none font-display tracking-wide">
            <Link to="/colecao/vestidos">Ver coleção</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background px-8 h-12 rounded-none font-display tracking-wide">
            <Link to="/guia-de-medidas">Guia de medidas</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
