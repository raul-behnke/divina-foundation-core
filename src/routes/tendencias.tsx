import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tendencias")({
  beforeLoad: () => { throw redirect({ to: "/colecao/$slug", params: { slug: "tendencias" } }); },
});
