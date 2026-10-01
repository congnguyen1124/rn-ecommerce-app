import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { initialAddresses } from '../data/dummyAddresses';
import type { AreaSelection, ShippingAddress } from '../domain/types';

interface AddressState {
  addresses: ShippingAddress[];
  selectedId?: string;
  areaDraft?: AreaSelection;
  select: (id: string) => void;
  setAreaDraft: (area?: AreaSelection) => void;
  upsert: (address: ShippingAddress) => void;
  remove: (id: string) => boolean;
  reset: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: initialAddresses,
      selectedId: initialAddresses[0]?.id,
      select: (selectedId) => set({ selectedId }),
      setAreaDraft: (areaDraft) => set({ areaDraft }),
      upsert: (address) =>
        set(({ addresses }) => {
          const normalized = address.isDefault
            ? addresses.map((item) => ({ ...item, isDefault: false }))
            : addresses;
          const exists = normalized.some(({ id }) => id === address.id);
          return {
            addresses: exists
              ? normalized.map((item) => (item.id === address.id ? address : item))
              : [...normalized, address],
            selectedId: get().selectedId ?? address.id,
          };
        }),
      remove: (id) => {
        const address = get().addresses.find((item) => item.id === id);
        if (!address || address.isDefault) return false;
        set(({ addresses, selectedId }) => ({
          addresses: addresses.filter((item) => item.id !== id),
          selectedId: selectedId === id ? addresses.find((item) => item.id !== id)?.id : selectedId,
        }));
        return true;
      },
      reset: () =>
        set({
          addresses: initialAddresses,
          selectedId: initialAddresses[0]?.id,
          areaDraft: undefined,
        }),
    }),
    {
      name: 'on-plus-address-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ addresses, selectedId }) => ({ addresses, selectedId }),
    },
  ),
);
