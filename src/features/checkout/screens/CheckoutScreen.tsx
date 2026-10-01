import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCheckbox } from '../../../shared/components/AppCheckbox';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { intlLocale } from '../../../shared/i18n/i18n';
import { localizeCatalogText, localizeVariantLabel } from '../../../shared/i18n/localizeCatalog';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import { addressText } from '../../address/domain/addressRules';
import { useAddressStore } from '../../address/store/addressStore';
import { useCartStore } from '../../cart/store/cartStore';
import { cartImage } from '../../cart/utils/cartImage';
import { getProduct, getSeller, getVariant } from '../../catalog/data/dummyCatalog';
import type { OrderRecord } from '../../orders/domain/types';
import { useOrderStore } from '../../orders/store/orderStore';
import { useCheckoutStore } from '../store/checkoutStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

interface CheckoutLine {
  cartItemId?: string;
  sellerId: string;
  sellerName: string;
  id: string;
  productId: string;
  name: string;
  variantLabel: string;
  quantity: number;
  price: number;
  imageKey: 'hero' | 'earbuds' | 'skincare';
  isPreorder: boolean;
  personalAdvice: boolean;
}

export function CheckoutScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const groups = useCartStore(({ groups: value }) => value);
  const clearPurchased = useCartStore(({ clearPurchased }) => clearPurchased);
  const addresses = useAddressStore(({ addresses: value }) => value);
  const selectedAddressId = useAddressStore(({ selectedId }) => selectedId);
  const paymentMethod = useCheckoutStore(({ paymentMethod: value }) => value);
  const setPaymentMethod = useCheckoutStore(({ setPaymentMethod }) => setPaymentMethod);
  const notes = useCheckoutStore(({ notes: value }) => value);
  const setNote = useCheckoutStore(({ setNote }) => setNote);
  const personalAdvice = useCheckoutStore(({ personalAdvice: value }) => value);
  const setPersonalAdvice = useCheckoutStore(({ setPersonalAdvice }) => setPersonalAdvice);
  const resetCheckout = useCheckoutStore(({ reset }) => reset);
  const addOrder = useOrderStore(({ addOrder }) => addOrder);
  const [missingAddress, setMissingAddress] = useState(false);
  const [missingPayment, setMissingPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const lines = useMemo<CheckoutLine[]>(() => {
    if (route.params.direct) {
      const { productId, variantId, quantity, personalAdvice: advice } = route.params.direct;
      const product = getProduct(productId);
      const variant = getVariant(variantId);
      const seller = product ? getSeller(product.sellerId) : undefined;
      if (!product || !variant || !seller) return [];
      return [
        {
          sellerId: seller.id,
          sellerName: seller.name,
          id: `direct-${variant.id}`,
          productId,
          name: product.name,
          variantLabel: [variant.primaryOption?.label, variant.secondaryOption?.label]
            .filter(Boolean)
            .join(', '),
          quantity: Math.min(quantity, variant.stock),
          price: variant.discountPrice ?? variant.originalPrice,
          imageKey:
            productId === 'earbuds-airy'
              ? 'earbuds'
              : productId === 'serum-glow'
                ? 'skincare'
                : 'hero',
          isPreorder: product.isPreorder === true,
          personalAdvice: advice,
        },
      ];
    }
    const ids = route.params.cartItemIds ?? [];
    return groups.flatMap((group) =>
      group.items
        .filter(({ id }) => ids.includes(id))
        .map((item) => ({
          cartItemId: item.id,
          sellerId: group.sellerId,
          sellerName: group.sellerName,
          id: item.id,
          productId: item.productId,
          name: item.productName,
          variantLabel: item.variantLabel,
          quantity: Math.min(item.quantity, item.stock),
          price: item.unitPrice,
          imageKey: item.imageKey,
          isPreorder: item.isPreorder,
          personalAdvice: item.personalAdvice,
        })),
    );
  }, [groups, route.params.cartItemIds, route.params.direct]);

  const sellerIds = [...new Set(lines.map(({ sellerId }) => sellerId))];
  const address =
    addresses.find(({ id }) => id === selectedAddressId) ??
    addresses.find(({ isDefault }) => isDefault) ??
    addresses[0];
  const itemTotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const rawShipping = sellerIds.length * 30000;
  const shippingFee = sellerIds.length * 15000;
  const shippingDiscount = rawShipping - shippingFee;
  const total = itemTotal + shippingFee;
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const hasPreorder = lines.some(({ isPreorder }) => isPreorder);

  useEffect(() => {
    if (hasPreorder && paymentMethod !== 'pay1') setPaymentMethod('pay1');
  }, [hasPreorder, paymentMethod, setPaymentMethod]);

  const submit = () => {
    setMissingAddress(!address);
    setMissingPayment(!paymentMethod);
    if (!address || !paymentMethod || lines.length === 0) return;
    setLoading(true);
    const baseId = `ON${Date.now().toString().slice(-8)}`;
    sellerIds.forEach((sellerId, index) => {
      const sellerLines = lines.filter((line) => line.sellerId === sellerId);
      const sellerItemTotal = sellerLines.reduce(
        (sum, line) => sum + line.price * line.quantity,
        0,
      );
      const order: OrderRecord = {
        id: sellerIds.length > 1 ? `${baseId}-${index + 1}` : baseId,
        sellerId,
        sellerName: sellerLines[0]?.sellerName ?? '',
        createdAt: new Date().toLocaleString(intlLocale(), {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        status: paymentMethod === 'pay1' ? 'waiting_payment' : 'waiting_confirm',
        lines: sellerLines.map((line) => ({
          id: line.id,
          productId: line.productId,
          name: line.name,
          variantLabel: line.variantLabel,
          quantity: line.quantity,
          price: line.price,
          imageKey: line.imageKey,
        })),
        itemTotal: sellerItemTotal,
        shippingFee: 15000,
        rawShippingFee: 30000,
        total: sellerItemTotal + 15000,
        paymentMethod,
        address,
        note: notes[sellerId],
      };
      addOrder(order);
    });
    const purchasedIds = lines.flatMap(({ cartItemId }) => (cartItemId ? [cartItemId] : []));
    setTimeout(() => {
      if (purchasedIds.length) clearPurchased(purchasedIds);
      resetCheckout();
      setLoading(false);
      navigation.replace('PaymentResult', { success: true, orderId: baseId });
    }, 700);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={t('checkout.title')} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => navigation.navigate('AddressList', { selectionMode: true })}
          style={[styles.section, missingAddress && styles.sectionError]}
        >
          <View style={styles.sectionHeading}>
            <Ionicons name="location-outline" size={21} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('checkout.shippingAddress')}</Text>
            <Ionicons name="chevron-forward" size={19} color={colors.textMuted} />
          </View>
          {address ? (
            <View style={styles.addressContent}>
              <Text style={styles.addressName}>
                {address.name} · {address.phone}
              </Text>
              <Text style={styles.addressText}>{addressText(address)}</Text>
              {address.isDefault ? (
                <Text style={styles.defaultTag}>{t('common.default')}</Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.addAddress}>{t('checkout.addAddress')}</Text>
          )}
          {missingAddress ? (
            <Text style={styles.error}>{t('checkout.addressRequired')}</Text>
          ) : null}
        </Pressable>

        {sellerIds.map((sellerId) => {
          const sellerLines = lines.filter((line) => line.sellerId === sellerId);
          return (
            <View key={sellerId} style={styles.section}>
              <Text style={styles.seller}>{sellerLines[0]?.sellerName}</Text>
              {sellerLines.map((line) => (
                <View key={line.id} style={styles.productRow}>
                  <Image
                    source={cartImage(line.imageKey)}
                    style={styles.image}
                    contentFit="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text numberOfLines={2} style={styles.productName}>
                      {localizeCatalogText(line.name, t)}
                    </Text>
                    <Text style={styles.variant}>{localizeVariantLabel(line.variantLabel, t)}</Text>
                    <View style={styles.productPrice}>
                      <Text style={styles.price}>{formatCurrency(line.price)}</Text>
                      <Text style={styles.qty}>x{line.quantity}</Text>
                    </View>
                  </View>
                </View>
              ))}
              {sellerLines
                .filter(({ isPreorder }) => isPreorder)
                .map((line) => (
                  <View key={`advice-${line.id}`} style={styles.advice}>
                    <AppCheckbox
                      checked={personalAdvice[line.id] ?? line.personalAdvice}
                      onChange={(value) => setPersonalAdvice(line.id, value)}
                      label={t('catalog.personalAdvice')}
                    />
                  </View>
                ))}
              <TextInput
                value={notes[sellerId] ?? ''}
                onChangeText={(text) => setNote(sellerId, text)}
                placeholder={t('checkout.sellerNote')}
                placeholderTextColor={colors.textMuted}
                style={styles.note}
              />
            </View>
          );
        })}

        <Pressable
          onPress={() =>
            navigation.navigate('PaymentMethods', {
              selected: paymentMethod,
              preorder: hasPreorder,
            })
          }
          style={[styles.section, missingPayment && styles.sectionError]}
        >
          <View style={styles.sectionHeading}>
            <Ionicons name="card-outline" size={21} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('checkout.paymentMethod')}</Text>
            <Ionicons name="chevron-forward" size={19} color={colors.textMuted} />
          </View>
          <Text style={[styles.method, !paymentMethod && styles.placeholder]}>
            {paymentMethod === 'cod'
              ? t('checkout.cod')
              : paymentMethod === 'pay1'
                ? t('checkout.pay1')
                : t('checkout.choosePayment')}
          </Text>
          {missingPayment ? (
            <Text style={styles.error}>{t('checkout.paymentRequired')}</Text>
          ) : null}
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.paymentDetails')}</Text>
          <PriceRow label={t('checkout.merchandiseSubtotal')} value={formatCurrency(itemTotal)} />
          <PriceRow label={t('checkout.shippingFee')} value={formatCurrency(rawShipping)} />
          <PriceRow
            label={t('checkout.shippingDiscount')}
            value={`-${formatCurrency(shippingDiscount)}`}
            accent
          />
          <View style={styles.priceDivider} />
          <PriceRow label={t('checkout.total')} value={formatCurrency(total)} strong />
        </View>
        <View style={styles.term}>
          <Ionicons name="shield-checkmark-outline" size={19} color={colors.primary} />
          <Text style={styles.termText}>
            {t('checkout.termsPrefix')}{' '}
            <Text style={styles.termLink}>{t('checkout.termsLink')}</Text>{' '}
            {t('checkout.termsSuffix')}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>
            {t('checkout.totalWithCount', { count: quantity })}
          </Text>
          <Text style={styles.bottomTotal}>{formatCurrency(total)}</Text>
        </View>
        <AppButton
          label={t('checkout.placeOrder')}
          loading={loading}
          onPress={submit}
          style={styles.orderButton}
        />
      </View>
    </SafeAreaView>
  );
}

function PriceRow({
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
    <View style={styles.priceDetail}>
      <Text style={[styles.priceLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.priceValue, accent && styles.accent, strong && styles.totalStrong]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 110 },
  section: { backgroundColor: colors.surface, marginTop: spacing.xs, padding: spacing.md },
  sectionError: { borderWidth: 1, borderColor: colors.danger },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sectionTitle: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '900' },
  addressContent: { marginLeft: 29, marginTop: spacing.sm },
  addressName: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  addressText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
  defaultTag: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  addAddress: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.sm,
    marginLeft: 29,
  },
  error: { color: colors.danger, fontSize: 11, marginTop: spacing.xs },
  seller: { color: colors.ink, fontSize: 14, fontWeight: '900', marginBottom: spacing.sm },
  productRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  image: { width: 72, height: 72, borderRadius: radius.sm, backgroundColor: colors.surfaceMuted },
  productInfo: { flex: 1 },
  productName: { color: colors.ink, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  variant: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
  productPrice: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  price: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  qty: { color: colors.textSecondary, fontSize: 12 },
  advice: {
    marginTop: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
  },
  note: {
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    color: colors.ink,
    marginTop: spacing.sm,
    fontSize: 13,
  },
  method: { color: colors.ink, fontSize: 13, marginLeft: 29, marginTop: spacing.sm },
  placeholder: { color: colors.textMuted },
  priceDetail: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  priceLabel: { color: colors.textSecondary, fontSize: 13 },
  priceValue: { color: colors.text, fontSize: 13, fontWeight: '600' },
  accent: { color: colors.success },
  priceDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: spacing.md,
  },
  strong: { color: colors.ink, fontWeight: '800' },
  totalStrong: { color: colors.primary, fontSize: 17, fontWeight: '900' },
  term: { margin: spacing.md, flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  termText: { flex: 1, color: colors.textSecondary, fontSize: 11, lineHeight: 17 },
  termLink: { color: colors.primary, fontWeight: '700' },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomLabel: { color: colors.textSecondary, fontSize: 11 },
  bottomTotal: { color: colors.primary, fontSize: 19, fontWeight: '900', marginTop: 3 },
  orderButton: { width: 142 },
});
