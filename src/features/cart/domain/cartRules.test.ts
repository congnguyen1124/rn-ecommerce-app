import { initialCartGroups } from '../data/dummyCart';
import {
  isOverflow,
  isSelectable,
  isSoldOut,
  removeItems,
  replaceVariant,
  selectAll,
  selectGroup,
  selectItem,
  summarizeCart,
  updateQuantity,
} from './cartRules';
import type { CartGroup, CartItem } from './types';

const validItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  productId: 'product-1',
  variantId: 'variant-1',
  sellerId: 'seller-1',
  productName: 'Sản phẩm',
  variantLabel: 'Tím',
  imageKey: 'earbuds',
  quantity: 1,
  stock: 5,
  unitPrice: 100_000,
  originalPrice: 120_000,
  selected: false,
  productStatus: 'normal',
  variantAvailable: true,
  isPreorder: false,
  personalAdvice: false,
  ...overrides,
});

const group = (items: CartItem[], selected = false, sellerId = 'seller-1'): CartGroup => ({
  sellerId,
  sellerName: `Shop ${sellerId}`,
  sellerColor: '#000000',
  selected,
  items,
});

describe('cart inventory rules mirrored from OrderCartViewModel', () => {
  describe('stock state', () => {
    it('only marks a quantity strictly greater than stock as overflow', () => {
      expect(isOverflow(validItem({ quantity: 4, stock: 4 }))).toBe(false);
      expect(isOverflow(validItem({ quantity: 5, stock: 4 }))).toBe(true);
    });

    it('marks every positive quantity as overflow when stock is zero', () => {
      expect(isOverflow(validItem({ quantity: 1, stock: 0 }))).toBe(true);
      expect(isSoldOut(validItem({ stock: 0 }))).toBe(true);
    });

    it.each([
      ['overflow', { quantity: 6, stock: 5 }],
      ['sold out', { stock: 0 }],
      ['unlisted product', { productStatus: 'unlisted' as const }],
      ['unavailable variant', { variantAvailable: false }],
    ])('does not allow selecting an %s item', (_name, overrides) => {
      expect(isSelectable(validItem(overrides))).toBe(false);
    });

    it('allows selecting quantity exactly equal to stock', () => {
      expect(isSelectable(validItem({ quantity: 5, stock: 5 }))).toBe(true);
    });
  });

  describe('selection and totals', () => {
    it('calculates total from selected items only', () => {
      const groups = [
        group([
          validItem({ id: 'a', selected: true, quantity: 2, unitPrice: 100_000 }),
          validItem({ id: 'b', selected: false, quantity: 9, unitPrice: 900_000 }),
          validItem({ id: 'c', selected: true, quantity: 3, unitPrice: 50_000 }),
        ]),
      ];
      expect(summarizeCart(groups)).toMatchObject({
        itemCount: 3,
        selectedCount: 2,
        total: 350_000,
        checkoutEnabled: true,
      });
    });

    it('disables checkout with no selected product', () => {
      expect(summarizeCart([group([validItem()])]).checkoutEnabled).toBe(false);
    });

    it('select all checks every profile but skips overflow and sold-out products', () => {
      const result = selectAll(
        [
          group([
            validItem({ id: 'valid' }),
            validItem({ id: 'overflow', quantity: 6 }),
            validItem({ id: 'sold', stock: 0 }),
          ]),
        ],
        true,
      );
      expect(result[0]?.selected).toBe(true);
      expect(result[0]?.items.map(({ selected }) => selected)).toEqual([true, false, false]);
      expect(summarizeCart(result).allGroupsSelected).toBe(true);
    });

    it('deselect all clears profiles and every product', () => {
      const result = selectAll([group([validItem({ selected: true })], true)], false);
      expect(result[0]?.selected).toBe(false);
      expect(result[0]?.items[0]?.selected).toBe(false);
    });

    it('select profile only changes the targeted seller', () => {
      const result = selectGroup(
        [
          group([validItem()], false, 'one'),
          group([validItem({ id: 'two-item', sellerId: 'two' })], false, 'two'),
        ],
        'two',
        true,
      );
      expect(result[0]?.items[0]?.selected).toBe(false);
      expect(result[1]?.items[0]?.selected).toBe(true);
      expect(result[1]?.selected).toBe(true);
    });

    it('select profile leaves invalid items unchecked', () => {
      const result = selectGroup(
        [group([validItem(), validItem({ id: 'bad', quantity: 10 })])],
        'seller-1',
        true,
      );
      expect(result[0]?.items.map(({ selected }) => selected)).toEqual([true, false]);
    });

    it('checking the final product checks its profile', () => {
      const result = selectItem(
        [group([validItem({ id: 'a', selected: true }), validItem({ id: 'b' })])],
        'b',
        true,
      );
      expect(result[0]?.selected).toBe(true);
    });

    it('unchecking one product unchecks its profile', () => {
      const result = selectItem(
        [
          group(
            [validItem({ id: 'a', selected: true }), validItem({ id: 'b', selected: true })],
            true,
          ),
        ],
        'a',
        false,
      );
      expect(result[0]?.selected).toBe(false);
      expect(result[0]?.items[1]?.selected).toBe(true);
    });

    it('an invalid item keeps the profile unchecked like the Android item count logic', () => {
      const result = selectItem(
        [group([validItem({ id: 'valid' }), validItem({ id: 'invalid', stock: 0 })])],
        'valid',
        true,
      );
      expect(result[0]?.items[0]?.selected).toBe(true);
      expect(result[0]?.selected).toBe(false);
    });

    it('ignores attempts to select an overflow item even outside the UI', () => {
      const result = selectItem(
        [group([validItem({ id: 'overflow', quantity: 6 })])],
        'overflow',
        true,
      );
      expect(result[0]?.items[0]?.selected).toBe(false);
    });
  });

  describe('quantity boundaries', () => {
    it('increments normally below stock', () => {
      const result = updateQuantity(
        [group([validItem({ quantity: 3, stock: 5 })])],
        'item-1',
        'increase',
      );
      expect(result[0]?.items[0]?.quantity).toBe(4);
    });

    it('never increments beyond stock', () => {
      const result = updateQuantity(
        [group([validItem({ quantity: 5, stock: 5 })])],
        'item-1',
        'increase',
      );
      expect(result[0]?.items[0]?.quantity).toBe(5);
    });

    it('normalizes an overflow quantity down to stock if increase is invoked programmatically', () => {
      const result = updateQuantity(
        [group([validItem({ quantity: 8, stock: 5, selected: true })])],
        'item-1',
        'increase',
      );
      expect(result[0]?.items[0]?.quantity).toBe(5);
    });

    it('does not decrement below one at the pure rule layer', () => {
      const result = updateQuantity([group([validItem({ quantity: 1 })])], 'item-1', 'decrease');
      expect(result[0]?.items[0]?.quantity).toBe(1);
    });

    it('deselects an item while it remains overflow after decrement', () => {
      const result = updateQuantity(
        [group([validItem({ quantity: 7, stock: 5, selected: true })], true)],
        'item-1',
        'decrease',
      );
      expect(result[0]?.items[0]).toMatchObject({ quantity: 6, selected: false });
      expect(result[0]?.selected).toBe(false);
    });
  });

  describe('removal and variant replacement', () => {
    it('removes the seller profile when its last product is removed', () => {
      expect(removeItems([group([validItem()])], ['item-1'])).toEqual([]);
    });

    it('keeps a seller profile while it still has another product', () => {
      const result = removeItems([group([validItem({ id: 'a' }), validItem({ id: 'b' })])], ['a']);
      expect(result).toHaveLength(1);
      expect(result[0]?.items.map(({ id }) => id)).toEqual(['b']);
    });

    it('selects a profile after removing its only unselected product', () => {
      const result = removeItems(
        [group([validItem({ id: 'selected', selected: true }), validItem({ id: 'unselected' })])],
        ['unselected'],
      );
      expect(result[0]?.selected).toBe(true);
    });

    it('can remove multiple items across multiple profiles', () => {
      const result = removeItems(
        [
          group([validItem({ id: 'a' })], false, 'one'),
          group(
            [validItem({ id: 'b', sellerId: 'two' }), validItem({ id: 'c', sellerId: 'two' })],
            false,
            'two',
          ),
        ],
        ['a', 'c'],
      );
      expect(result).toHaveLength(1);
      expect(result[0]?.sellerId).toBe('two');
      expect(result[0]?.items[0]?.id).toBe('b');
    });

    it('resets selection and clamps quantity to replacement stock', () => {
      const result = replaceVariant(
        [group([validItem({ selected: true, quantity: 4 })], true)],
        'item-1',
        {
          variantId: 'new',
          variantLabel: 'Mới',
          stock: 2,
          unitPrice: 90_000,
          originalPrice: 100_000,
          variantAvailable: true,
        },
        8,
      );
      expect(result[0]?.selected).toBe(false);
      expect(result[0]?.items[0]).toMatchObject({ variantId: 'new', quantity: 2, selected: false });
    });
  });

  it('dummy data intentionally contains both sold-out and overflow scenarios', () => {
    const items = initialCartGroups.flatMap(({ items }) => items);
    expect(items.some(isSoldOut)).toBe(true);
    expect(items.some(isOverflow)).toBe(true);
  });
});
