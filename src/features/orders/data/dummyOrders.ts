import { initialAddresses } from '../../address/data/dummyAddresses';
import type { OrderRecord } from '../domain/types';

const address = initialAddresses[0]!;

export const initialOrders: OrderRecord[] = [
  {
    id: 'ON24090182',
    sellerId: 'studio-lavie',
    sellerName: 'La Vie Studio',
    createdAt: '28/09/2026 · 14:20',
    status: 'delivering',
    lines: [
      {
        id: 'line-1',
        productId: 'earbuds-airy',
        name: 'Tai nghe không dây Airy Pods',
        variantLabel: 'Tím lilac, Tiêu chuẩn',
        quantity: 1,
        price: 890000,
        imageKey: 'earbuds',
      },
    ],
    itemTotal: 890000,
    shippingFee: 15000,
    rawShippingFee: 30000,
    total: 905000,
    paymentMethod: 'cod',
    address,
    note: 'Giao giờ hành chính',
  },
  {
    id: 'ON24081837',
    sellerId: 'studio-haru',
    sellerName: 'Haru Official',
    createdAt: '18/08/2026 · 09:12',
    status: 'done',
    lines: [
      {
        id: 'line-2',
        productId: 'serum-glow',
        name: 'Bộ dưỡng da Coral Glow',
        variantLabel: '50 ml',
        quantity: 1,
        price: 729000,
        imageKey: 'skincare',
      },
    ],
    itemTotal: 729000,
    shippingFee: 0,
    rawShippingFee: 30000,
    total: 729000,
    paymentMethod: 'pay1',
    address,
  },
  {
    id: 'ON24070214',
    sellerId: 'studio-lavie',
    sellerName: 'La Vie Studio',
    createdAt: '02/07/2026 · 17:45',
    status: 'cancelled',
    lines: [
      {
        id: 'line-3',
        productId: 'tote-everyday',
        name: 'Túi tote Everyday Canvas',
        variantLabel: 'Kem',
        quantity: 1,
        price: 329000,
        imageKey: 'hero',
      },
    ],
    itemTotal: 329000,
    shippingFee: 30000,
    rawShippingFee: 30000,
    total: 359000,
    paymentMethod: 'cod',
    address,
    cancelReason: 'Sản phẩm đã hết hàng',
  },
];
