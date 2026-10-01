import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme/tokens';

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
}

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  decreaseDisabled = false,
  increaseDisabled = false,
}: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <Pressable disabled={decreaseDisabled} onPress={onDecrease} style={styles.button}>
        <Ionicons
          name="remove"
          size={17}
          color={decreaseDisabled ? colors.textMuted : colors.ink}
        />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable disabled={increaseDisabled} onPress={onIncrease} style={styles.button}>
        <Ionicons name="add" size={17} color={increaseDisabled ? colors.textMuted : colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  button: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  value: { minWidth: 44, textAlign: 'center', fontSize: 14, color: colors.ink, fontWeight: '700' },
});
