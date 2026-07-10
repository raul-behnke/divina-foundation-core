import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useCartSync } from "@/hooks/useCartSync";
import { initMetaPixel, trackPageView } from "@/lib/meta-pixel";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center bg-primary px-6 py-3 text-sm font-display tracking-wide text-primary-foreground hover:bg-[var(--primary-hover)] transition">
            Voltar à home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display text-foreground">Esta página não carregou</h1>
        <p className="mt-2 text-sm text-muted-foreground">Algo deu errado. Tente novamente ou volte à home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="bg-primary px-6 py-3 text-sm font-display text-primary-foreground hover:bg-[var(--primary-hover)] transition">
            Tentar novamente
          </button>
          <a href="/" className="border border-foreground px-6 py-3 text-sm font-display text-foreground hover:bg-foreground hover:text-background transition">
            Ir para home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Divina Mulher | Alfaiataria feminina premium" },
      { name: "description", content: "Moda feminina premium com foco em alfaiataria contemporânea e modelagens que valorizam diferentes corpos. 18 anos em Joinville/SC." },
      { name: "author", content: "Divina Mulher" },
      { property: "og:title", content: "Divina Mulher | Alfaiataria feminina premium" },
      { property: "og:description", content: "Moda feminina premium com foco em alfaiataria contemporânea e modelagens que valorizam diferentes corpos. 18 anos em Joinville/SC." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Divina Mulher" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Divina Mulher | Alfaiataria feminina premium" },
      { name: "twitter:description", content: "Moda feminina premium com foco em alfaiataria contemporânea e modelagens que valorizam diferentes corpos. 18 anos em Joinville/SC." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7be3f6d8-8559-43f3-8a97-a562cfa435cc/id-preview-683be7b8--ffa147f5-63d5-4520-ba0e-ef10777bdd7e.lovable.app-1782401833181.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7be3f6d8-8559-43f3-8a97-a562cfa435cc/id-preview-683be7b8--ffa147f5-63d5-4520-ba0e-ef10777bdd7e.lovable.app-1782401833181.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "https://divinamulher.com.br/wp-content/uploads/2025/02/cropped-Mask-group-10-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "https://divinamulher.com.br/wp-content/uploads/2025/02/cropped-Mask-group-10-192x192.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "https://divinamulher.com.br/wp-content/uploads/2025/02/cropped-Mask-group-10-180x180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Roboto:wght@300;400;500;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartSyncBridge />
      <MetaPixelBridge />
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

function CartSyncBridge() {
  useCartSync();
  return null;
}

function MetaPixelBridge() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    initMetaPixel();
  }, []);
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return null;
}

