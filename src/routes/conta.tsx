import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCustomerStore } from "@/stores/customerStore";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha Conta | Divina Mulher" },
      { name: "description", content: "Acesse sua conta Divina Mulher: pedidos, endereços e dados pessoais." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ContaLayout,
});

const TABS = [
  { label: "Visão geral", to: "/conta", exact: true },
  { label: "Pedidos", to: "/conta/pedidos", exact: false },
  { label: "Endereços", to: "/conta/enderecos", exact: false },
  { label: "Meus dados", to: "/conta/dados", exact: false },
];

function ContaLayout() {
  const customer = useCustomerStore((s) => s.customer);
  const isAuth = useCustomerStore((s) => s.isAuthenticated());
  const logout = useCustomerStore((s) => s.logout);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Public auth pages render without the sidebar shell
  const isPublic =
    pathname === "/conta/login" ||
    pathname === "/conta/cadastro" ||
    pathname === "/conta/recuperar-senha";

  if (isPublic) {
    return (
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container-dm py-10 md:py-16">
        <header className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-primary font-display">Minha Conta</p>
          <h1 className="font-display text-3xl md:text-4xl mt-2">
            {isAuth && customer
              ? `Olá, ${customer.firstName || customer.email.split("@")[0]}`
              : "Acesse sua conta"}
          </h1>
        </header>

        {isAuth ? (
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <aside>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto" aria-label="Conta">
                {TABS.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    activeOptions={{ exact: t.exact }}
                    className="px-4 py-2.5 text-sm font-display tracking-wide border-l-2 border-transparent hover:text-primary whitespace-nowrap"
                    activeProps={{ className: "text-primary border-primary bg-background-soft" }}
                  >
                    {t.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="px-4 py-2.5 text-sm font-display tracking-wide text-muted-foreground hover:text-primary text-left flex items-center gap-2"
                >
                  <LogOut className="size-4" /> Sair
                </button>
              </nav>
            </aside>
            <div>
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </section>
    </SiteLayout>
  );
}
