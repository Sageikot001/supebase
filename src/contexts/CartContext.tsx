'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiProduct } from '@/lib/marketplace';

export interface CartItem {
  api: ApiProduct;
  billingPeriod: 'monthly' | 'yearly';
  selectedLanguages?: string[]; // For localization API
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (apiId: string) => void;
  clearCart: () => void;
  isInCart: (apiId: string) => boolean;
  getTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('supebase_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('supebase_cart');
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('supebase_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.api.id === item.api.id);
      if (existing) {
        return prev.map(i => i.api.id === item.api.id ? item : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (apiId: string) => {
    setItems(prev => prev.filter(i => i.api.id !== apiId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (apiId: string) => {
    return items.some(i => i.api.id === apiId);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      getTotal,
      itemCount: items.length,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
