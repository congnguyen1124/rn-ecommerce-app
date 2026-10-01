import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddressFormScreen } from '../../features/address/screens/AddressFormScreen';
import { AddressListScreen } from '../../features/address/screens/AddressListScreen';
import { AreaPickerScreen } from '../../features/address/screens/AreaPickerScreen';
import { CartScreen } from '../../features/cart/screens/CartScreen';
import { HomeScreen } from '../../features/catalog/screens/HomeScreen';
import { LandingScreen } from '../../features/catalog/screens/LandingScreen';
import { ProductDetailScreen } from '../../features/catalog/screens/ProductDetailScreen';
import { ProductPreviewScreen } from '../../features/catalog/screens/ProductPreviewScreen';
import { CheckoutScreen } from '../../features/checkout/screens/CheckoutScreen';
import { PaymentMethodsScreen } from '../../features/checkout/screens/PaymentMethodsScreen';
import { OrderDetailScreen } from '../../features/orders/screens/OrderDetailScreen';
import { OrdersScreen } from '../../features/orders/screens/OrdersScreen';
import { PaymentResultScreen } from '../../features/orders/screens/PaymentResultScreen';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { colors } from '../../shared/theme/tokens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen
        name="ProductPreview"
        component={ProductPreviewScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="AddressForm" component={AddressFormScreen} />
      <Stack.Screen name="AreaPicker" component={AreaPickerScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
