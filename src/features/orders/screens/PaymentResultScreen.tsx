import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/components/AppButton';
import { colors, spacing } from '../../../shared/theme/tokens';
import { useOrderStore } from '../store/orderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentResult'>;

export function PaymentResultScreen({ navigation, route }: Props) {
  const markPaid = useOrderStore(({ markPaid }) => markPaid);
  useEffect(() => {
    if (route.params.success) markPaid(route.params.orderId);
  }, [markPaid, route.params.orderId, route.params.success]);
  const goOrders = () =>
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Orders', params: { initialTab: 'waiting_confirm' } }],
    });
  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.icon, !route.params.success && styles.iconFail]}>
        <Ionicons
          name={route.params.success ? 'checkmark' : 'close'}
          size={48}
          color={colors.white}
        />
      </View>
      <Text style={styles.title}>
        {route.params.success ? 'Đặt hàng thành công' : 'Thanh toán chưa thành công'}
      </Text>
      <Text style={styles.message}>
        {route.params.success
          ? 'Đơn hàng của bạn đã được ghi nhận. Người bán sẽ sớm xác nhận và chuẩn bị hàng.'
          : 'Đơn hàng đã được tạo nhưng thanh toán gặp sự cố. Bạn có thể thanh toán lại trong danh sách đơn hàng.'}
      </Text>
      <Text style={styles.code}>Mã đơn: {route.params.orderId}</Text>
      <View style={styles.actions}>
        <AppButton label="Xem đơn hàng" onPress={goOrders} />
        <AppButton variant="outline" label="Về trang chủ" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFail: { backgroundColor: colors.danger },
  title: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  code: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: spacing.lg },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.xxl },
});
