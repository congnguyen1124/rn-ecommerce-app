import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { localizeCatalogText, localizeVariantLabel } from '../../../shared/i18n/localizeCatalog';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import { addressText } from '../../address/domain/addressRules';
import { cartImage } from '../../cart/utils/cartImage';
import { orderStatusTranslationKey } from '../domain/types';
import { useOrderStore } from '../store/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export function OrderDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const order = useOrderStore(({ orders }) => orders.find(({ id }) => id === route.params.orderId));
  if (!order)
    return (
      <EmptyState
        title={t('orders.notFound')}
        message={t('orders.noLongerExists')}
        actionLabel={t('common.back')}
        onAction={navigation.goBack}
      />
    );
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={t('orders.detailTitle')} subtitle={`#${order.id}`} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statusHero}>
          <View style={styles.statusIcon}>
            <MaterialCommunityIcons
              name={
                order.status === 'cancelled'
                  ? 'close-circle-outline'
                  : order.status === 'done'
                    ? 'check-circle-outline'
                    : 'truck-delivery-outline'
              }
              size={30}
              color={order.status === 'cancelled' ? colors.danger : colors.primary}
            />
          </View>
          <View>
            <Text style={styles.status}>{t(orderStatusTranslationKey[order.status])}</Text>
            <Text style={styles.date}>{order.createdAt}</Text>
          </View>
        </View>
        {order.cancelReason ? (
          <View style={styles.cancel}>
            <Text style={styles.cancelTitle}>{t('orders.cancelReason')}</Text>
            <Text style={styles.cancelText}>{localizeCatalogText(order.cancelReason, t)}</Text>
          </View>
        ) : null}
        <View style={styles.section}>
          <View style={styles.heading}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.headingText}>{t('orders.deliveryAddress')}</Text>
          </View>
          <Text style={styles.recipient}>
            {order.address.name} · {order.address.phone}
          </Text>
          <Text style={styles.address}>{addressText(order.address)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.shop}>{order.sellerName}</Text>
          {order.lines.map((line) => (
            <View key={line.id} style={styles.product}>
              <Image source={cartImage(line.imageKey)} style={styles.image} contentFit="cover" />
              <View style={styles.productInfo}>
                <Text style={styles.name}>{localizeCatalogText(line.name, t)}</Text>
                <Text style={styles.variant}>{localizeVariantLabel(line.variantLabel, t)}</Text>
                <Text style={styles.qty}>x{line.quantity}</Text>
              </View>
              <Text style={styles.price}>{formatCurrency(line.price)}</Text>
            </View>
          ))}
          {order.note ? (
            <View style={styles.note}>
              <Text style={styles.noteLabel}>{t('orders.note')}</Text>
              <Text style={styles.noteText}>{localizeCatalogText(order.note, t)}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.headingText}>{t('orders.paymentInfo')}</Text>
          <DetailRow label={t('orders.orderCode')} value={order.id} />
          <DetailRow
            label={t('orders.method')}
            value={order.paymentMethod === 'cod' ? t('payment.codTitle') : t('payment.onlineTitle')}
          />
          <DetailRow
            label={t('checkout.merchandiseSubtotal')}
            value={formatCurrency(order.itemTotal)}
          />
          <DetailRow
            label={t('checkout.shippingFee')}
            value={formatCurrency(order.rawShippingFee)}
          />
          <DetailRow
            label={t('checkout.shippingDiscount')}
            value={`-${formatCurrency(order.rawShippingFee - order.shippingFee)}`}
            accent
          />
          <View style={styles.divider} />
          <DetailRow label={t('checkout.total')} value={formatCurrency(order.total)} strong />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  accent,
  strong,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.rowValue, accent && styles.accent, strong && styles.total]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  statusHero: {
    backgroundColor: colors.primarySoft,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: { color: colors.primaryDark, fontSize: 19, fontWeight: '900' },
  date: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  cancel: { padding: spacing.md, backgroundColor: colors.dangerSoft },
  cancelTitle: { color: colors.danger, fontSize: 13, fontWeight: '800' },
  cancelText: { color: colors.text, fontSize: 13, marginTop: 4 },
  section: { marginTop: spacing.xs, backgroundColor: colors.surface, padding: spacing.md },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  headingText: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  recipient: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginTop: spacing.sm,
    marginLeft: 28,
  },
  address: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginLeft: 28,
  },
  shop: { color: colors.ink, fontSize: 14, fontWeight: '900', marginBottom: spacing.sm },
  product: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  image: { width: 74, height: 74, borderRadius: radius.sm },
  productInfo: { flex: 1 },
  name: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  variant: { color: colors.textSecondary, fontSize: 11, marginTop: 5 },
  qty: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
  price: { alignSelf: 'flex-end', color: colors.text, fontSize: 12, fontWeight: '700' },
  note: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  noteLabel: { color: colors.textSecondary, fontSize: 12 },
  noteText: { flex: 1, color: colors.text, fontSize: 12 },
  row: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowLabel: { color: colors.textSecondary, fontSize: 13 },
  rowValue: { flex: 1, textAlign: 'right', color: colors.text, fontSize: 13, fontWeight: '600' },
  accent: { color: colors.success },
  strong: { color: colors.ink, fontWeight: '800' },
  total: { color: colors.primary, fontSize: 17, fontWeight: '900' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: spacing.md,
  },
});
