import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/entrega-e-frete")({
  head: () => ({
    meta: [
      { title: "Entrega & Frete | Divina Mulher" },
      { name: "description", content: "Prazos, modalidades de envio e rastreamento de pedidos Divina Mulher para todo o Brasil." },
      { property: "og:title", content: "Entrega & Frete | Divina Mulher" },
      { property: "og:url", content: "/entrega-e-frete" },
    ],
    links: [{ rel: "canonical", href: "/entrega-e-frete" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Atendimento"
      title="Entrega & Frete"
      intro="Enviamos para todo o Brasil pelos Correios e por transportadoras parceiras. O prazo começa a contar após a confirmação do pagamento."
    >
      <LegalSection title="Prazo de produção">
        <p>Pedidos são separados e despachados em até 2 dias úteis após a confirmação do pagamento.</p>
      </LegalSection>
      <LegalSection title="Prazos de entrega (estimados)">
        <p><strong>Sul:</strong> 2 a 5 dias úteis.</p>
        <p><strong>Sudeste:</strong> 3 a 7 dias úteis.</p>
        <p><strong>Centro-Oeste e Nordeste:</strong> 5 a 10 dias úteis.</p>
        <p><strong>Norte:</strong> 7 a 15 dias úteis.</p>
      </LegalSection>
      <LegalSection title="Frete grátis">
        <p>Frete grátis para todo o Brasil em compras acima de R$ 399 (modalidade PAC).</p>
      </LegalSection>
      <LegalSection title="Rastreamento">
        <p>Assim que o pedido é despachado, enviamos o código de rastreio por e-mail e WhatsApp. Você também acompanha o status em <em>Minha conta → Pedidos</em>.</p>
      </LegalSection>
      <LegalSection title="Retirada em loja">
        <p>Disponível para clientes de Joinville/SC sem custo adicional. Selecione a opção no checkout.</p>
      </LegalSection>
    </LegalPage>
  ),
});
