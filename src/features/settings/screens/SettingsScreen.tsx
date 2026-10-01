import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import type { RootStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import i18n, { supportedLocales } from '../../../shared/i18n/i18n';
import type { AppLocale } from '../../../shared/i18n/resources';
import { colors, radius, spacing } from '../../../shared/theme/tokens';
import { useLanguageStore } from '../store/languageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const languageLabels: Record<AppLocale, 'vietnamese' | 'english' | 'chinese'> = {
  vi: 'vietnamese',
  en: 'english',
  zh: 'chinese',
};

export function SettingsScreen(_props: Props) {
  const { t } = useTranslation();
  const locale = useLanguageStore(({ locale: value }) => value);
  const setLocale = useLanguageStore(({ setLocale: action }) => action);

  const chooseLanguage = (value: AppLocale) => {
    setLocale(value);
    void i18n.changeLanguage(value);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScreenHeader title={t('settings.title')} />
      <View style={styles.content}>
        <View style={styles.headingRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="language-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.headingContent}>
            <Text style={styles.heading}>{t('settings.language')}</Text>
            <Text style={styles.description}>{t('settings.languageDescription')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {supportedLocales.map((item, index) => {
            const selected = item === locale;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={item}
                onPress={() => chooseLanguage(item)}
                style={[styles.option, index > 0 && styles.optionBorder]}
              >
                <View style={styles.codeBadge}>
                  <Text style={styles.code}>{item.toUpperCase()}</Text>
                </View>
                <Text style={styles.label}>{t(`settings.${languageLabels[item]}`)}</Text>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={23}
                  color={selected ? colors.primary : colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.note}>{t('settings.applied')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContent: { flex: 1 },
  heading: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  description: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 3 },
  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  option: {
    minHeight: 70,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  codeBadge: {
    width: 42,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  label: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '700' },
  note: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
});
