import { StateCreator } from "zustand";
import { setCookie, getCookie } from "cookies-next";
import { Product } from "@/services/home";

export interface CompareState {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const COOKIE_NAME = "dneest_compare";

const getInitialCompare = (): Product[] => {
  const saved = getCookie(COOKIE_NAME);
  if (typeof saved === "string") {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const CompareSlice: StateCreator<
  CompareState,
  [],
  [],
  CompareState
> = (set, get) => ({
  compareItems: getInitialCompare(),

  addToCompare: (product) => {
    const { compareItems } = get();
    if (compareItems.length >= 4) {
      // Limit to 4 items for comparison
      return;
    }
    if (!compareItems.find((item) => item.id === product.id)) {
      const newItems = [...compareItems, product];
      set({ compareItems: newItems });
      setCookie(COOKIE_NAME, JSON.stringify(newItems));
    }
  },

  removeFromCompare: (productId) => {
    const { compareItems } = get();
    const newItems = compareItems.filter((item) => item.id !== productId);
    set({ compareItems: newItems });
    setCookie(COOKIE_NAME, JSON.stringify(newItems));
  },

  clearCompare: () => {
    set({ compareItems: [] });
    setCookie(COOKIE_NAME, JSON.stringify([]));
  },

  isInCompare: (productId) => {
    const { compareItems } = get();
    return !!compareItems.find((item) => item.id === productId);
  },
});
