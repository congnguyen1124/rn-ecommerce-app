import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/components/AppButton';
import { AppCheckbox } from '../../../shared/components/AppCheckbox';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { addressText } from '../domain/addressRules';
import { useAddressStore } from '../store/addressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressList'>;

export function AddressListScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const addresses = useAddressStore(({ addresses: value }) => value);
  const selectedId = useAddressStore(({ selectedId: value }) => value);
  const select = useAddressStore(({ select: action }) => action);
  const selectionMode = route.params?.selectionMode === true;

  const pick = (id: string) => {
    if (selectionMode) {
      select(id);
      navigation.goBack();
    } else {
      navigation.navigate('AddressForm', { addressId: id });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={selectionMode ? t('address.shippingTitle') : t('address.bookTitle')} />
      <ScrollView contentContainerStyle={styles.list}>
        {addresses.map((address) => (
          <Pressable key={address.id} onPress={() => pick(address.id)} style={styles.card}>
            {selectionMode ? (
              <AppCheckbox checked={selectedId === address.id} onChange={() => pick(address.id)} />
            ) : null}
            <View style={styles.content}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{address.name}</Text>
                <View style={styles.divider} />
                <Text style={styles.phone}>{address.phone}</Text>
              </View>
              <Text style={styles.address}>{addressText(address)}</Text>
              {address.isDefault ? (
                <Text style={styles.defaultTag}>{t('common.default')}</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => navigation.navigate('AddressForm', { addressId: address.id })}
              hitSlop={8}
            >
              <Ionicons name="create-outline" size={21} color={colors.primary} />
            </Pressable>
          </Pressable>
        ))}
        {addresses.length < 10 ? (
          <AppButton
            variant="outline"
            icon={<Ionicons name="add-circle-outline" size={19} color={colors.primary} />}
            label={t('address.addNew')}
            onPress={() => navigation.navigate('AddressForm')}
            style={styles.add}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  content: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  divider: { width: 1, height: 14, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  phone: { color: colors.textSecondary, fontSize: 13 },
  address: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  defaultTag: {
    alignSelf: 'flex-start',
    color: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: spacing.sm,
    fontSize: 10,
    fontWeight: '700',
  },
  add: { marginTop: spacing.sm },
});
