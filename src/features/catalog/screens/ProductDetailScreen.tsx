import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/components/AppButton';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LoadingView } from '../../../shared/components/LoadingView';
import { localizeCatalogText } from '../../../shared/i18n/localizeCatalog';
import { colors, radius, shadow, spacing } from '../../../shared/theme/tokens';
import { formatCurrency } from '../../../shared/utils/currency';
import { summarizeCart } from '../../cart/domain/cartRules';
import { useCartStore } from '../../cart/store/cartStore';
import { getSeller } from '../data/dummyCatalog';
import type { ProductVariant } from '../domain/types';
import { variantPrice } from '../domain/types';
import { useHomeCatalog, useProduct } from '../hooks/useCatalog';
import { ProductCard } from '../components/ProductCard';
import { VariantSelectorSheet } from '../components/VariantSelectorSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
type Action = 'cart' | 'buy';

export function ProductDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const query = useProduct(route.params.productId);
  const homeQuery = useHomeCatalog();
  const groups = useCartStore(({ groups: value }) => value);
  const addToCart = useCartStore(({ addToCart: action }) => action);
  const [action, setAction] = useState<Action>();
  const [notice, setNotice] = useState('');

  if (query.isLoading) return <LoadingView label={t('catalog.loadingProduct')} />;
  if (!query.data || query.isError) {
    return (
      <EmptyState
        title={t('catalog.notFound')}
        message={t('catalog.unavailableMessage')}
        actionLabel={t('common.back')}
        onAction={navigation.goBack}
      />
    );
  }

  const product = query.data;
  const seller = getSeller(product.sellerId);
  const firstVariant = product.variants.find(({ stock }) => stock > 0) ?? product.variants[0];
  const hasStock = product.variants.some(({ stock }) => stock > 0);
  const cartSummary = summarizeCart(groups);
  const related = homeQuery.data?.products.filter(({ id }) => id !== product.id) ?? [];

  const confirmVariant = (variant: ProductVariant, quantity: number, personalAdvice: boolean) => {
    setAction(undefined);
    if (!seller) return;
    if (action === 'cart') {
      addToCart(product, variant, seller, quantity, personalAdvice);
      setNotice(t('home.addedToCart'));
      setTimeout(() => setNotice(''), 1800);
    } else {
      navigation.navigate('Checkout', {
        direct: { productId: product.id, variantId: variant.id, quantity, personalAdvice },
      });
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Pressable
          onPress={() => navigation.navigate('ProductPreview', { productId: product.id })}
          style={styles.hero}
        >
          <Image
            source={product.image}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
          {!hasStock ? (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>{t('catalog.soldOut')}</Text>
            </View>
          ) : null}
        </Pressable>
        <View style={styles.floatingHeader}>
          <RoundIcon icon="chevron-back" onPress={navigation.goBack} />
          <View style={styles.headerRight}>
            <View>
              <RoundIcon icon="cart-outline" onPress={() => navigation.navigate('Cart')} />
              {cartSummary.itemCount > 0 ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartSummary.itemCount}</Text>
                </View>
              ) : null}
            </View>
            <RoundIcon
              icon="share-social-outline"
              onPress={() =>
                Share.share({ message: `${localizeCatalogText(product.name, t)} · ON+ Shopping` })
              }
            />
            <RoundIcon icon="ellipsis-vertical" onPress={() => undefined} />
          </View>
        </View>

        <View style={styles.section}>
          {product.isPreorder ? <Text style={styles.preorder}>{t('catalog.preorder')}</Text> : null}
          <Text style={styles.productName}>{localizeCatalogText(product.name, t)}</Text>
          {firstVariant ? (
            <View style={styles.priceLine}>
              <Text style={styles.price}>{formatCurrency(variantPrice(firstVariant))}</Text>
              {firstVariant.discountPrice ? (
                <Text style={styles.original}>{formatCurrency(firstVariant.originalPrice)}</Text>
              ) : null}
              {product.discountPercent ? (
                <Text style={styles.discount}>-{product.discountPercent}%</Text>
              ) : null}
            </View>
          ) : null}
          <View style={styles.ratingLine}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingStrong}>{product.rating}</Text>
            <Text style={styles.ratingText}>
              {t('catalog.reviews', { count: Math.round(product.sold / 5) })}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.ratingText}>{t('catalog.sold', { count: product.sold })}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.productInfo')}</Text>
          <InfoRow label={t('catalog.brand')} value={product.brand} />
          <InfoRow label={t('catalog.origin')} value={localizeCatalogText(product.origin, t)} />
          <InfoRow label={t('catalog.warranty')} value={localizeCatalogText(product.warranty, t)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.description')}</Text>
          <Text style={styles.description}>{localizeCatalogText(product.description, t)}</Text>
          <Text style={styles.description}>{t('catalog.descriptionBullets')}</Text>
        </View>

        {seller ? (
          <View style={styles.section}>
            <View style={styles.sellerRow}>
              <View style={[styles.sellerAvatar, { backgroundColor: seller.avatarColor }]}>
                <Text style={styles.sellerAvatarText}>{seller.name.slice(0, 1)}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{seller.name}</Text>
                <Text style={styles.sellerMeta}>
                  {seller.rating} ★ · {t('catalog.productCount', { count: seller.productCount })}
                </Text>
              </View>
              <AppButton
                variant="outline"
                label={t('common.contact')}
                onPress={() => undefined}
                style={styles.contact}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>{t('catalog.productReviews')}</Text>
            <Text style={styles.seeAll}>{t('common.viewAll')}</Text>
          </View>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewScore}>{product.rating}</Text>
            <View>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.ratingText}>{t('catalog.satisfied')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.relatedWrap}>
          <Text style={styles.sectionTitle}>{t('catalog.similar')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.related}
          >
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => navigation.push('ProductDetail', { productId: item.id })}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.buyBar}>
        <AppButton
          variant="outline"
          label={t('catalog.addToCart')}
          icon={<Ionicons name="cart-outline" size={18} color={colors.primary} />}
          disabled={!hasStock || product.status !== 'normal'}
          onPress={() => setAction('cart')}
          style={styles.buyButton}
        />
        <AppButton
          label={product.isPreorder ? t('catalog.orderNow') : t('catalog.buyNow')}
          disabled={!hasStock || product.status !== 'normal'}
          onPress={() => setAction('buy')}
          style={styles.buyButton}
        />
      </View>
      {notice ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={21} color={colors.success} />
          <Text style={styles.toastText}>{notice}</Text>
        </View>
      ) : null}
      {action ? (
        <VariantSelectorSheet
          visible
          product={product}
          actionLabel={
            action === 'cart'
              ? t('catalog.addToCart')
              : product.isPreorder
                ? t('catalog.orderNow')
                : t('catalog.buyNow')
          }
          onClose={() => setAction(undefined)}
          onConfirm={confirmVariant}
        />
      ) : null}
    </SafeAreaView>
  );
}

function RoundIcon({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.roundIcon}>
      <Ionicons name={icon} size={22} color={colors.ink} />
    </Pressable>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingBottom: 86, backgroundColor: colors.background },
  hero: { height: 390, backgroundColor: colors.surfaceMuted },
  heroImage: { width: '100%', height: '100%' },
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: { color: colors.white, fontSize: 22, fontWeight: '900' },
  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRight: { flexDirection: 'row', gap: spacing.xs },
  roundIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 17,
    height: 17,
    backgroundColor: colors.danger,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: colors.white, fontSize: 9, fontWeight: '900' },
  section: { backgroundColor: colors.surface, marginTop: spacing.xs, padding: spacing.md },
  preorder: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    fontSize: 10,
    fontWeight: '900',
  },
  productName: {
    marginTop: spacing.xs,
    color: colors.ink,
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '800',
  },
  priceLine: { marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  price: { color: colors.primary, fontSize: 23, fontWeight: '900' },
  original: { color: colors.textMuted, fontSize: 13, textDecorationLine: 'line-through' },
  discount: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
    fontSize: 11,
    fontWeight: '800',
  },
  ratingLine: { marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingStrong: { color: colors.ink, fontWeight: '800' },
  ratingText: { color: colors.textSecondary, fontSize: 12 },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: 4,
  },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  infoRow: { flexDirection: 'row', paddingTop: spacing.md },
  infoLabel: { width: 120, color: colors.textSecondary, fontSize: 14 },
  infoValue: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' },
  description: { color: colors.textSecondary, fontSize: 14, lineHeight: 22, marginTop: spacing.sm },
  sellerRow: { flexDirection: 'row', alignItems: 'center' },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: { color: colors.white, fontSize: 19, fontWeight: '900' },
  sellerInfo: { flex: 1, marginLeft: spacing.sm },
  sellerName: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  sellerMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  contact: { minHeight: 38, paddingHorizontal: spacing.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  reviewSummary: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  reviewScore: { color: colors.ink, fontSize: 36, fontWeight: '900' },
  stars: { color: colors.warning, letterSpacing: 2, fontSize: 16 },
  relatedWrap: { marginTop: spacing.xs, backgroundColor: colors.surface, paddingTop: spacing.md },
  relatedWrapTitle: { paddingHorizontal: spacing.md },
  related: { padding: spacing.md, gap: spacing.sm },
  buyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  buyButton: { flex: 1 },
  toast: {
    position: 'absolute',
    top: 100,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    ...shadow.card,
  },
  toastText: { color: colors.text, fontSize: 13, fontWeight: '700' },
});
