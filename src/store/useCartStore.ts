/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stockQuantity) return;
          
          set({
            items: currentItems.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          if (quantity > product.stockQuantity) return;
          set({
            items: [
              ...currentItems,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
                quantity,
                stockQuantity: product.stockQuantity,
              },
            ],
          });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item || quantity < 1 || quantity > item.stockQuantity) return;

        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getSubtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'mahmud-telecom-cart',
    }
  )
);
