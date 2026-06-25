import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";
import { formatPrice } from "@/lib/shopify";

export const Route = createFileRoute("/conta/pedidos")({
  component: PedidosPage,
});

function PedidosPage() {
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const customer = useCustomerStore((s) => s.customer);
  const refresh = useCustomerStore((s) => s.refresh);

  useEffect(() => {
    if (isAuth) refresh();
  }, [isAuth, refresh]);

  if (!isAuth) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to="/conta/login" className="text-primary">Entre</Link> para ver seus pedidos.
      </p>
    );
  }

  const orders = customer?.orders?.edges ?? [];

  if (orders.length === 0) {
    return (
      <div className="border border-border p-10 text-center">
        <p className="text-muted-foreground">Você ainda não tem pedidos.</p>
        <Link to="/" className="inline-block mt-4 text-primary font-display tracking-wide text-sm">
          Começar a comprar →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl mb-2">Pedidos</h2>
      {orders.map(({ node: order }) => (
        <article key={order.id} className="border border-border p-5">
          <header className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
            <div>
              <h3 className="font-display text-lg">Pedido #{order.orderNumber}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(order.processedAt).toLocaleDateString("pt-BR")} ·{" "}
                {order.fulfillmentStatus ?? "Em processamento"} ·{" "}
                {order.financialStatus ?? "Pendente"}
              </p>
            </div>
            <p className="font-display text-primary">
              {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
            </p>
          </header>
          <ul className="divide-y divide-border border-y border-border">
            {order.lineItems.edges.map(({ node: line }, idx) => (
              <li key={idx} className="flex gap-3 py-3">
                {line.variant?.image?.url && (
                  <img src={line.variant.image.url} alt={line.variant.image.altText ?? line.title} className="w-12 aspect-[4/5] object-cover" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{line.title}</p>
                  <p className="text-xs text-muted-foreground">{line.variant?.title} · Qtd {line.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            href={order.statusUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-display tracking-wide text-primary hover:opacity-80"
          >
            Acompanhar pedido <ExternalLink className="size-3.5" />
          </a>
        </article>
      ))}
    </div>
  );
}
