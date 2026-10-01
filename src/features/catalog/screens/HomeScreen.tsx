import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { LoadingView } from '../../../shared/components/LoadingView';
import { colors, radius, shadow, spacing } from '../../../shared/theme/tokens';
import { summarizeCart } from '../../cart/domain/cartRules';
import { useCartStore } from '../../cart/store/cartStore';
import { useLanguageStore } from '../../settings/store/languageStore';
import { catalogImages, getSeller } from '../data/dummyCatalog';
import { useHomeCatalog } from '../hooks/useCatalog';
import { ProductCard } from '../components/ProductCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const categories = [
  { name: 'Công nghệ', labelKey: 'home.technology', icon: 'headphones' as const, color: '#EDE6FF' },
  { name: 'Làm đẹp', labelKey: 'home.beauty', icon: 'flower-outline' as const, color: '#FFE9E8' },
  {
    name: 'Thời trang',
    labelKey: 'home.fashion',
    icon: 'shopping-outline' as const,
    color: '#FFF3DE',
  },
  { name: 'Đời sống', labelKey: 'home.lifestyle', icon: 'home-heart' as const, color: '#E6F7F0' },
];

export function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const locale = useLanguageStore(({ locale: value }) => value);
  const query = useHomeCatalog();
  const groups = useCartStore(({ groups: value }) => value);
  const addToCart = useCartStore(({ addToCart: action }) => action);
  const [notice, setNotice] = useState('');
  const summary = summarizeCart(groups);

  if (query.isLoading || !query.data) return <LoadingView label={t('home.preparing')} />;

  const quickAdd = (productId: string) => {
    const product = query.data.products.find(({ id }) => id === productId);
    const variant = product?.variants.find(({ stock }) => stock > 0);
    const seller = product ? getSeller(product.sellerId) : undefined;
    if (!product || !variant || !seller) return;
    addToCart(product, variant, seller, 1);
    setNotice(t('home.addedToCart'));
    setTimeout(() => setNotice(''), 1800);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>
            ON<Text style={styles.logoPlus}>+</Text>
          </Text>
          <Text style={styles.logoCaption}>Shopping</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            accessibilityLabel={t('home.orders')}
            onPress={() => navigation.navigate('Orders')}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="package-variant-closed" size={22} color={colors.ink} />
          </Pressable>
          <Pressable
            accessibilityLabel={t('home.cart')}
            onPress={() => navigation.navigate('Cart')}
            style={styles.iconButton}
          >
            <Ionicons name="cart-outline" size={23} color={colors.ink} />
            {summary.itemCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{Math.min(99, summary.itemCount)}</Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            accessibilityLabel={t('home.settings')}
            onPress={() => navigation.navigate('Settings')}
            style={styles.profile}
          >
            <Text style={styles.profileText}>{locale.toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
            onRefresh={query.refetch}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        <Pressable
          onPress={() => navigation.navigate('Landing', { title: t('home.collection') })}
          style={styles.hero}
        >
          <Image source={catalogImages.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(28,14,53,0.08)', 'rgba(39,14,81,0.78)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>{t('home.newCollection')}</Text>
            <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
            <Text style={styles.heroSub}>{t('home.heroSubtitle')}</Text>
            <View style={styles.heroAction}>
              <Text style={styles.heroActionText}>{t('home.exploreNow')}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.ink} />
            </View>
          </View>
        </Pressable>

        <SectionHeader
          title={t('home.categories')}
          action={t('common.viewAll')}
          onPress={() => navigation.navigate('Landing', { title: t('home.allProducts') })}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <Pressable
              key={category.name}
              onPress={() =>
                navigation.navigate('Landing', { title: category.name, category: category.name })
              }
              style={styles.category}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <MaterialCommunityIcons name={category.icon} size={26} color={colors.primaryDark} />
              </View>
              <Text style={styles.categoryName}>{t(category.labelKey)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.promoRow}>
          <LinearGradient colors={['#6D3AE6', '#9B6DF2']} style={styles.promoCard}>
            <Text style={styles.promoTag}>FREESHIP</Text>
            <Text style={styles.promoTitle}>{t('home.orderFrom')}</Text>
            <Text style={styles.promoText}>{t('home.autoApplied')}</Text>
          </LinearGradient>
          <LinearGradient colors={['#FF7D77', '#F4AA7A']} style={styles.promoCard}>
            <Text style={styles.promoTag}>FLASH SALE</Text>
            <Text style={styles.promoTitle}>{t('home.everyDay')}</Text>
            <Text style={styles.promoText}>{t('home.limitedDeal')}</Text>
          </LinearGradient>
        </View>

        <SectionHeader
          title={t('home.featured')}
          action={t('home.seeMore')}
          onPress={() => navigation.navigate('Landing', { title: t('home.featured') })}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productRow}
        >
          {query.data.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              onAdd={() => quickAdd(product.id)}
            />
          ))}
        </ScrollView>

        <SectionHeader title={t('home.recommended')} />
        <View style={styles.grid}>
          {query.data.products
            .slice()
            .reverse()
            .map((product) => (
              <ProductCard
                compact
                key={`suggest-${product.id}`}
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              />
            ))}
        </View>
      </ScrollView>
      {notice ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={21} color={colors.success} />
          <Text style={styles.toastText}>{notice}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    height: 62,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontSize: 23, fontWeight: '900', color: colors.ink, letterSpacing: -1 },
  logoPlus: { color: colors.primary },
  logoCaption: {
    marginTop: -4,
    fontSize: 9,
    letterSpacing: 2.2,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    right: 0,
    top: 1,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '900' },
  profile: {
    marginLeft: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  scroll: { paddingBottom: 40 },
  hero: {
    height: 262,
    margin: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  heroContent: { flex: 1, justifyContent: 'flex-end', padding: spacing.xl },
  heroEyebrow: { color: '#E7D8FF', fontSize: 11, fontWeight: '900', letterSpacing: 1.6 },
  heroTitle: {
    color: colors.white,
    fontSize: 29,
    lineHeight: 33,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  heroSub: { color: '#F4ECFF', fontSize: 12, marginTop: spacing.xs },
  heroAction: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroActionText: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '900' },
  sectionAction: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  categoryList: { paddingHorizontal: spacing.md, gap: spacing.lg },
  category: { alignItems: 'center', width: 72 },
  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  promoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  promoCard: { flex: 1, minHeight: 108, borderRadius: radius.lg, padding: spacing.md },
  promoTag: { color: colors.white, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  promoTitle: { color: colors.white, fontSize: 17, fontWeight: '900', marginTop: spacing.xs },
  promoText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 3 },
  productRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, gap: spacing.sm },
  grid: { paddingHorizontal: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  toast: {
    position: 'absolute',
    top: 76,
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
