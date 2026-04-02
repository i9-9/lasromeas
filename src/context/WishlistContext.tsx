"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  slug: string;
  categorySlug: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "TOGGLE_ITEM"; payload: WishlistItem }
  | { type: "HYDRATE"; payload: WishlistItem[] };

interface WishlistContextValue {
  items: WishlistItem[];
  totalItems: number;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
}

const STORAGE_KEY = "lasromeas-wishlist";

function persist(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded */
  }
}

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "TOGGLE_ITEM": {
      const exists = state.items.some(
        (i) => i.productId === action.payload.productId
      );
      const items = exists
        ? state.items.filter((i) => i.productId !== action.payload.productId)
        : [...state.items, action.payload];
      persist(items);
      return { items };
    }
    case "HYDRATE":
      return { items: action.payload };
    default:
      return state;
  }
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
        if (Array.isArray(parsed))
          dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      /* corrupted data */
    }
  }, []);

  const toggleItem = useCallback(
    (item: WishlistItem) =>
      dispatch({ type: "TOGGLE_ITEM", payload: item }),
    []
  );

  const isInWishlist = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        totalItems: state.items.length,
        toggleItem,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
