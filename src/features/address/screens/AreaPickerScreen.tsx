import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { areaTree } from '../data/dummyAreas';
import type { AreaSelection } from '../domain/types';
import { useAddressStore } from '../store/addressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AreaPicker'>;

export function AreaPickerScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const setAreaDraft = useAddressStore(({ setAreaDraft: action }) => action);
  const [selected, setSelected] = useState<AreaSelection>({
    city: route.params?.city ?? '',
    district: route.params?.district ?? '',
    ward: route.params?.ward ?? '',
  });
  const [step, setStep] = useState<'city' | 'district' | 'ward'>(
    selected.city ? (selected.district ? 'ward' : 'district') : 'city',
  );
  const [search, setSearch] = useState('');
  const city = areaTree.find(({ name }) => name === selected.city);
  const district = city?.children?.find(({ name }) => name === selected.district);
  const options = useMemo(() => {
    const values =
      step === 'city'
        ? areaTree
        : step === 'district'
          ? (city?.children ?? [])
          : (district?.children ?? []);
    return values.filter(({ name }) =>
      name.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')),
    );
  }, [city?.children, district?.children, search, step]);

  const choose = (name: string) => {
    setSearch('');
    if (step === 'city') {
      setSelected({ city: name, district: '', ward: '' });
      setStep('district');
      return;
    }
    if (step === 'district') {
      setSelected((value) => ({ ...value, district: name, ward: '' }));
      setStep('ward');
      return;
    }
    const value = { ...selected, ward: name };
    setAreaDraft(value);
    navigation.goBack();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={t('address.chooseArea')} />
      <View style={styles.search}>
        <Ionicons name="search" size={19} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('address.search')}
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.breadcrumbs}>
        {selected.city ? (
          <Crumb label={selected.city} active={step === 'city'} onPress={() => setStep('city')} />
        ) : null}
        {selected.district ? (
          <Crumb
            label={selected.district}
            active={step === 'district'}
            onPress={() => setStep('district')}
          />
        ) : null}
        <Crumb
          label={
            step === 'city'
              ? t('address.city')
              : step === 'district'
                ? t('address.district')
                : t('address.ward')
          }
          active
        />
      </View>
      <Text style={styles.heading}>
        {step === 'city'
          ? t('address.chooseCity')
          : step === 'district'
            ? t('address.chooseDistrict')
            : t('address.chooseWard')}
      </Text>
      <ScrollView>
        {options.map(({ name }) => (
          <Pressable key={name} onPress={() => choose(name)} style={styles.option}>
            <Text style={styles.optionText}>{name}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Crumb({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.crumb, active && styles.crumbActive]}>
      <Text numberOfLines={1} style={[styles.crumbText, active && styles.crumbTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  search: {
    margin: spacing.md,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  searchInput: { flex: 1, color: colors.ink, fontSize: 14 },
  breadcrumbs: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  crumb: {
    maxWidth: 150,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  crumbActive: { backgroundColor: colors.primarySoft },
  crumbText: { color: colors.textSecondary, fontSize: 11 },
  crumbTextActive: { color: colors.primary, fontWeight: '700' },
  heading: { color: colors.ink, fontSize: 16, fontWeight: '900', padding: spacing.md },
  option: {
    height: 52,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  optionText: { color: colors.text, fontSize: 14 },
});
