import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { AppButton } from '../../../shared/components/AppButton';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { validateAddress } from '../domain/addressRules';
import type { AddressField, AreaSelection, ShippingAddress } from '../domain/types';
import { useAddressStore } from '../store/addressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressForm'>;

const emptyArea: AreaSelection = { city: '', district: '', ward: '' };

export function AddressFormScreen({ navigation, route }: Props) {
  const addresses = useAddressStore(({ addresses: value }) => value);
  const upsert = useAddressStore(({ upsert: action }) => action);
  const remove = useAddressStore(({ remove: action }) => action);
  const areaDraft = useAddressStore(({ areaDraft: value }) => value);
  const setAreaDraft = useAddressStore(({ setAreaDraft: action }) => action);
  const existing = useMemo(
    () => addresses.find(({ id }) => id === route.params?.addressId),
    [addresses, route.params?.addressId],
  );
  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [street, setStreet] = useState(existing?.street ?? '');
  const [area, setArea] = useState<AreaSelection>(existing?.area ?? emptyArea);
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? false);
  const [errors, setErrors] = useState<AddressField[]>([]);

  useEffect(() => {
    setAreaDraft(existing?.area ?? emptyArea);
  }, [existing?.area, setAreaDraft]);

  useFocusEffect(
    useCallback(() => {
      if (areaDraft) setArea(areaDraft);
    }, [areaDraft]),
  );

  const save = () => {
    const value = { name, phone, street, area, isDefault };
    const invalid = validateAddress(value);
    setErrors(invalid);
    if (invalid.length > 0) return;
    const address: ShippingAddress = { id: existing?.id ?? `address-${Date.now()}`, ...value };
    upsert(address);
    navigation.goBack();
  };

  const deleteAddress = () => {
    if (existing?.isDefault) {
      Alert.alert(
        'Không thể xóa',
        'Bạn không thể xóa địa chỉ mặc định. Hãy chọn địa chỉ mặc định khác trước.',
      );
      return;
    }
    Alert.alert('Xóa địa chỉ', 'Bạn có chắc muốn xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          if (existing) remove(existing.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const areaLabel = [area.ward, area.district, area.city].filter(Boolean).join(', ');
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={existing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'} />
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Field
          label="Họ và tên"
          value={name}
          onChange={setName}
          placeholder="Nhập họ và tên"
          error={errors.includes('name') ? 'Vui lòng nhập họ và tên' : undefined}
        />
        <Field
          label="Số điện thoại"
          value={phone}
          onChange={setPhone}
          placeholder="Ví dụ: 090 123 4567"
          keyboardType="phone-pad"
          error={errors.includes('phone') ? 'Số điện thoại không hợp lệ' : undefined}
        />
        <Text style={styles.label}>Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</Text>
        <Pressable
          onPress={() => navigation.navigate('AreaPicker', area)}
          style={[styles.select, errors.includes('area') && styles.inputError]}
        >
          <Text style={[styles.selectText, !areaLabel && styles.placeholder]}>
            {areaLabel || 'Chọn khu vực'}
          </Text>
          <Ionicons name="chevron-forward" size={19} color={colors.textSecondary} />
        </Pressable>
        {errors.includes('area') ? (
          <Text style={styles.error}>Vui lòng chọn đầy đủ khu vực</Text>
        ) : null}
        <Field
          label="Địa chỉ cụ thể"
          value={street}
          onChange={setStreet}
          placeholder="Số nhà, tên đường"
          multiline
          error={errors.includes('street') ? 'Vui lòng nhập địa chỉ cụ thể' : undefined}
        />
        <View style={styles.defaultRow}>
          <View style={styles.defaultText}>
            <Text style={styles.defaultTitle}>Đặt làm địa chỉ mặc định</Text>
            <Text style={styles.defaultNote}>Ưu tiên sử dụng khi thanh toán</Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: colors.border, true: '#BDA8F4' }}
            thumbColor={isDefault ? colors.primary : colors.white}
          />
        </View>
        <AppButton label="Lưu địa chỉ" onPress={save} style={styles.save} />
        {existing ? (
          <AppButton
            variant="danger"
            label="Xóa địa chỉ"
            onPress={deleteAddress}
            style={styles.delete}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.md, gap: spacing.md },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: spacing.xs },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: 14,
  },
  multiline: { height: 92, paddingTop: spacing.md, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 11, marginTop: 5 },
  select: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { flex: 1, color: colors.ink, fontSize: 14 },
  placeholder: { color: colors.textMuted },
  defaultRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultText: { flex: 1 },
  defaultTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  defaultNote: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  save: { marginTop: spacing.sm },
  delete: { marginBottom: spacing.xl },
});
