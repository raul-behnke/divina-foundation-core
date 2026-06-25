import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import {
  addLineToShopifyCart,
  createShopifyCart,
  fetchCart,
  fetchVariantsStock,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
  type CartItem,
  type VariantStock,
} from "@/lib/shopify";

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  /** Per-variant stock cache from last real-time check */
  stock: Record<string, VariantStock>;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<boolean>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  validateStock: (variantIds?: string[]) => Promise<Record<string, VariantStock>>;
  getCheckoutUrl: () => string | null;
}

/**
 * Returns the max quantity we are allowed to put in the cart for a variant
 * based on a real-time stock snapshot.
 * - When availableForSale is false → 0 (blocked).
 * - When quantityAvailable is exposed → that number.
 * - When quantityAvailable is null (merchant hides it) → Infinity (we trust availableForSale only).
 */
function maxAllowed(stock: VariantStock | undefined): number {
  if (!stock) return Infinity; // unknown yet, will be validated on sync
  if (!stock.availableForSale) return 0;
  if (stock.quantityAvailable === null) return Infinity;
  return Math.max(0, stock.quantityAvailable);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      stock: {},

      validateStock: async (variantIds) => {
        const ids = variantIds ?? get().items.map((i) => i.variantId);
        if (ids.length === 0) return {};
        try {
          const stock = await fetchVariantsStock(ids);
          set({ stock: { ...get().stock, ...stock } });
          return stock;
        } catch (e) {
          console.error("Failed to validate stock:", e);
          return {};
        }
      },

      addItem: async (item) => {
        const { items, cartId, clearCart, validateStock } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        const desired = (existing?.quantity ?? 0) + item.quantity;

        // Real-time stock check BEFORE mutating Shopify cart
        const stockMap = await validateStock([item.variantId]);
        const stock = stockMap[item.variantId];
        const max = maxAllowed(stock);

        if (max <= 0) {
          toast.error("Produto esgotado", {
            description: `${item.product.node.title} está indisponível no momento.`,
          });
          return false;
        }
        if (desired > max) {
          const available = max - (existing?.quantity ?? 0);
          if (available <= 0) {
            toast.error("Estoque insuficiente", {
              description: `Você já tem o máximo disponível (${max}) na sacola.`,
            });
            return false;
          }
          toast.warning("Quantidade ajustada ao estoque", {
            description: `Restam apenas ${available} unidade(s) disponível(is).`,
          });
          item = { ...item, quantity: available };
        }

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
              });
              return true;
            }
            return false;
          } else if (existing) {
            const newQty = existing.quantity + item.quantity;
            if (!existing.lineId) return false;
            const result = await updateShopifyCartLine(cartId, existing.lineId, newQty);
            if (result.success) {
              const cur = get().items;
              set({
                items: cur.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQty } : i
                ),
              });
              return true;
            }
            if (result.cartNotFound) clearCart();
            return false;
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const cur = get().items;
              set({ items: [...cur, { ...item, lineId: result.lineId ?? null }] });
              return true;
            }
            if (result.cartNotFound) clearCart();
            return false;
          }
        } catch (e) {
          console.error("Failed to add item:", e);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }
        const { items, cartId, clearCart, validateStock } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        // Real-time stock check before increasing quantities
        const stockMap = await validateStock([variantId]);
        const stock = stockMap[variantId];
        const max = maxAllowed(stock);

        if (max <= 0) {
          toast.error("Produto esgotado", {
            description: `${item.product.node.title} ficou indisponível e foi removido da sacola.`,
          });
          await get().removeItem(variantId);
          return;
        }

        let nextQty = quantity;
        if (nextQty > max) {
          nextQty = max;
          toast.warning("Quantidade ajustada", {
            description: `Estoque disponível: ${max} unidade(s).`,
          });
        }

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, nextQty);
          if (result.success) {
            const cur = get().items;
            set({
              items: cur.map((i) => (i.variantId === variantId ? { ...i, quantity: nextQty } : i)),
            });
          } else if (result.cartNotFound) clearCart();
        } catch (e) {
          console.error("Failed to update qty:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const cur = get().items;
            const next = cur.filter((i) => i.variantId !== variantId);
            next.length === 0 ? clearCart() : set({ items: next });
          } else if (result.cartNotFound) clearCart();
        } catch (e) {
          console.error("Failed to remove item:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null, stock: {} }),
      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart, validateStock } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data: any = await fetchCart(cartId);
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) {
            clearCart();
            return;
          }

          // Real-time reconciliation against current Shopify stock
          const items = get().items;
          if (items.length === 0) return;
          const stockMap = await validateStock(items.map((i) => i.variantId));

          for (const item of items) {
            const stock = stockMap[item.variantId];
            const max = maxAllowed(stock);
            if (max <= 0) {
              toast.error("Item removido da sacola", {
                description: `${item.product.node.title} ficou indisponível.`,
              });
              await get().removeItem(item.variantId);
            } else if (item.quantity > max) {
              toast.warning("Quantidade ajustada", {
                description: `${item.product.node.title}: estoque atualizado para ${max} unidade(s).`,
              });
              if (cartId && item.lineId) {
                await updateShopifyCartLine(cartId, item.lineId, max);
                const cur = get().items;
                set({
                  items: cur.map((i) =>
                    i.variantId === item.variantId ? { ...i, quantity: max } : i
                  ),
                });
              }
            }
          }
        } catch (e) {
          console.error("Failed to sync cart:", e);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "shopify-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    }
  )
);
