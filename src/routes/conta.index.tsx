import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { formatPrice } from "@/lib/shopify";

export const Route = createFileRoute("/conta/")({
  component: ContaIndex,
});

function ContaIndex() {
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const customer = useCustomerStore((s) => s.customer);
  const refresh = useCustomerStore((s) => s.refresh);

  useEffect(() => {
    if (isAuth) refresh();
  }, [isAuth, refresh]);

  if (!isAuth) {
    return (
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <AuthCard
          title="Já sou cliente"
          to="/conta/login"
          cta="Entrar"
          desc="Acesse com seu e-mail e senha para ver pedidos e endereços."
        />
        <AuthCard
          title="Sou novo por aqui"
          to="/conta/cadastro"
          cta="Criar conta"
          desc="Crie uma conta rápida para acompanhar pedidos e salvar endereços."
        />
      </div>
    );
  }

  const ordersCount = customer?.orders?.edges?.length ?? 0;
  const lastOrder = customer?.orders?.edges?.[0]?.node;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Pedidos" value={String(ordersCount)} />
        <Stat label="Endereços" value={String(customer?.addresses?.edges?.length ?? 0)} />
        <Stat label="Newsletter" value={customer?.acceptsMarketing ? "Ativa" : "Inativa"} />
      </div>

      {lastOrder && (
        <div className="border border-border p-6">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Último pedido</p>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-lg">#{lastOrder.orderNumber}</h3>
            <span className="text-sm text-muted-foreground">
              {new Date(lastOrder.processedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <p className="text-sm mt-1">
            Total {formatPrice(lastOrder.currentTotalPrice.amount, lastOrder.currentTotalPrice.currencyCode)} ·{" "}
            <span className="text-muted-foreground">{lastOrder.fulfillmentStatus ?? "Em processamento"}</span>
          </p>
          <Link
            to="/conta/pedidos"
            className="inline-block mt-4 text-sm font-display tracking-wide text-primary hover:opacity-80"
          >
            Ver todos os pedidos →
          </Link>
        </div>
      )}
    </div>
  );
}

function AuthCard({ title, desc, to, cta }: { title: string; desc: string; to: "/conta/login" | "/conta/cadastro"; cta: string }) {
  return (
    <div className="border border-border p-6">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2 mb-5">{desc}</p>
      <Link
        to={to}
        className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 text-sm font-display tracking-wide hover:bg-[var(--primary-hover)]"
      >
        {cta}
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background-soft p-5">
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
      <p className="font-display text-2xl mt-1.5 text-primary">{value}</p>
    </div>
  );
}
