import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCheckbox } from '../../../shared/components/AppCheckbox';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import { getProduct } from '../../catalog/data/dummyCatalog';
import type { ProductVariant } from '../../catalog/domain/types';
import { VariantSelectorSheet } from '../../catalog/components/VariantSelectorSheet';
import { summarizeCart } from '../domain/cartRules';
import { useCartStore } from '../store/cartStore';
import { CartProductRow } from '../components/CartProductRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const groups = useCartStore(({ groups: value }) => value);
  const pendingRemovalId = useCartStore(({ pendingRemovalId: value }) => value);
  const actions = useCartStore();
  const [editingItemId, setEditingItemId] = useState<string>();
  const editingItem = groups.flatMap(({ items }) => items).find(({ id }) => id === editingItemId);
  const editingProduct = editingItem ? getProduct(editingItem.productId) : undefined;
  const summary = summarizeCart(groups);
  const selectedIds = groups
    .flatMap(({ items }) => items)
    .filter(({ selected }) => selected)
    .map(({ id }) => id);

  if (groups.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScreenHeader title={t('cart.title')} />
        <EmptyState
          icon="cart-outline"
          title={t('cart.emptyTitle')}
          message={t('cart.emptyMessage')}
          actionLabel={t('cart.continueShopping')}
          onAction={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  const updateVariant = (variant: ProductVariant, quantity: number) => {
    if (editingItemId) actions.changeVariant(editingItemId, variant, quantity);
    setEditingItemId(undefined);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={t('cart.titleWithCount', { count: summary.itemCount })} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {groups.map((group) => (
          <View key={group.sellerId} style={styles.group}>
            <View style={styles.groupHeader}>
              <AppCheckbox
                checked={group.selected}
                onChange={(value) => actions.toggleGroup(group.sellerId, value)}
              />
              <View style={[styles.sellerAvatar, { backgroundColor: group.sellerColor }]}>
                <Text style={styles.sellerAvatarText}>{group.sellerName.slice(0, 1)}</Text>
              </View>
              <Text style={styles.sellerName}>{group.sellerName}</Text>
            </View>
            {group.items.map((item) => (
              <View key={item.id} style={styles.itemBorder}>
                <CartProductRow
                  item={item}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { productId: item.productId })
                  }
                  onToggle={(value) => actions.toggleItem(item.id, value)}
                  onIncrease={() => actions.increase(item.id)}
                  onDecrease={() => actions.decrease(item.id)}
                  onRemove={() => actions.requestRemove(item.id)}
                  onChangeVariant={() => setEditingItemId(item.id)}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.paymentBar}>
        <View style={styles.summaryRow}>
          <AppCheckbox
            checked={summary.allGroupsSelected}
            onChange={actions.toggleAll}
            label={t('cart.totalWithCount', { count: summary.selectedCount })}
          />
          <Text testID="cart-total" style={styles.total}>
            {formatCurrency(summary.total)}
          </Text>
        </View>
        <AppButton
          testID="checkout-button"
          label={t('cart.checkout')}
          disabled={!summary.checkoutEnabled}
          onPress={() => navigation.navigate('Checkout', { cartItemIds: selectedIds })}
        />
      </View>
      <ConfirmModal
        visible={Boolean(pendingRemovalId)}
        message={t('cart.removeMessage')}
        onCancel={actions.cancelRemove}
        onConfirm={actions.confirmRemove}
      />
      {editingProduct ? (
        <VariantSelectorSheet
          visible
          product={editingProduct}
          initialVariantId={editingItem?.variantId}
          actionLabel={t('common.confirm')}
          onClose={() => setEditingItemId(undefined)}
          onConfirm={updateVariant}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: 142 },
  group: { marginTop: spacing.xs, backgroundColor: colors.surface },
  groupHeader: {
    height: 62,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sellerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: { color: colors.white, fontWeight: '900' },
  sellerName: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  itemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  paymentBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  total: { color: colors.ink, fontSize: 18, fontWeight: '900' },
});
