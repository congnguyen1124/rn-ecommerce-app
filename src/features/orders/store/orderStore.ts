import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { initialOrders } from '../data/dummyOrders';
import type { OrderRecord } from '../domain/types';

interface OrderState {
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  markPaid: (orderId: string) => void;
  confirmReceived: (orderId: string) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: initialOrders,
      addOrder: (order) => set(({ orders }) => ({ orders: [order, ...orders] })),
      markPaid: (orderId) =>
        set(({ orders }) => ({
          orders: orders.map((order) =>
            order.id === orderId || order.id.startsWith(`${orderId}-`)
              ? { ...order, status: 'waiting_confirm' }
              : order,
          ),
        })),
      confirmReceived: (orderId) =>
        set(({ orders }) => ({
          orders: orders.map((order) =>
            order.id === orderId ? { ...order, status: 'done' } : order,
          ),
        })),
      reset: () => set({ orders: initialOrders }),
    }),
    { name: 'on-plus-orders-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
