import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/trocas-e-devolucoes")({
  head: () => ({
    meta: [
      { title: "Trocas & Devoluções | Divina Mulher" },
      { name: "description", content: "Política de trocas e devoluções da Divina Mulher: prazo de 7 dias para arrependimento e até 30 dias para troca por tamanho ou defeito." },
      { property: "og:title", content: "Trocas & Devoluções | Divina Mulher" },
      { property: "og:url", content: "/trocas-e-devolucoes" },
    ],
    links: [{ rel: "canonical", href: "/trocas-e-devolucoes" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Atendimento"
      title="Trocas & Devoluções"
      intro="Queremos que cada peça caia perfeitamente. Por isso facilitamos trocas por tamanho, modelo ou cor — e garantimos seu direito de arrependimento."
    >
      <LegalSection title="Prazos">
        <p><strong>Arrependimento:</strong> até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor.</p>
        <p><strong>Troca por tamanho, cor ou modelo:</strong> até 30 dias após o recebimento.</p>
        <p><strong>Defeito de fabricação:</strong> até 90 dias após o recebimento.</p>
      </LegalSection>
      <LegalSection title="Condições da peça">
        <p>A peça precisa estar sem sinais de uso, lavagem ou modificação, com etiquetas e embalagem originais.</p>
      </LegalSection>
      <LegalSection title="Como solicitar">
        <p>1. Envie um WhatsApp para nosso atendimento informando o número do pedido.</p>
        <p>2. Recebido o código de postagem, despache a peça nos Correios — o frete da primeira troca por tamanho é por nossa conta.</p>
        <p>3. Após o recebimento e conferência, processamos a troca ou o estorno em até 5 dias úteis.</p>
      </LegalSection>
      <LegalSection title="Reembolso">
        <p>Compras no cartão são estornadas pela operadora em até 2 faturas. Pix e boleto são reembolsados na conta indicada em até 10 dias úteis.</p>
      </LegalSection>
    </LegalPage>
  ),
});
