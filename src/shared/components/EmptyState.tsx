import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon = 'shopping-outline',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={icon} size={46} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 19, color: colors.ink, fontWeight: '800', textAlign: 'center' },
  message: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    lineHeight: 21,
    textAlign: 'center',
  },
  action: { marginTop: spacing.xl, minWidth: 180 },
});
