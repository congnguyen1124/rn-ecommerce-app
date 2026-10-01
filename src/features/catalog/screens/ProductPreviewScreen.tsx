import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { colors, spacing } from '../../../shared/theme/tokens';
import { useProduct } from '../hooks/useCatalog';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductPreview'>;

export function ProductPreviewScreen({ navigation, route }: Props) {
  const query = useProduct(route.params.productId);
  if (!query.data) return null;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack}>
          <Ionicons name="close" size={28} color={colors.white} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {query.data.name}
        </Text>
        <View style={styles.placeholder} />
      </View>
      <Image source={query.data.image} style={styles.image} contentFit="contain" />
      <Text style={styles.counter}>1 / 1</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  header: {
    height: 56,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  placeholder: { width: 28 },
  image: { flex: 1, width: '100%' },
  counter: { alignSelf: 'center', color: colors.white, fontSize: 13, marginBottom: spacing.xl },
});
