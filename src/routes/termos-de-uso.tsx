import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | Divina Mulher" },
      { name: "description", content: "Termos e condições de uso do site divinamulher.com.br." },
      { property: "og:title", content: "Termos de Uso | Divina Mulher" },
      { property: "og:url", content: "/termos-de-uso" },
    ],
    links: [{ rel: "canonical", href: "/termos-de-uso" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Termos de Uso"
      intro="Ao navegar ou comprar em divinamulher.com.br, você concorda com os termos abaixo."
    >
      <LegalSection title="Sobre a loja">
        <p>O site é operado pela Divina Mulher, com sede em Joinville/SC. Os produtos exibidos estão sujeitos à disponibilidade de estoque.</p>
      </LegalSection>
      <LegalSection title="Cadastro">
        <p>Você é responsável pelas informações fornecidas no cadastro e pela guarda da sua senha. Solicitamos dados verdadeiros e atualizados.</p>
      </LegalSection>
      <LegalSection title="Preços e pagamentos">
        <p>Os preços exibidos estão em reais e incluem impostos. Reservamo-nos o direito de corrigir eventuais erros de precificação antes da aprovação do pedido.</p>
      </LegalSection>
      <LegalSection title="Propriedade intelectual">
        <p>Imagens, textos, layout, marca e demais conteúdos são de propriedade da Divina Mulher. É vedada a reprodução sem autorização.</p>
      </LegalSection>
      <LegalSection title="Foro">
        <p>Fica eleito o foro da Comarca de Joinville/SC para dirimir quaisquer dúvidas ou litígios decorrentes destes termos.</p>
      </LegalSection>
    </LegalPage>
  ),
});
