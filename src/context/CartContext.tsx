"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ── Types ─────────────────────────────────────── */

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  /** Variant label when applicable, e.g. "100g" */
  variantLabel?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantLabel?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantLabel?: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

/* ── Helpers ───────────────────────────────────── */

const STORAGE_KEY = "lasromeas-cart";

function itemKey(productId: string, variantLabel?: string) {
  return variantLabel ? `${productId}::${variantLabel}` : productId;
}

function persist(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded – silently ignore */
  }
}

/* ── Reducer ───────────────────────────────────── */

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { quantity = 1, ...rest } = action.payload;
      const key = itemKey(rest.productId, rest.variantLabel);
      const idx = state.items.findIndex(
        (i) => itemKey(i.productId, i.variantLabel) === key,
      );

      let items: CartItem[];
      if (idx >= 0) {
        items = state.items.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + quantity } : item,
        );
      } else {
        items = [...state.items, { ...rest, quantity }];
      }
      persist(items);
      return { ...state, items, isOpen: true };
    }

    case "REMOVE_ITEM": {
      const key = itemKey(action.payload.productId, action.payload.variantLabel);
      const items = state.items.filter(
        (i) => itemKey(i.productId, i.variantLabel) !== key,
      );
      persist(items);
      return { ...state, items };
    }

    case "UPDATE_QUANTITY": {
      const key = itemKey(action.payload.productId, action.payload.variantLabel);
      if (action.payload.quantity <= 0) {
        const items = state.items.filter(
          (i) => itemKey(i.productId, i.variantLabel) !== key,
        );
        persist(items);
        return { ...state, items };
      }
      const items = state.items.map((item) =>
        itemKey(item.productId, item.variantLabel) === key
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      persist(items);
      return { ...state, items };
    }

    case "CLEAR":
      persist([]);
      return { ...state, items: [] };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "HYDRATE":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

/* ── Context ───────────────────────────────────── */

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  /* Hydrate from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      /* corrupted data – ignore */
    }
  }, []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
      dispatch({ type: "ADD_ITEM", payload: item }),
    [],
  );

  const removeItem = useCallback(
    (productId: string, variantLabel?: string) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, variantLabel } }),
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantLabel?: string) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantLabel, quantity } }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
