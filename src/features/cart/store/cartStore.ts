import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Product, ProductVariant, Seller } from '../../catalog/domain/types';
import { variantPrice } from '../../catalog/domain/types';
import { initialCartGroups } from '../data/dummyCart';
import {
  removeItems,
  replaceVariant,
  selectAll,
  selectGroup,
  selectItem,
  updateQuantity,
} from '../domain/cartRules';
import type { CartGroup, ProductImageKey } from '../domain/types';

interface CartState {
  groups: CartGroup[];
  pendingRemovalId?: string;
  addToCart: (
    product: Product,
    variant: ProductVariant,
    seller: Seller,
    quantity: number,
    personalAdvice?: boolean,
  ) => void;
  toggleAll: (selected: boolean) => void;
  toggleGroup: (sellerId: string, selected: boolean) => void;
  toggleItem: (itemId: string, selected: boolean) => void;
  increase: (itemId: string) => void;
  decrease: (itemId: string) => void;
  requestRemove: (itemId: string) => void;
  cancelRemove: () => void;
  confirmRemove: () => void;
  remove: (itemId: string) => void;
  changeVariant: (itemId: string, variant: ProductVariant, quantity?: number) => void;
  clearPurchased: (itemIds: string[]) => void;
  reset: () => void;
}

const imageKeyFor = (productId: string): ProductImageKey => {
  if (productId === 'earbuds-airy') return 'earbuds';
  if (productId === 'serum-glow') return 'skincare';
  return 'hero';
};

let sequence = 100;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      groups: initialCartGroups,
      addToCart: (product, variant, seller, quantity, personalAdvice = false) =>
        set((state) => {
          const existingGroup = state.groups.find(({ sellerId }) => sellerId === seller.id);
          const existingItem = existingGroup?.items.find(
            ({ variantId }) => variantId === variant.id,
          );
          if (existingGroup && existingItem) {
            return {
              groups: state.groups.map((group) =>
                group.sellerId !== seller.id
                  ? group
                  : {
                      ...group,
                      selected: false,
                      items: group.items.map((item) =>
                        item.id !== existingItem.id
                          ? item
                          : {
                              ...item,
                              quantity: item.quantity + quantity,
                              selected: false,
                            },
                      ),
                    },
              ),
            };
          }
          sequence += 1;
          const newItem = {
            id: `cart-${sequence}`,
            productId: product.id,
            variantId: variant.id,
            sellerId: seller.id,
            productName: product.name,
            variantLabel: [variant.primaryOption?.label, variant.secondaryOption?.label]
              .filter(Boolean)
              .join(', '),
            imageKey: imageKeyFor(product.id),
            quantity,
            stock: variant.stock,
            unitPrice: variantPrice(variant),
            originalPrice: variant.originalPrice,
            selected: false,
            productStatus: product.status,
            variantAvailable: variant.available !== false,
            isPreorder: product.isPreorder === true,
            personalAdvice,
          } as const;
          return {
            groups: existingGroup
              ? state.groups.map((group) =>
                  group.sellerId === seller.id
                    ? { ...group, selected: false, items: [...group.items, newItem] }
                    : group,
                )
              : [
                  ...state.groups,
                  {
                    sellerId: seller.id,
                    sellerName: seller.name,
                    sellerColor: seller.avatarColor,
                    selected: false,
                    items: [newItem],
                  },
                ],
          };
        }),
      toggleAll: (selected) => set(({ groups }) => ({ groups: selectAll(groups, selected) })),
      toggleGroup: (sellerId, selected) =>
        set(({ groups }) => ({ groups: selectGroup(groups, sellerId, selected) })),
      toggleItem: (itemId, selected) =>
        set(({ groups }) => ({ groups: selectItem(groups, itemId, selected) })),
      increase: (itemId) =>
        set(({ groups }) => ({ groups: updateQuantity(groups, itemId, 'increase') })),
      decrease: (itemId) =>
        set(({ groups }) => {
          const item = groups.flatMap(({ items }) => items).find(({ id }) => id === itemId);
          if (!item) return { groups };
          if (item.quantity === 1) return { groups, pendingRemovalId: itemId };
          return { groups: updateQuantity(groups, itemId, 'decrease') };
        }),
      requestRemove: (itemId) => set({ pendingRemovalId: itemId }),
      cancelRemove: () => set({ pendingRemovalId: undefined }),
      confirmRemove: () =>
        set(({ groups, pendingRemovalId }) => ({
          groups: pendingRemovalId ? removeItems(groups, [pendingRemovalId]) : groups,
          pendingRemovalId: undefined,
        })),
      remove: (itemId) => set(({ groups }) => ({ groups: removeItems(groups, [itemId]) })),
      changeVariant: (itemId, variant, quantity = 1) =>
        set(({ groups }) => ({
          groups: replaceVariant(
            groups,
            itemId,
            {
              variantId: variant.id,
              variantLabel: [variant.primaryOption?.label, variant.secondaryOption?.label]
                .filter(Boolean)
                .join(', '),
              stock: variant.stock,
              unitPrice: variantPrice(variant),
              originalPrice: variant.originalPrice,
              variantAvailable: variant.available !== false,
            },
            quantity,
          ),
        })),
      clearPurchased: (itemIds) => set(({ groups }) => ({ groups: removeItems(groups, itemIds) })),
      reset: () => set({ groups: initialCartGroups, pendingRemovalId: undefined }),
    }),
    {
      name: 'on-plus-cart-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ groups }) => ({ groups }),
    },
  ),
);
