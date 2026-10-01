import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PaymentMethod, RootStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { useCheckoutStore } from '../store/checkoutStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

const methods: {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  {
    id: 'cod',
    title: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán bằng tiền mặt cho đơn vị vận chuyển',
    icon: 'cash',
  },
  {
    id: 'pay1',
    title: 'Thanh toán trực tuyến',
    description: 'Thẻ nội địa, quốc tế hoặc ví điện tử qua Pay1',
    icon: 'credit-card-outline',
  },
];

export function PaymentMethodsScreen({ navigation, route }: Props) {
  const selected = useCheckoutStore(({ paymentMethod }) => paymentMethod) ?? route.params.selected;
  const setPaymentMethod = useCheckoutStore(({ setPaymentMethod }) => setPaymentMethod);
  const choose = (method: PaymentMethod) => {
    setPaymentMethod(method);
    navigation.goBack();
  };
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title="Phương thức thanh toán" />
      <View style={styles.list}>
        {methods.map((method) => {
          const disabled = route.params.preorder === true && method.id === 'cod';
          const checked = selected === method.id;
          return (
            <Pressable
              key={method.id}
              disabled={disabled}
              onPress={() => choose(method.id)}
              style={[styles.item, disabled && styles.disabled]}
            >
              <View style={[styles.icon, checked && styles.iconSelected]}>
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={checked ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{method.title}</Text>
                <Text style={styles.description}>
                  {disabled ? 'Không áp dụng cho sản phẩm đặt trước' : method.description}
                </Text>
              </View>
              <Ionicons
                name={checked ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={checked ? colors.primary : colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, gap: spacing.sm },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  disabled: { opacity: 0.48 },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: { backgroundColor: colors.primarySoft },
  content: { flex: 1 },
  title: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  description: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 4 },
});
