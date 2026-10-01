import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppButton } from '../../../shared/components/AppButton';
import { AppCheckbox } from '../../../shared/components/AppCheckbox';
import { QuantityStepper } from '../../../shared/components/QuantityStepper';
import { localizeCatalogText } from '../../../shared/i18n/localizeCatalog';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import type { Product, ProductVariant } from '../domain/types';
import { variantPrice } from '../domain/types';

interface VariantSelectorSheetProps {
  visible: boolean;
  product: Product;
  initialVariantId?: string;
  actionLabel: string;
  onClose: () => void;
  onConfirm: (variant: ProductVariant, quantity: number, personalAdvice: boolean) => void;
}

export function VariantSelectorSheet({
  visible,
  product,
  initialVariantId,
  actionLabel,
  onClose,
  onConfirm,
}: VariantSelectorSheetProps) {
  const { t } = useTranslation();
  const initial = useMemo(
    () => product.variants.find(({ id }) => id === initialVariantId) ?? product.variants[0],
    [initialVariantId, product.variants],
  );
  const [variantId, setVariantId] = useState(initial?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [personalAdvice, setPersonalAdvice] = useState(false);
  const variant = product.variants.find(({ id }) => id === variantId) ?? initial;

  if (!variant) return null;
  const selectable = variant.stock > 0 && variant.available !== false;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.indicator} />
          <Pressable onPress={onClose} style={styles.close}>
            <Ionicons name="close" size={24} color={colors.ink} />
          </Pressable>
          <View style={styles.productRow}>
            <Image source={variant.image} style={styles.image} contentFit="cover" />
            <View style={styles.info}>
              <Text style={styles.price}>{formatCurrency(variantPrice(variant))}</Text>
              {variant.discountPrice ? (
                <Text style={styles.original}>{formatCurrency(variant.originalPrice)}</Text>
              ) : null}
              <Text style={[styles.stock, !selectable && styles.stockError]}>
                {selectable ? t('catalog.stock', { count: variant.stock }) : t('catalog.soldOut')}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>{t('catalog.variant')}</Text>
            <View style={styles.chips}>
              {product.variants.map((item) => {
                const selected = item.id === variant.id;
                const label = [item.primaryOption?.label, item.secondaryOption?.label]
                  .filter(Boolean)
                  .map((value) => localizeCatalogText(value!, t))
                  .join(' · ');
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setVariantId(item.id);
                      setQuantity(1);
                    }}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                      item.stock === 0 && styles.chipDisabled,
                    ]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {label || t('catalog.defaultVariant')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.quantityRow}>
              <Text style={styles.sectionTitle}>{t('catalog.quantity')}</Text>
              <QuantityStepper
                value={quantity}
                onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
                onIncrease={() => setQuantity((value) => Math.min(variant.stock, value + 1))}
                decreaseDisabled={quantity <= 1}
                increaseDisabled={!selectable || quantity >= variant.stock}
              />
            </View>
            {product.isPreorder ? (
              <View style={styles.advice}>
                <AppCheckbox
                  checked={personalAdvice}
                  onChange={setPersonalAdvice}
                  label={t('catalog.personalAdvice')}
                />
                <Text style={styles.adviceText}>{t('catalog.adviceDescription')}</Text>
              </View>
            ) : null}
          </ScrollView>
          <AppButton
            label={actionLabel}
            disabled={!selectable}
            onPress={() => onConfirm(variant, quantity, personalAdvice)}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.scrim },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.md,
  },
  indicator: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  close: { position: 'absolute', right: spacing.md, top: spacing.md, zIndex: 2 },
  productRow: { flexDirection: 'row', gap: spacing.md, paddingRight: 40 },
  image: { width: 92, height: 92, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  info: { flex: 1, justifyContent: 'center' },
  price: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  original: {
    marginTop: 3,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    fontSize: 13,
  },
  stock: { marginTop: spacing.xs, color: colors.textSecondary, fontSize: 13 },
  stockError: { color: colors.danger, fontWeight: '700' },
  scroll: { marginVertical: spacing.md },
  scrollContent: { paddingBottom: spacing.md },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  chipDisabled: { opacity: 0.48 },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: colors.primary, fontWeight: '800' },
  quantityRow: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advice: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
  },
  adviceText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: spacing.xs },
});
