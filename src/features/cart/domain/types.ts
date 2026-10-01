export type ProductImageKey = 'hero' | 'earbuds' | 'skincare';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  sellerId: string;
  productName: string;
  variantLabel: string;
  imageKey: ProductImageKey;
  quantity: number;
  stock: number;
  unitPrice: number;
  originalPrice: number;
  selected: boolean;
  productStatus: 'normal' | 'unlisted';
  variantAvailable: boolean;
  isPreorder: boolean;
  personalAdvice: boolean;
}

export interface CartGroup {
  sellerId: string;
  sellerName: string;
  sellerColor: string;
  selected: boolean;
  items: CartItem[];
}

export interface CartSummary {
  itemCount: number;
  selectedCount: number;
  total: number;
  allGroupsSelected: boolean;
  checkoutEnabled: boolean;
}
