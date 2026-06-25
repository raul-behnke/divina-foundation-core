import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Divina Mulher" },
      { name: "description", content: "Como a Divina Mulher coleta, usa e protege seus dados pessoais, em conformidade com a LGPD." },
      { property: "og:title", content: "Política de Privacidade | Divina Mulher" },
      { property: "og:url", content: "/politica-de-privacidade" },
    ],
    links: [{ rel: "canonical", href: "/politica-de-privacidade" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Privacidade"
      title="Política de Privacidade"
      intro="Esta política descreve como tratamos seus dados pessoais ao navegar e comprar em divinamulher.com.br, em conformidade com a Lei Geral de Proteção de Dados (LGPD)."
    >
      <LegalSection title="Dados coletados">
        <p>Coletamos dados de cadastro (nome, e-mail, CPF, telefone, endereço), dados de pagamento processados pelas operadoras parceiras, e dados de navegação (cookies, IP, dispositivo).</p>
      </LegalSection>
      <LegalSection title="Finalidades">
        <p>Usamos seus dados para processar pedidos, emitir nota fiscal, oferecer atendimento, enviar comunicações de marketing (quando autorizadas) e cumprir obrigações legais.</p>
      </LegalSection>
      <LegalSection title="Compartilhamento">
        <p>Compartilhamos dados apenas com operadores essenciais à operação: transportadoras, gateways de pagamento, plataforma de e-commerce e ferramentas de e-mail marketing — todos sob acordo de confidencialidade.</p>
      </LegalSection>
      <LegalSection title="Seus direitos">
        <p>Você pode solicitar a qualquer momento: acesso, correção, exclusão, anonimização ou portabilidade dos seus dados. Basta entrar em contato pelo e-mail <a href="mailto:privacidade@divinamulher.com.br" className="text-primary underline">privacidade@divinamulher.com.br</a>.</p>
      </LegalSection>
      <LegalSection title="Cookies">
        <p>Usamos cookies essenciais para o funcionamento do site e cookies analíticos para entender a navegação. Você pode gerenciar preferências no banner exibido no primeiro acesso.</p>
      </LegalSection>
      <LegalSection title="Retenção">
        <p>Mantemos seus dados pelo tempo necessário para cumprir as finalidades e obrigações legais (mínimo de 5 anos para dados fiscais).</p>
      </LegalSection>
    </LegalPage>
  ),
});
