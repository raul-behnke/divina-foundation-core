import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Truck, Star, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/clube-vip")({
  head: () => ({
    meta: [
      { title: "Clube VIP | Divina Mulher" },
      { name: "description", content: "Entre para o Clube VIP Divina Mulher: acesso antecipado, descontos exclusivos, frete grátis e brindes em datas especiais." },
      { property: "og:title", content: "Clube VIP | Divina Mulher" },
      { property: "og:url", content: "/clube-vip" },
    ],
    links: [{ rel: "canonical", href: "/clube-vip" }],
  }),
  component: ClubeVipPage,
});

const BENEFITS = [
  { icon: Star, title: "Acesso antecipado", text: "Compre coleções e drops 48h antes do público geral." },
  { icon: Gift, title: "Cupom de boas-vindas", text: "10% off na primeira compra após o cadastro." },
  { icon: Truck, title: "Frete grátis facilitado", text: "Frete grátis a partir de R$ 299 (em vez de R$ 399)." },
  { icon: Crown, title: "Mimos no aniversário", text: "Cupom exclusivo e brinde surpresa no seu mês." },
];

function ClubeVipPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast.success("Bem-vinda ao Clube VIP! Confira seu e-mail.");
    }, 700);
  }

  return (
    <SiteLayout>
      <section className="relative bg-background-soft overflow-hidden">
        <div className="container-dm py-16 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Programa de relacionamento</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Clube VIP Divina
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Vantagens exclusivas para quem ama estar bem vestida. Sem mensalidade, sem letras miúdas — só mimos.
            </p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="h-12"
              />
              <Button type="submit" disabled={loading} className="h-12 px-6">
                {loading ? "Enviando..." : "Quero entrar"}
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              Ao se cadastrar, você concorda com nossa{" "}
              <Link to="/politica-de-privacidade" className="underline hover:text-primary">Política de Privacidade</Link>.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900&q=80"
              alt="Cliente Clube VIP Divina Mulher"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-dm py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl">O que você ganha</h2>
          <p className="mt-3 text-muted-foreground">Benefícios pensados para quem faz da Divina Mulher um hábito.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-background-soft p-8 text-center">
              <b.icon className="size-8 text-primary mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-lg">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background-soft border-t border-border">
        <div className="container-dm py-16 md:py-20 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-center">Como funciona</h2>
          <ol className="mt-10 space-y-6">
            {[
              "Cadastre seu e-mail no formulário acima.",
              "Receba imediatamente o cupom de boas-vindas de 10% off.",
              "Comece a acumular benefícios desde a primeira compra: acesso antecipado, frete facilitado e mimos no aniversário.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="size-9 flex-shrink-0 flex items-center justify-center bg-primary text-primary-foreground font-display rounded-full">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
