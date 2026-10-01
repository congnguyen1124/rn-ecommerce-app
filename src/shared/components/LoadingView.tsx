import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, spacing } from '../theme/tokens';

export function LoadingView({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{label ?? t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { marginTop: spacing.sm, color: colors.textSecondary, fontSize: 14 },
});
