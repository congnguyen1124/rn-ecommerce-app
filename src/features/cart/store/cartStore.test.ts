import { getProduct, getSeller } from '../../catalog/data/dummyCatalog';
import { initialCartGroups } from '../data/dummyCart';
import { useCartStore } from './cartStore';

describe('cart Zustand store', () => {
  beforeEach(() => {
    useCartStore.getState().reset();
  });

  it('opens remove confirmation instead of decrementing quantity one', () => {
    useCartStore.setState({
      groups: initialCartGroups.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === 'cart-earbuds' ? { ...item, quantity: 1 } : item,
        ),
      })),
    });
    useCartStore.getState().decrease('cart-earbuds');
    const state = useCartStore.getState();
    expect(state.pendingRemovalId).toBe('cart-earbuds');
    expect(state.groups[0]?.items[0]?.quantity).toBe(1);
  });

  it('decrements immediately above quantity one', () => {
    useCartStore.getState().decrease('cart-earbuds');
    expect(useCartStore.getState().groups[0]?.items[0]?.quantity).toBe(1);
    expect(useCartStore.getState().pendingRemovalId).toBeUndefined();
  });

  it('canceling remove preserves the item', () => {
    const state = useCartStore.getState();
    state.requestRemove('cart-earbuds');
    state.cancelRemove();
    expect(useCartStore.getState().pendingRemovalId).toBeUndefined();
    expect(useCartStore.getState().groups[0]?.items.some(({ id }) => id === 'cart-earbuds')).toBe(
      true,
    );
  });

  it('confirming remove deletes the item and closes the dialog', () => {
    const state = useCartStore.getState();
    state.requestRemove('cart-earbuds');
    state.confirmRemove();
    expect(useCartStore.getState().pendingRemovalId).toBeUndefined();
    expect(useCartStore.getState().groups[0]?.items.some(({ id }) => id === 'cart-earbuds')).toBe(
      false,
    );
  });

  it('deletes the entire profile when clearing its last item', () => {
    useCartStore.getState().clearPurchased(['cart-serum']);
    expect(useCartStore.getState().groups.some(({ sellerId }) => sellerId === 'studio-haru')).toBe(
      false,
    );
  });

  it('adding an existing variant accumulates quantity and can create overflow', () => {
    const product = getProduct('earbuds-airy')!;
    const variant = product.variants.find(({ id }) => id === 'earbuds-lilac')!;
    const seller = getSeller(product.sellerId)!;
    useCartStore.getState().addToCart(product, variant, seller, 4);
    const item = useCartStore.getState().groups[0]?.items.find(({ id }) => id === 'cart-earbuds');
    expect(item).toMatchObject({ quantity: 6, selected: false });
  });

  it('adding a new variant appends an unselected item to its seller group', () => {
    const product = getProduct('earbuds-airy')!;
    const variant = product.variants.find(({ id }) => id === 'earbuds-cream')!;
    const seller = getSeller(product.sellerId)!;
    useCartStore.getState().addToCart(product, variant, seller, 2);
    const item = useCartStore
      .getState()
      .groups[0]?.items.find(({ variantId }) => variantId === 'earbuds-cream');
    expect(item).toMatchObject({ quantity: 2, selected: false, stock: 8 });
  });

  it('changing a variant uses the requested quantity but never exceeds stock', () => {
    const product = getProduct('earbuds-airy')!;
    const variant = product.variants.find(({ id }) => id === 'earbuds-cream')!;
    useCartStore.getState().changeVariant('cart-earbuds', variant, 99);
    expect(useCartStore.getState().groups[0]?.items[0]).toMatchObject({
      variantId: 'earbuds-cream',
      quantity: 8,
      selected: false,
    });
  });

  it('select all keeps initial overflow and sold-out dummy items unchecked', () => {
    useCartStore.getState().toggleAll(true);
    const items = useCartStore.getState().groups.flatMap(({ items }) => items);
    expect(items.find(({ id }) => id === 'cart-earbuds')?.selected).toBe(true);
    expect(items.find(({ id }) => id === 'cart-tote')?.selected).toBe(false);
    expect(items.find(({ id }) => id === 'cart-serum')?.selected).toBe(false);
  });
});
