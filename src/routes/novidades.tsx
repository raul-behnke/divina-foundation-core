import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/novidades")({
  beforeLoad: () => { throw redirect({ to: "/colecao/$slug", params: { slug: "novidades" } }); },
});
