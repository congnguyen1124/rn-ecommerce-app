import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { EmptyState } from '../../../shared/components/EmptyState';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, spacing } from '../../../shared/theme/tokens';
import { OrderCard } from '../components/OrderCard';
import { orderStatusTranslationKey, type OrderRecord, type OrderStatusTab } from '../domain/types';
import { useOrderStore } from '../store/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;
const tabs = Object.keys(orderStatusTranslationKey) as OrderStatusTab[];

export function OrdersScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const orders = useOrderStore(({ orders: value }) => value);
  const confirmReceived = useOrderStore(({ confirmReceived }) => confirmReceived);
  const [tab, setTab] = useState<OrderStatusTab>(route.params?.initialTab ?? 'waiting_payment');
  const [confirming, setConfirming] = useState<OrderRecord>();
  const filtered = orders.filter(({ status }) => status === tab);

  const actionFor = (order: OrderRecord) => {
    if (order.status === 'waiting_payment')
      return {
        label: t('orders.pay'),
        action: () => navigation.navigate('PaymentResult', { success: true, orderId: order.id }),
      };
    if (order.status === 'delivering')
      return { label: t('orders.received'), action: () => setConfirming(order) };
    if (order.status === 'cancelled')
      return {
        label: t('orders.cancellationDetail'),
        action: () => navigation.navigate('OrderDetail', { orderId: order.id }),
      };
    if (order.status === 'done') return { label: t('orders.contact'), action: () => undefined };
    return undefined;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={t('orders.title')} />
      <View style={styles.tabWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {tabs.map((item) => (
            <Pressable
              key={item}
              onPress={() => setTab(item)}
              style={[styles.tab, tab === item && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>
                {t(orderStatusTranslationKey[item])}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {filtered.length === 0 ? (
        <EmptyState
          icon="package-variant"
          title={t('orders.emptyTitle')}
          message={t('orders.emptyMessage', { status: t(orderStatusTranslationKey[tab]) })}
          actionLabel={t('orders.exploreProducts')}
          onAction={() => navigation.navigate('Home')}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {filtered.map((order) => {
            const action = actionFor(order);
            return (
              <OrderCard
                key={order.id}
                order={order}
                onDetail={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                actionLabel={action?.label}
                onAction={action?.action}
              />
            );
          })}
        </ScrollView>
      )}
      <ConfirmModal
        visible={Boolean(confirming)}
        title={t('orders.confirmReceivedTitle')}
        message={t('orders.confirmReceivedMessage')}
        confirmLabel={t('common.confirm')}
        onCancel={() => setConfirming(undefined)}
        onConfirm={() => {
          if (confirming) confirmReceived(confirming.id);
          setConfirming(undefined);
          setTab('done');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  tabWrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tabs: { paddingHorizontal: spacing.sm },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: colors.primary, fontWeight: '800' },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
});
