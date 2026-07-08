// Shopify Storefront API client + types + cart mutations
import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "jycpnq-r7.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "8ec365eecc6ecf362557395fec47b8d6";

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: { minVariantPrice: ShopifyMoney };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: { edges: Array<{ node: ShopifyProductVariant }> };
    options: Array<{ name: string; values: string[] }>;
  };
}

export async function storefrontApiRequest<T = any>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<{ data?: T; errors?: Array<{ message: string }> } | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: pagamento necessário", {
      description: "O acesso à API da Shopify requer um plano ativo. Acesse https://admin.shopify.com para atualizar.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`Shopify HTTP error: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify error: ${data.errors.map((e: any) => e.message).join(", ")}`);
  }
  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      productType
      tags
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 10) { edges { node { url altText } } }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

export async function fetchProducts(query?: string, first = 50): Promise<ShopifyProduct[]> {
  const result = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
    PRODUCTS_QUERY,
    { first, query: query ?? null }
  );
  return result?.data?.products?.edges ?? [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const result = await storefrontApiRequest<{ productByHandle: ShopifyProduct["node"] | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  const node = result?.data?.productByHandle;
  return node ? { node } : null;
}

export function formatPrice(amount: string | number, currencyCode = "BRL") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  const locale = currencyCode === "BRL" ? "pt-BR" : "en-US";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(n);
  } catch {
    return `${currencyCode} ${n.toFixed(2)}`;
  }
}

/* ============ CART ============ */

const CART_QUERY = `
  query cart($id: ID!) { cart(id: $id) { id totalQuantity } }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: ShopifyMoney;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist")
  );
}

export async function createShopifyCart(
  item: CartItem
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest<any>(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });
  const errors = data?.data?.cartCreate?.userErrors || [];
  if (errors.length > 0) {
    console.error("Cart creation failed:", errors);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: CartItem
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<any>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Add line failed:", userErrors);
    return { success: false };
  }
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l: any) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<any>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Update line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<any>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Remove line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function fetchCart(cartId: string) {
  return storefrontApiRequest(CART_QUERY, { id: cartId });
}

/* ============ STOCK / REAL-TIME AVAILABILITY ============ */

const VARIANTS_STOCK_QUERY_BASIC = `
  query VariantsStock($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        currentlyNotInStock
      }
    }
  }
`;

const VARIANTS_STOCK_QUERY_FULL = `
  query VariantsStockFull($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        currentlyNotInStock
        quantityAvailable
      }
    }
  }
`;

export interface VariantStock {
  id: string;
  availableForSale: boolean;
  /** Null if the Storefront token lacks unauthenticated_read_product_inventory */
  quantityAvailable: number | null;
  currentlyNotInStock: boolean;
}

// Cache: once we discover the scope is missing, stop retrying the full query.
let stockScopeAvailable: boolean | null = null;

export async function fetchVariantsStock(ids: string[]): Promise<Record<string, VariantStock>> {
  if (ids.length === 0) return {};

  const tryFull = stockScopeAvailable !== false;
  let nodes: any[] | null = null;

  if (tryFull) {
    try {
      const data = await storefrontApiRequest<{ nodes: any[] }>(VARIANTS_STOCK_QUERY_FULL, { ids });
      nodes = data?.data?.nodes ?? [];
      stockScopeAvailable = true;
    } catch (e) {
      stockScopeAvailable = false;
      nodes = null;
    }
  }

  if (!nodes) {
    const data = await storefrontApiRequest<{ nodes: any[] }>(VARIANTS_STOCK_QUERY_BASIC, { ids });
    nodes = data?.data?.nodes ?? [];
  }

  const map: Record<string, VariantStock> = {};
  for (const node of nodes) {
    if (node && node.id) {
      map[node.id] = {
        id: node.id,
        availableForSale: !!node.availableForSale,
        quantityAvailable:
          typeof node.quantityAvailable === "number" ? node.quantityAvailable : null,
        currentlyNotInStock: !!node.currentlyNotInStock,
      };
    }
  }
  return map;
}

/* ============ HOME BANNERS (Metaobjects) ============ */

const HOME_BANNERS_QUERY = `
  query HomeBanners {
    metaobjects(type: "home_banner", first: 20) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image { url altText width height }
              }
            }
          }
        }
      }
    }
  }
`;

export interface HomeBanner {
  id: string;
  image: string;
  alt: string;
  headline: string | null;
  subheadline: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  order: number;
  active: boolean;
}

function parseBoolField(v: string | null | undefined): boolean {
  if (!v) return false;
  return v === "true" || v === "1";
}

export async function fetchHomeBanners(): Promise<HomeBanner[]> {
  try {
    const data = await storefrontApiRequest<{ metaobjects: { edges: Array<{ node: any }> } }>(
      HOME_BANNERS_QUERY
    );
    const edges = data?.data?.metaobjects?.edges ?? [];
    const banners: HomeBanner[] = edges
      .map(({ node }) => {
        const fields: Record<string, { value: string | null; reference: any }> = {};
        for (const f of node.fields ?? []) {
          fields[f.key] = { value: f.value, reference: f.reference };
        }
        const imgRef = fields.image?.reference?.image;
        const imgUrl: string | undefined = imgRef?.url;
        if (!imgUrl) return null;
        const orderRaw = fields.order?.value;
        const activeRaw = fields.active?.value;
        return {
          id: node.id as string,
          image: imgUrl,
          alt: imgRef?.altText || fields.headline?.value || "Banner Divina Mulher",
          headline: fields.headline?.value || null,
          subheadline: fields.subheadline?.value || null,
          ctaLabel: fields.cta_label?.value || null,
          ctaUrl: fields.cta_url?.value || null,
          order: orderRaw ? parseInt(orderRaw, 10) || 0 : 0,
          active: activeRaw === null || activeRaw === undefined ? true : parseBoolField(activeRaw),
        } as HomeBanner;
      })
      .filter((b): b is HomeBanner => b !== null && b.active)
      .sort((a, b) => a.order - b.order);
    return banners;
  } catch (e) {
    console.warn("fetchHomeBanners failed, using fallback", e);
    return [];
  }
}



