import { create, StoreApi } from "zustand";
import { SearchSlice, SearchState } from "./slices/searchSlice";
import { UserStore, UserState } from "./slices/userSlice";
import { LayoutSlice, LayoutState } from "./slices/layoutSlice";
import { WishlistSlice, WishlistState } from "./slices/wishlistSlice";
import { CompareSlice, CompareState } from "./slices/compareSlice";
import { CartSlice, CartState } from "./slices/cartSlice";

export interface AppState extends SearchState, UserState, LayoutState, WishlistState, CompareState, CartState {}

const useAppStore = create<AppState>((set, get, store: StoreApi<AppState>) => ({
  ...SearchSlice(set, get, store),
  ...UserStore(set, get, store),
  ...LayoutSlice(set, get, store as any),
  ...WishlistSlice(set, get, store as any),
  ...CompareSlice(set, get, store as any),
  ...CartSlice(set, get, store as any),
}));

export default useAppStore;
