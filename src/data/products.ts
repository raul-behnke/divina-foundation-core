// Shopify product helpers (mock data removed — products come from Shopify Storefront API)
import type { ShopifyProduct } from "@/lib/shopify";

export const COLLECTION_QUERIES: Record<string, { title: string; description: string; query?: string }> = {
  novidades: {
    title: "Novidades",
    description: "Recém-chegados ao atelier — as últimas peças que entraram na coleção.",
    query: undefined, // all products, sorted by newness on the client
  },
  tendencias: {
    title: "Tendências",
    description: "As silhuetas, cores e tecidos que estão definindo a estação.",
    query: "tag:tendencia OR tag:trending",
  },
  "mais-vendidos": {
    title: "Mais vendidos",
    description: "As peças mais amadas pelas nossas clientes — campeãs de recompra.",
    query: "tag:bestseller OR tag:mais-vendidos",
  },
  vestidos: {
    title: "Vestidos",
    description: "Vestidos midi, longos, curtos e chemise. Modelagens contemporâneas para todos os momentos.",
    query: "product_type:Vestidos OR tag:vestidos OR title:vestido*",
  },
  alfaiataria: {
    title: "Alfaiataria",
    description: "Blazers, calças, conjuntos. A nossa especialidade — caimentos pensados para durar muito além da estação.",
    query: "product_type:Alfaiataria OR tag:alfaiataria OR title:blazer* OR title:calça*",
  },
  blusas: {
    title: "Blusas & Camisas",
    description: "Blusas, camisas e regatas em tecidos premium. Peças-coringa para compor com alfaiataria.",
    query: "product_type:Blusas OR tag:blusas OR title:blusa* OR title:camisa*",
  },
  plus: {
    title: "Plus Size",
    description: "Coleção Plus do G1 ao G3. Modelagens desenvolvidas para curvas reais.",
    query: "tag:plus OR tag:'plus size' OR product_type:'Plus Size'",
  },
};

// Color name → hex mapping for swatches
const COLOR_HEX: Record<string, string> = {
  preto: "#171717",
  branco: "#FFFFFF",
  "off-white": "#F2EFE9",
  off: "#F2EFE9",
  vinho: "#7E2145",
  rosa: "#E296B0",
  rose: "#E296B0",
  rosé: "#E296B0",
  nude: "#D8B89B",
  bege: "#D8B89B",
  caramelo: "#A86B3C",
  marinho: "#1E2A44",
  azul: "#1E2A44",
  verde: "#5C6B3F",
  pessego: "#FFBC7D",
  pêssego: "#FFBC7D",
  cinza: "#888888",
  marrom: "#5B3A29",
};

export function colorHex(name: string): string {
  return COLOR_HEX[name.toLowerCase().trim()] ?? "#cccccc";
}

export function getProductColors(p: ShopifyProduct): Array<{ name: string; hex: string }> {
  const opt = p.node.options.find((o) => o.name.toLowerCase().includes("cor") || o.name.toLowerCase().includes("color"));
  return (opt?.values ?? []).map((v) => ({ name: v, hex: colorHex(v) }));
}

export function getProductSizes(p: ShopifyProduct): string[] {
  const opt = p.node.options.find((o) =>
    o.name.toLowerCase().includes("tama") || o.name.toLowerCase().includes("size")
  );
  return opt?.values ?? [];
}

export function getProductImages(p: ShopifyProduct): string[] {
  return p.node.images.edges.map((e) => e.node.url);
}

export function getProductPrice(p: ShopifyProduct): number {
  return parseFloat(p.node.priceRange.minVariantPrice.amount);
}

export function isProductPlus(p: ShopifyProduct): boolean {
  return p.node.tags.some((t) => t.toLowerCase().includes("plus"));
}

export function isProductNew(p: ShopifyProduct): boolean {
  return p.node.tags.some((t) => t.toLowerCase().includes("novidade") || t.toLowerCase() === "new");
}
