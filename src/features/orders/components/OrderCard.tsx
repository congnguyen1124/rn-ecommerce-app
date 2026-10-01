import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../../shared/components/AppButton';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import { cartImage } from '../../cart/utils/cartImage';
import { orderStatusLabel, type OrderRecord } from '../domain/types';

interface OrderCardProps {
  order: OrderRecord;
  onDetail: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function OrderCard({ order, onDetail, onAction, actionLabel }: OrderCardProps) {
  const preview = order.lines[0];
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.shopIcon}>
          <Text style={styles.shopInitial}>{order.sellerName.slice(0, 1)}</Text>
        </View>
        <Text style={styles.shop}>{order.sellerName}</Text>
        <Text style={styles.status}>{orderStatusLabel[order.status]}</Text>
      </View>
      {preview ? (
        <Pressable onPress={onDetail} style={styles.product}>
          <Image source={cartImage(preview.imageKey)} style={styles.image} contentFit="cover" />
          <View style={styles.productInfo}>
            <Text numberOfLines={2} style={styles.name}>
              {preview.name}
            </Text>
            <Text style={styles.variant}>Phân loại: {preview.variantLabel}</Text>
            <Text style={styles.quantity}>x{preview.quantity}</Text>
          </View>
          <Text style={styles.price}>{formatCurrency(preview.price)}</Text>
        </Pressable>
      ) : null}
      {order.lines.length > 1 ? (
        <Text style={styles.more}>và {order.lines.length - 1} sản phẩm khác</Text>
      ) : null}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>
          Thành tiền ({order.lines.reduce((sum, line) => sum + line.quantity, 0)} sản phẩm)
        </Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </View>
      <View style={styles.footer}>
        <Pressable onPress={onDetail} style={styles.detail}>
          <Text style={styles.detailText}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.textSecondary} />
        </Pressable>
        {actionLabel && onAction ? (
          <AppButton label={actionLabel} onPress={onAction} style={styles.action} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
  header: {
    minHeight: 54,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  shopIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopInitial: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  shop: { flex: 1, color: colors.ink, fontSize: 13, fontWeight: '800', marginLeft: spacing.xs },
  status: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  product: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: '#FAF9FB',
  },
  image: { width: 76, height: 76, borderRadius: radius.sm },
  productInfo: { flex: 1 },
  name: { color: colors.ink, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  variant: { color: colors.textSecondary, fontSize: 11, marginTop: 5 },
  quantity: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
  price: { alignSelf: 'flex-end', color: colors.text, fontSize: 12, fontWeight: '700' },
  more: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'right',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  totalRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.xs,
  },
  totalLabel: { color: colors.textSecondary, fontSize: 11 },
  total: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  footer: {
    minHeight: 58,
    paddingHorizontal: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detail: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: colors.textSecondary, fontSize: 12 },
  action: { minHeight: 38, paddingHorizontal: spacing.md },
});
