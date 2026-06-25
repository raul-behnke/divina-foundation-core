import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { CheckCircle2, Package, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCartStore } from "@/stores/cartStore";

const searchSchema = z.object({
  order: z.string().optional(),
});

export const Route = createFileRoute("/checkout/sucesso")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Pedido confirmado | Divina Mulher" },
      { name: "description", content: "Obrigada pela sua compra na Divina Mulher." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { order } = Route.useSearch();
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <SiteLayout>
      <section className="container-dm py-16 md:py-24 max-w-2xl text-center">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary mb-6">
          <CheckCircle2 className="size-10" />
        </div>
        <p className="text-xs tracking-[0.25em] uppercase text-primary font-display mb-3">Pedido confirmado</p>
        <h1 className="font-display text-3xl md:text-5xl leading-tight">Obrigada pela sua compra ✨</h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
          Sua Divina chegou ao destino certo. Em instantes você receberá a confirmação por e-mail com todos os detalhes.
        </p>
        {order && (
          <p className="mt-4 text-sm text-foreground">
            Número do pedido: <span className="font-medium">#{order}</span>
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="border border-border p-5 bg-background-soft">
            <Mail className="size-5 text-primary mb-3" />
            <h3 className="font-display text-sm tracking-wider uppercase mb-1">Confirmação por e-mail</h3>
            <p className="text-sm text-muted-foreground">
              Em até 10 minutos, você receberá os detalhes da compra e a nota fiscal.
            </p>
          </div>
          <div className="border border-border p-5 bg-background-soft">
            <Package className="size-5 text-primary mb-3" />
            <h3 className="font-display text-sm tracking-wider uppercase mb-1">Acompanhe a entrega</h3>
            <p className="text-sm text-muted-foreground">
              Assim que despacharmos, você receberá o código de rastreio na sua área de pedidos.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/conta/pedidos" className="bg-primary text-primary-foreground px-6 py-3 text-sm font-display tracking-wide hover:bg-[var(--primary-hover)] transition">
            Ver meus pedidos
          </Link>
          <Link to="/" className="border border-foreground text-foreground px-6 py-3 text-sm font-display tracking-wide hover:bg-foreground hover:text-background transition">
            Continuar comprando
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
