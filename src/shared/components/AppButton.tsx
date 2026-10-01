import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  style?: ViewStyle;
  icon?: React.ReactNode;
  testID?: string;
}

export function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  icon,
  testID,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : (
        icon
      )}
      <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: colors.surfaceMuted },
  danger: { backgroundColor: colors.dangerSoft },
  disabled: { backgroundColor: colors.border, borderColor: colors.border, opacity: 0.78 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  label: { fontSize: 15, fontWeight: '700' },
  primaryLabel: { color: colors.white },
  outlineLabel: { color: colors.primary },
  ghostLabel: { color: colors.text },
  dangerLabel: { color: colors.danger },
});
