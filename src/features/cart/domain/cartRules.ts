import type { CartGroup, CartItem, CartSummary } from './types';

export const isOverflow = (item: CartItem) => item.quantity > item.stock;

export const isSoldOut = (item: CartItem) => item.stock === 0;

export const isSelectable = (item: CartItem) =>
  item.productStatus === 'normal' && item.variantAvailable && !isSoldOut(item) && !isOverflow(item);

export const summarizeCart = (groups: CartGroup[]): CartSummary => {
  const items = groups.flatMap(({ items: groupItems }) => groupItems);
  const selectedItems = items.filter(({ selected }) => selected);
  return {
    itemCount: items.length,
    selectedCount: selectedItems.length,
    total: selectedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    allGroupsSelected: groups.length > 0 && groups.every(({ selected }) => selected),
    checkoutEnabled: selectedItems.length > 0,
  };
};

export const selectAll = (groups: CartGroup[], selected: boolean): CartGroup[] =>
  groups.map((group) => ({
    ...group,
    selected,
    items: group.items.map((item) => ({
      ...item,
      selected: selected && isSelectable(item),
    })),
  }));

export const selectGroup = (
  groups: CartGroup[],
  sellerId: string,
  selected: boolean,
): CartGroup[] =>
  groups.map((group) =>
    group.sellerId !== sellerId
      ? group
      : {
          ...group,
          selected,
          items: group.items.map((item) => ({
            ...item,
            selected: selected && isSelectable(item),
          })),
        },
  );

export const selectItem = (groups: CartGroup[], itemId: string, selected: boolean): CartGroup[] =>
  groups.map((group) => {
    if (!group.items.some(({ id }) => id === itemId)) return group;
    const items = group.items.map((item) =>
      item.id === itemId && (!selected || isSelectable(item)) ? { ...item, selected } : item,
    );
    return {
      ...group,
      items,
      // Android counts every product in the profile. An invalid, unselected item keeps
      // the profile checkbox off even when every selectable item is checked.
      selected: items.length > 0 && items.every((item) => item.selected),
    };
  });

export const updateQuantity = (
  groups: CartGroup[],
  itemId: string,
  direction: 'increase' | 'decrease',
): CartGroup[] =>
  groups.map((group) => {
    if (!group.items.some(({ id }) => id === itemId)) return group;
    const items = group.items.map((item) => {
      if (item.id !== itemId) return item;
      const quantity =
        direction === 'increase'
          ? Math.min(item.quantity + 1, item.stock)
          : Math.max(1, item.quantity - 1);
      const nextItem = { ...item, quantity };
      return isSelectable(nextItem) ? nextItem : { ...nextItem, selected: false };
    });
    return { ...group, items, selected: items.every(({ selected }) => selected) };
  });

export const removeItems = (groups: CartGroup[], itemIds: string[]): CartGroup[] =>
  groups.flatMap((group) => {
    const items = group.items.filter(({ id }) => !itemIds.includes(id));
    if (items.length === 0) return [];
    return [{ ...group, items, selected: items.every(({ selected }) => selected) }];
  });

export const replaceVariant = (
  groups: CartGroup[],
  itemId: string,
  replacement: Pick<
    CartItem,
    'variantId' | 'variantLabel' | 'stock' | 'unitPrice' | 'originalPrice' | 'variantAvailable'
  >,
  quantity = 1,
): CartGroup[] =>
  groups.map((group) => {
    if (!group.items.some(({ id }) => id === itemId)) return group;
    const items = group.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...replacement,
            quantity: Math.max(1, Math.min(quantity, replacement.stock)),
            selected: false,
          }
        : item,
    );
    return { ...group, items, selected: false };
  });
