import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing } from '../theme/tokens';

interface AppCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  testID?: string;
}

export function AppCheckbox({
  checked,
  onChange,
  disabled = false,
  label,
  testID,
}: AppCheckboxProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      hitSlop={8}
      style={styles.container}
    >
      <MaterialCommunityIcons
        name={checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
        size={24}
        color={disabled ? colors.textMuted : checked ? colors.primary : colors.textSecondary}
      />
      {label ? <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  label: { fontSize: 14, color: colors.text, fontWeight: '600' },
  disabled: { color: colors.textMuted },
});
