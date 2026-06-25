import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://divina-foundation-core.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/colecoes", changefreq: "weekly", priority: "0.9" },
  { path: "/novidades", changefreq: "daily", priority: "0.9" },
  { path: "/tendencias", changefreq: "weekly", priority: "0.8" },
  { path: "/mais-vendidos", changefreq: "weekly", priority: "0.8" },
  { path: "/lookbook", changefreq: "monthly", priority: "0.7" },
  { path: "/sobre", changefreq: "monthly", priority: "0.6" },
  { path: "/nossa-historia", changefreq: "monthly", priority: "0.6" },
  { path: "/lojas", changefreq: "monthly", priority: "0.6" },
  { path: "/clube-vip", changefreq: "monthly", priority: "0.6" },
  { path: "/contato", changefreq: "yearly", priority: "0.5" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/guia-de-medidas", changefreq: "yearly", priority: "0.5" },
  { path: "/entrega-e-frete", changefreq: "yearly", priority: "0.4" },
  { path: "/trocas-e-devolucoes", changefreq: "yearly", priority: "0.4" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
  { path: "/termos-de-uso", changefreq: "yearly", priority: "0.3" },
];

const COLLECTION_SLUGS = ["vestidos", "alfaiataria", "blusas", "saias", "calcas", "plus", "festa"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          ...STATIC_ENTRIES,
          ...COLLECTION_SLUGS.map((slug) => ({
            path: `/colecao/${slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
