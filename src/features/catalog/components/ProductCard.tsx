import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '../../../shared/utils/currency';
import { colors, radius, shadow, spacing } from '../../../shared/theme/tokens';
import type { Product } from '../domain/types';
import { variantPrice } from '../domain/types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd?: () => void;
  compact?: boolean;
}

export function ProductCard({ product, onPress, onAdd, compact = false }: ProductCardProps) {
  const variant = product.variants.find(({ stock }) => stock > 0) ?? product.variants[0];
  if (!variant) return null;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <Image source={product.image} style={styles.image} contentFit="cover" transition={180} />
        {product.discountPercent ? (
          <View style={styles.discount}>
            <Text style={styles.discountText}>-{product.discountPercent}%</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.warning} />
          <Text style={styles.meta}>
            {product.rating} · Đã bán {product.sold}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text numberOfLines={1} style={styles.price}>
            {formatCurrency(variantPrice(variant))}
          </Text>
          {onAdd ? (
            <Pressable
              accessibilityLabel="Thêm vào giỏ"
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation();
                onAdd();
              }}
              style={styles.add}
            >
              <Ionicons name="cart-outline" size={18} color={colors.white} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 176,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  compact: { width: '48.5%' },
  pressed: { opacity: 0.9 },
  imageWrap: { height: 154, backgroundColor: colors.surfaceMuted },
  image: { width: '100%', height: '100%' },
  discount: {
    position: 'absolute',
    left: spacing.xs,
    top: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  discountText: { color: colors.white, fontWeight: '800', fontSize: 11 },
  content: { padding: spacing.sm },
  name: { minHeight: 39, fontSize: 14, lineHeight: 19, color: colors.text, fontWeight: '700' },
  ratingRow: { marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 11, color: colors.textSecondary },
  priceRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { flex: 1, color: colors.primary, fontWeight: '900', fontSize: 15 },
  add: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
