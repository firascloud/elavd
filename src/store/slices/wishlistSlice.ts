import { StateCreator } from "zustand";
import { setCookie, getCookie } from "cookies-next";
import { Product } from "@/services/home";

export interface WishlistState {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const COOKIE_NAME = "elavd_wishlist";

const getInitialWishlist = (): Product[] => {
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

export const WishlistSlice: StateCreator<
  WishlistState,
  [],
  [],
  WishlistState
> = (set, get) => ({
  wishlist: getInitialWishlist(),
  
  addToWishlist: (product) => {
    const { wishlist } = get();
    if (!wishlist.find((item) => item.id === product.id)) {
      const newWishlist = [...wishlist, product];
      set({ wishlist: newWishlist });
      setCookie(COOKIE_NAME, JSON.stringify(newWishlist));
    }
  },

  removeFromWishlist: (productId) => {
    const { wishlist } = get();
    const newWishlist = wishlist.filter((item) => item.id !== productId);
    set({ wishlist: newWishlist });
    setCookie(COOKIE_NAME, JSON.stringify(newWishlist));
  },

  toggleWishlist: (product) => {
    const { wishlist, addToWishlist, removeFromWishlist } = get();
    if (wishlist.find((item) => item.id === product.id)) {
      removeFromWishlist(product.id || '');
    } else {
      addToWishlist(product);
    }
  },

  isInWishlist: (productId) => {
    const { wishlist } = get();
    return !!wishlist.find((item) => item.id === productId);
  },
});
