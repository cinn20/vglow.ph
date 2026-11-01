"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const CART_STORAGE_KEY = "vglow-cart-v2";

export type CartLine = {
  id: string;
  productId: number;
  slug: string;
  name: string;
  size: string;
  image: string;
  unitPriceCents: number;
  compareAtCents?: number | null;
  quantity: number;
  maxQuantity: number;
};

type CartContextValue = {
  items: CartLine[];
  isOpen: boolean;
  hydrated: boolean;
  itemCount: number;
  subtotalCents: number;
  savingsCents: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    item: Omit<CartLine, "id" | "quantity"> & { quantity?: number },
    options?: { openDrawer?: boolean },
  ) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  lastAddedId: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.id === "string" &&
    typeof line.productId === "number" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.size === "string" &&
    typeof line.image === "string" &&
    typeof line.unitPriceCents === "number" &&
    typeof line.quantity === "number"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isCartLine));
        }
      }
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or unavailable
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>((item, options) => {
    const id = `${item.productId}:${item.size}`;
    const quantity = Math.max(1, item.quantity ?? 1);
    setItems((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) =>
          line.id === id
            ? {
                ...line,
                quantity: Math.min(line.maxQuantity, line.quantity + quantity),
              }
            : line,
        );
      }
      return [...current, { ...item, id, quantity }];
    });
    setLastAddedId(id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLastAddedId(null), 2600);
    if (options?.openDrawer !== false) setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((line) => line.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((line) =>
          line.id === id
            ? { ...line, quantity: Math.min(line.maxQuantity, Math.max(0, quantity)) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, line) => total + line.quantity, 0);
    const subtotalCents = items.reduce(
      (total, line) => total + line.unitPriceCents * line.quantity,
      0,
    );
    const savingsCents = items.reduce((total, line) => {
      if (!line.compareAtCents || line.compareAtCents <= line.unitPriceCents) return total;
      return total + (line.compareAtCents - line.unitPriceCents) * line.quantity;
    }, 0);

    return {
      items,
      isOpen,
      hydrated,
      itemCount,
      subtotalCents,
      savingsCents,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      lastAddedId,
    };
  }, [
    items,
    isOpen,
    hydrated,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    lastAddedId,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
