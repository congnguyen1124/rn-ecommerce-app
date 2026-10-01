import { create } from 'zustand';

import type { PaymentMethod } from '../../../app/navigation/types';

interface CheckoutState {
  paymentMethod?: PaymentMethod;
  notes: Record<string, string>;
  personalAdvice: Record<string, boolean>;
  setPaymentMethod: (method: PaymentMethod) => void;
  setNote: (sellerId: string, note: string) => void;
  setPersonalAdvice: (itemId: string, value: boolean) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  notes: {},
  personalAdvice: {},
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setNote: (sellerId, note) => set(({ notes }) => ({ notes: { ...notes, [sellerId]: note } })),
  setPersonalAdvice: (itemId, value) =>
    set(({ personalAdvice }) => ({ personalAdvice: { ...personalAdvice, [itemId]: value } })),
  reset: () => set({ paymentMethod: undefined, notes: {}, personalAdvice: {} }),
}));
