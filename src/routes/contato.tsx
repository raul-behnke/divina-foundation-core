import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato | Divina Mulher" },
      { name: "description", content: "Fale com a Divina Mulher por WhatsApp, e-mail ou pelo formulário. Atendimento de segunda a sábado." },
      { property: "og:title", content: "Contato | Divina Mulher" },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Mensagem enviada! Retornamos em até 1 dia útil.");
    }, 700);
  }

  return (
    <SiteLayout>
      <section className="bg-background-soft border-b border-border">
        <div className="container-dm py-14 md:py-20 max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Atendimento</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">Fale com a gente</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Estamos aqui para ajudar com dúvidas sobre produtos, pedidos, trocas e parcerias.
          </p>
        </div>
      </section>

      <section className="container-dm py-12 md:py-20 grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
        <form onSubmit={onSubmit} className="space-y-5">
          <h2 className="font-display text-xl md:text-2xl">Envie uma mensagem</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone / WhatsApp</Label>
              <Input id="telefone" name="telefone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto</Label>
              <Input id="assunto" name="assunto" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea id="mensagem" name="mensagem" rows={6} required />
          </div>
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>

        <aside className="space-y-6">
          <h2 className="font-display text-xl md:text-2xl">Canais diretos</h2>
          <ContactItem
            icon={<MessageCircle className="size-5" />}
            label="WhatsApp"
            value="(47) 9 9999-9999"
            href="https://wa.me/5547999999999"
          />
          <ContactItem
            icon={<Mail className="size-5" />}
            label="E-mail"
            value="atendimento@divinamulher.com.br"
            href="mailto:atendimento@divinamulher.com.br"
          />
          <ContactItem
            icon={<MapPin className="size-5" />}
            label="Loja física"
            value="Rua Princesa Isabel, 000 — Centro, Joinville/SC"
          />
          <ContactItem
            icon={<Clock className="size-5" />}
            label="Horário"
            value="Seg a Sex 9h–18h · Sáb 9h–13h"
          />
        </aside>
      </section>
    </SiteLayout>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex gap-3 items-start">
      <span className="text-primary mt-0.5">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block hover:text-primary transition">
      {inner}
    </a>
  ) : (
    inner
  );
}
