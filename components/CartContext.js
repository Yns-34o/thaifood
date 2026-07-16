'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const addToCart = useCallback((name, price, image) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) =>
          i.name === name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { name, price, image, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const updateQty = useCallback((name, delta) => {
    setItems((prev) =>
      prev
        .flatMap((i) => {
          if (i.name !== name) return [i];
          const qty = i.qty + delta;
          return qty <= 0 ? [] : [{ ...i, qty }];
        })
    );
  }, []);

  const removeItem = useCallback((name) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback(() => {
    if (items.length === 0) return;
    setLastOrder({ items, total: totalValue(items), date: new Date().toLocaleString('fr-FR') });
    setItems([]);
    setOpen(false);
  }, [items]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = totalValue(items);

  const value = useMemo(
    () => ({
      items, open, setOpen, addToCart, updateQty, removeItem, clearCart,
      checkout, count, total, lastOrder,
    }),
    [items, open, addToCart, updateQty, removeItem, clearCart, checkout, count, total, lastOrder]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function totalValue(items) {
  return items.reduce((s, i) => s + i.qty * i.price, 0);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit etre utilise dans un CartProvider');
  return ctx;
}
