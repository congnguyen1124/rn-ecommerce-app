import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';

interface ScreenHeaderProps {
  title: string;
  back?: boolean;
  right?: React.ReactNode;
  subtitle?: string;
}

export function ScreenHeader({ title, back = true, right, subtitle }: ScreenHeaderProps) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {back ? (
        <Pressable
          accessibilityLabel="Quay lại"
          hitSlop={10}
          onPress={() => navigation.goBack()}
          style={styles.side}
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  side: { width: 42, height: 42, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { color: colors.ink, fontSize: 19, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
});
