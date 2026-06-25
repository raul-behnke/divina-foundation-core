import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda | Divina Mulher" },
      { name: "description", content: "Respostas para as dúvidas mais frequentes sobre pedidos, entrega, trocas e pagamento na Divina Mulher." },
      { property: "og:title", content: "Central de Ajuda | Divina Mulher" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Pedidos",
    items: [
      { q: "Como acompanho meu pedido?", a: "Acesse Minha conta → Pedidos. Você também recebe e-mail e WhatsApp em cada mudança de status." },
      { q: "Posso cancelar um pedido?", a: "Sim, até o despacho. Após o envio, abra uma solicitação de devolução pela nossa política." },
      { q: "Recebi um produto trocado ou com defeito.", a: "Nos chame pelo WhatsApp em até 7 dias. Resolvemos sem custo para você." },
    ],
  },
  {
    title: "Entrega",
    items: [
      { q: "Quais formas de envio vocês usam?", a: "Correios (PAC e Sedex) e transportadoras parceiras, conforme o CEP." },
      { q: "Existe frete grátis?", a: "Sim, para compras acima de R$ 399 na modalidade PAC." },
      { q: "Posso retirar na loja?", a: "Sim, em Joinville/SC, sem custo. Selecione a opção no checkout." },
    ],
  },
  {
    title: "Trocas",
    items: [
      { q: "Em quanto tempo posso trocar?", a: "Até 30 dias após o recebimento, para troca por tamanho, cor ou modelo." },
      { q: "Quem paga o frete da troca?", a: "A primeira troca por tamanho é por nossa conta." },
    ],
  },
  {
    title: "Pagamento",
    items: [
      { q: "Quais formas de pagamento aceitam?", a: "Cartão de crédito (até 6x), Pix com 5% off e boleto bancário." },
      { q: "É seguro comprar pelo site?", a: "Sim. Todas as transações são processadas por gateways certificados PCI-DSS." },
    ],
  },
];

function FaqPage() {
  return (
    <SiteLayout>
      <section className="bg-background-soft border-b border-border">
        <div className="container-dm py-14 md:py-20 max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-4">Atendimento</p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">Central de Ajuda</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Encontre respostas rápidas. Se preferir falar com alguém, é só ir até a{" "}
            <Link to="/contato" className="text-primary underline">página de contato</Link>.
          </p>
        </div>
      </section>

      <section className="container-dm py-12 md:py-20 max-w-3xl space-y-10">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h2 className="font-display text-xl md:text-2xl mb-4">{g.title}</h2>
            <Accordion type="single" collapsible className="border-t border-border">
              {g.items.map((it, i) => (
                <AccordionItem key={i} value={`${g.title}-${i}`}>
                  <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
