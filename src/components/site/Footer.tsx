import { Link } from "@tanstack/react-router";
import { Instagram, Facebook } from "lucide-react";

import logoAsset from "@/assets/logo-divina.png.asset.json";
const LOGO = logoAsset.url;

export function Footer() {
  return (
    <footer className="bg-background-soft border-t border-border mt-16 md:mt-24">
      <div className="container-dm py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        <div>
          <img src={LOGO} alt="Divina Mulher" className="h-10 mb-5" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Moda feminina premium acessível, com alfaiataria contemporânea que valoriza diferentes corpos. 18 anos em Joinville/SC.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="https://instagram.com/divinamulherjlle" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 border border-border hover:border-primary hover:text-primary transition">
              <Instagram className="size-4" />
            </a>
            <a href="#" aria-label="Facebook" className="p-2 border border-border hover:border-primary hover:text-primary transition">
              <Facebook className="size-4" />
            </a>
          </div>
        </div>

        <FooterCol title="Institucional" links={[
          { label: "Sobre a Marca", to: "/sobre" },
          { label: "Contato", to: "/contato" },
          { label: "Termos de Uso", to: "/termos-de-uso" },
          { label: "Política de Privacidade", to: "/politica-de-privacidade" },
        ]} />
        <FooterCol title="Atendimento" links={[
          { label: "Central de Ajuda", to: "/faq" },
          { label: "Trocas & Devoluções", to: "/trocas-e-devolucoes" },
          { label: "Entrega & Frete", to: "/entrega-e-frete" },
          { label: "Guia de Medidas", to: "/guia-de-medidas" },
        ]} />
        <FooterCol title="Coleções" links={[
          { label: "Vestidos", to: "/colecao/vestidos" },
          { label: "Alfaiataria", to: "/colecao/alfaiataria" },
          { label: "Blusas & Camisas", to: "/colecao/blusas" },
          { label: "Plus Size", to: "/colecao/plus" },
        ]} />
      </div>

      <div className="border-t border-border">
        <div className="container-dm py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Divina Mulher · CNPJ 00.000.000/0001-00 · Joinville/SC</p>
          <p className="flex gap-3">
            <span>Pagamento seguro · Cartão · Pix · Boleto</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm tracking-wider uppercase mb-4 text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
