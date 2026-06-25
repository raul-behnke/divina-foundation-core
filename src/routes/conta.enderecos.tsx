import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCustomerStore } from "@/stores/customerStore";

export const Route = createFileRoute("/conta/enderecos")({
  component: EnderecosPage,
});

function EnderecosPage() {
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const customer = useCustomerStore((s) => s.customer);
  const refresh = useCustomerStore((s) => s.refresh);

  useEffect(() => {
    if (isAuth) refresh();
  }, [isAuth, refresh]);

  if (!isAuth) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to="/conta/login" className="text-primary">Entre</Link> para ver seus endereços.
      </p>
    );
  }

  const addresses = customer?.addresses?.edges ?? [];
  const defaultId = customer?.defaultAddress?.id;

  if (addresses.length === 0) {
    return (
      <div className="border border-border p-10 text-center">
        <p className="text-muted-foreground">Você ainda não tem endereços salvos.</p>
        <p className="text-xs text-muted-foreground mt-2">
          Adicione um endereço durante o checkout — ele aparecerá aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl mb-2">Endereços</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map(({ node: a }) => (
          <article key={a.id} className="border border-border p-5">
            <div className="flex items-baseline justify-between mb-2">
              <p className="font-display">
                {a.firstName} {a.lastName}
              </p>
              {a.id === defaultId && (
                <span className="text-[10px] tracking-widest uppercase bg-primary text-primary-foreground px-2 py-0.5">
                  Padrão
                </span>
              )}
            </div>
            <address className="not-italic text-sm text-muted-foreground space-y-0.5">
              <p>{a.address1}{a.address2 ? `, ${a.address2}` : ""}</p>
              <p>{a.city} {a.province && `- ${a.province}`} {a.zip && `· CEP ${a.zip}`}</p>
              <p>{a.country}</p>
              {a.phone && <p>{a.phone}</p>}
            </address>
          </article>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Para editar ou adicionar endereços, use o painel completo do Shopify durante o checkout.
      </p>
    </div>
  );
}
