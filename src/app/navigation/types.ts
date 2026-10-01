import type { OrderStatusTab } from '../../features/orders/domain/types';

export type PaymentMethod = 'cod' | 'pay1';

export type RootStackParamList = {
  Home: undefined;
  Landing: { title: string; category?: string };
  ProductDetail: { productId: string };
  ProductPreview: { productId: string };
  Cart: undefined;
  Checkout: {
    cartItemIds?: string[];
    direct?: { productId: string; variantId: string; quantity: number; personalAdvice: boolean };
  };
  PaymentMethods: { selected?: PaymentMethod; preorder?: boolean };
  AddressList: { selectionMode?: boolean } | undefined;
  AddressForm: { addressId?: string } | undefined;
  AreaPicker: { city?: string; district?: string; ward?: string } | undefined;
  Orders: { initialTab?: OrderStatusTab } | undefined;
  OrderDetail: { orderId: string };
  PaymentResult: { success: boolean; orderId: string };
  Settings: undefined;
};
