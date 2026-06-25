import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShopifyProduct } from "@/lib/shopify";

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  image: string | null;
  price: { amount: string; currencyCode: string };
}

interface WishlistStore {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (product: ShopifyProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((i) => i.id === id),
      toggle: (product) => {
        const node = product.node;
        const exists = get().items.some((i) => i.id === node.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== node.id) });
        } else {
          set({
            items: [
              ...get().items,
              {
                id: node.id,
                handle: node.handle,
                title: node.title,
                image: node.images?.edges?.[0]?.node?.url ?? null,
                price: node.priceRange.minVariantPrice,
              },
            ],
          });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "divina-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);
