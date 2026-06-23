import { Truck, CreditCard, RefreshCw, MessageCircle } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Frete grátis", text: "Para compras acima de R$299" },
  { icon: CreditCard, title: "Parcelamento", text: "Em até 5x sem juros" },
  { icon: RefreshCw, title: "Troca facilitada", text: "Até 30 dias para trocar" },
  { icon: MessageCircle, title: "Atendimento humanizado", text: "Consultoria de estilo" },
];

export function BenefitBar() {
  return (
    <section className="border-y border-border bg-background-soft" aria-label="Benefícios">
      <div className="container-dm grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 md:py-10">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="size-6 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="font-display text-sm md:text-base text-foreground">{title}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
