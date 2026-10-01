import type { PaymentMethod } from '../../../app/navigation/types';
import type { ShippingAddress } from '../../address/domain/types';
import type { ProductImageKey } from '../../cart/domain/types';

export type OrderStatusTab =
  'waiting_payment' | 'waiting_confirm' | 'waiting_shipping' | 'delivering' | 'done' | 'cancelled';

export interface OrderLine {
  id: string;
  productId: string;
  name: string;
  variantLabel: string;
  quantity: number;
  price: number;
  imageKey: ProductImageKey;
}

export interface OrderRecord {
  id: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  status: OrderStatusTab;
  lines: OrderLine[];
  itemTotal: number;
  shippingFee: number;
  rawShippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  address: ShippingAddress;
  note?: string;
  cancelReason?: string;
}

export const orderStatusTranslationKey: Record<OrderStatusTab, string> = {
  waiting_payment: 'orders.waitingPayment',
  waiting_confirm: 'orders.waitingConfirm',
  waiting_shipping: 'orders.waitingShipping',
  delivering: 'orders.delivering',
  done: 'orders.done',
  cancelled: 'orders.cancelled',
};
