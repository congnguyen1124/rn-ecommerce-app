import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppCheckbox } from '../../../shared/components/AppCheckbox';
import { QuantityStepper } from '../../../shared/components/QuantityStepper';
import { localizeCatalogText, localizeVariantLabel } from '../../../shared/i18n/localizeCatalog';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import { isOverflow, isSelectable, isSoldOut } from '../domain/cartRules';
import type { CartItem } from '../domain/types';
import { cartImage } from '../utils/cartImage';

interface CartProductRowProps {
  item: CartItem;
  onPress: () => void;
  onToggle: (value: boolean) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onChangeVariant: () => void;
}

export function CartProductRow({
  item,
  onPress,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
  onChangeVariant,
}: CartProductRowProps) {
  const { t } = useTranslation();
  const soldOut = isSoldOut(item);
  const overflow = isOverflow(item);
  const unavailable = !item.variantAvailable;
  return (
    <View style={styles.container}>
      <AppCheckbox
        checked={item.selected}
        disabled={!isSelectable(item)}
        onChange={onToggle}
        testID={`cart-checkbox-${item.id}`}
      />
      <Pressable onPress={onPress} style={styles.imageWrap}>
        <Image source={cartImage(item.imageKey)} style={styles.image} contentFit="cover" />
        {soldOut ? (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>{t('catalog.soldOut')}</Text>
          </View>
        ) : null}
      </Pressable>
      <View style={styles.content}>
        <Pressable onPress={onPress}>
          <Text numberOfLines={1} style={[styles.name, soldOut && styles.muted]}>
            {localizeCatalogText(item.productName, t)}
          </Text>
        </Pressable>
        {item.isPreorder ? <Text style={styles.preorder}>{t('catalog.preorder')}</Text> : null}
        {!unavailable ? (
          <Pressable disabled={soldOut} onPress={onChangeVariant} style={styles.variant}>
            <Text numberOfLines={1} style={styles.variantText}>
              {t('catalog.classification', { value: localizeVariantLabel(item.variantLabel, t) })}
            </Text>
            <Ionicons
              name="chevron-down"
              size={13}
              color={soldOut ? colors.textMuted : colors.text}
            />
          </Pressable>
        ) : (
          <Text style={styles.unavailable}>{t('catalog.variantUnavailable')}</Text>
        )}
        <View style={styles.priceRow}>
          {item.unitPrice !== item.originalPrice ? (
            <Text style={styles.original}>{formatCurrency(item.originalPrice)}</Text>
          ) : null}
          <Text style={[styles.price, soldOut && styles.muted]}>
            {formatCurrency(item.unitPrice)}
          </Text>
        </View>
        {unavailable || soldOut ? (
          <Pressable onPress={onChangeVariant} style={styles.reselect}>
            <Text style={styles.reselectText}>{t('catalog.chooseAnotherVariant')}</Text>
          </Pressable>
        ) : (
          <View style={styles.actionRow}>
            <QuantityStepper
              value={item.quantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              increaseDisabled={item.quantity >= item.stock}
            />
            <Pressable
              accessibilityLabel={t('catalog.removeProduct')}
              onPress={onRemove}
              style={styles.trash}
            >
              <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        )}
        {overflow && item.stock > 0 ? (
          <Text testID={`overflow-${item.id}`} style={styles.overflow}>
            {t('catalog.remaining', { count: item.stock })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  image: { width: '100%', height: '100%' },
  soldOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23,19,31,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  content: { flex: 1, minHeight: 134 },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  muted: { color: colors.textMuted },
  preorder: {
    alignSelf: 'flex-start',
    marginTop: 5,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
    fontSize: 10,
    fontWeight: '800',
  },
  variant: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  variantText: { maxWidth: 160, color: colors.textSecondary, fontSize: 11 },
  unavailable: { color: colors.text, fontSize: 12, marginTop: spacing.xs },
  priceRow: { marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  original: { color: colors.textMuted, fontSize: 11, textDecorationLine: 'line-through' },
  price: { color: colors.primary, fontSize: 14, fontWeight: '900' },
  actionRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trash: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  reselect: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  reselectText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  overflow: { color: colors.danger, fontSize: 11, fontWeight: '600', marginTop: spacing.xs },
});
