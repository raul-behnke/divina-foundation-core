import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/lojas")({
  head: () => ({
    meta: [
      { title: "Lojas Físicas | Divina Mulher" },
      { name: "description", content: "Visite as lojas Divina Mulher em Joinville/SC. Endereços, telefones e horários de atendimento." },
      { property: "og:title", content: "Lojas Físicas | Divina Mulher" },
      { property: "og:url", content: "/lojas" },
    ],
    links: [{ rel: "canonical", href: "/lojas" }],
  }),
  component: LojasPage,
});

const STORES = [
  {
    name: "Divina Mulher — Centro",
    address: "Rua Princesa Isabel, 000 — Centro, Joinville/SC",
    phone: "(47) 9 9999-9999",
    hours: "Seg a Sex 9h–18h · Sáb 9h–13h",
    map: "https://www.google.com/maps?q=Joinville+SC+Centro&output=embed",
  },
  {
    name: "Divina Mulher — América",
    address: "Av. Getúlio Vargas, 000 — América, Joinville/SC",
    phone: "(47) 9 8888-8888",
    hours: "Seg a Sex 10h–19h · Sáb 10h–14h",
    map: "https://www.google.com/maps?q=Joinville+SC+America&output=embed",
  },
];

function LojasPage() {
  return (
    <SiteLayout>
      <section className="bg-background-soft border-b border-border">
        <div className="container-dm py-14 md:py-20 max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Onde estamos</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">Lojas Físicas</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Em Joinville, você experimenta cada peça com o atendimento personalizado que nasceu junto com a marca.
          </p>
        </div>
      </section>

      <section className="container-dm py-12 md:py-20 space-y-16">
        {STORES.map((s) => (
          <article key={s.name} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="aspect-[4/3] bg-background-soft overflow-hidden">
              <iframe
                src={s.map}
                title={`Mapa — ${s.name}`}
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="space-y-5">
              <h2 className="font-display text-2xl md:text-3xl">{s.name}</h2>
              <div className="space-y-3 text-sm">
                <p className="flex gap-3 items-start"><MapPin className="size-4 text-primary mt-0.5" /> {s.address}</p>
                <p className="flex gap-3 items-start"><Phone className="size-4 text-primary mt-0.5" /> {s.phone}</p>
                <p className="flex gap-3 items-start"><Clock className="size-4 text-primary mt-0.5" /> {s.hours}</p>
              </div>
              <a
                href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-11 px-6 bg-primary text-primary-foreground font-display tracking-wide hover:opacity-90 transition"
              >
                Falar no WhatsApp
              </a>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
