import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mais-vendidos")({
  beforeLoad: () => { throw redirect({ to: "/colecao/$slug", params: { slug: "mais-vendidos" } }); },
});
