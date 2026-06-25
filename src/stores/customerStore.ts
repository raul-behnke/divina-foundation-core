import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  customerLogin,
  customerLogout,
  customerSignup,
  fetchCustomer,
  type Customer,
  type CustomerAccessToken,
} from "@/lib/shopify-customer";

interface CustomerStore {
  token: CustomerAccessToken | null;
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    acceptsMarketing?: boolean;
  }) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      token: null,
      customer: null,
      isLoading: false,

      isAuthenticated: () => {
        const t = get().token;
        if (!t) return false;
        return new Date(t.expiresAt).getTime() > Date.now();
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { token, error } = await customerLogin(email, password);
          if (error || !token) return { error: error ?? "Falha ao entrar." };
          set({ token });
          const customer = await fetchCustomer(token.accessToken);
          set({ customer });
          return { error: null };
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (input) => {
        set({ isLoading: true });
        try {
          const { error } = await customerSignup(input);
          if (error) return { error };
          return await get().login(input.email, input.password);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const t = get().token;
        if (t) {
          try {
            await customerLogout(t.accessToken);
          } catch {
            /* noop */
          }
        }
        set({ token: null, customer: null });
      },

      refresh: async () => {
        const t = get().token;
        if (!t || new Date(t.expiresAt).getTime() <= Date.now()) {
          set({ token: null, customer: null });
          return;
        }
        try {
          const customer = await fetchCustomer(t.accessToken);
          if (!customer) set({ token: null, customer: null });
          else set({ customer });
        } catch (e) {
          console.error("refresh customer failed", e);
        }
      },
    }),
    {
      name: "divina-customer",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, customer: s.customer }),
    }
  )
);
