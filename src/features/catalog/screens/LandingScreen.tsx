import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { colors, spacing } from '../../../shared/theme/tokens';
import { useHomeCatalog } from '../hooks/useCatalog';
import { ProductCard } from '../components/ProductCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export function LandingScreen({ navigation, route }: Props) {
  const query = useHomeCatalog();
  const data = route.params.category
    ? query.data?.products.filter(({ category }) => category === route.params.category)
    : query.data?.products;
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={route.params.title} />
      <FlatList
        data={data ?? []}
        numColumns={2}
        keyExtractor={({ id }) => id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard
              compact
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, gap: spacing.sm },
  row: { gap: spacing.sm },
  cell: { flex: 1 },
});
