import { StateCreator } from "zustand";
import { setCookie, getCookie } from "cookies-next";
import { Product } from "@/services/home";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const COOKIE_NAME = "dneest_cart";

const getInitialCart = (): CartItem[] => {
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

export const CartSlice: StateCreator<
  CartState,
  [],
  [],
  CartState
> = (set, get) => ({
  cartItems: getInitialCart(),

  addToCart: (product, quantity = 1) => {
    const { cartItems } = get();
    const existing = cartItems.find((item) => item.id === product.id);
    let newItems: CartItem[];
    if (existing) {
      newItems = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newItems = [...cartItems, { ...product, quantity }];
    }
    set({ cartItems: newItems });
    setCookie(COOKIE_NAME, JSON.stringify(newItems));
  },

  removeFromCart: (productId) => {
    const { cartItems } = get();
    const newItems = cartItems.filter((item) => item.id !== productId);
    set({ cartItems: newItems });
    setCookie(COOKIE_NAME, JSON.stringify(newItems));
  },

  updateQuantity: (productId, quantity) => {
    const { cartItems } = get();
    if (quantity < 1) return;
    const newItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set({ cartItems: newItems });
    setCookie(COOKIE_NAME, JSON.stringify(newItems));
  },

  clearCart: () => {
    set({ cartItems: [] });
    setCookie(COOKIE_NAME, JSON.stringify([]));
  },

  getCartCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  },

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  },
});
