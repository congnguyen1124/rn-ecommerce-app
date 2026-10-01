import type { ImageSourcePropType } from 'react-native';

export type ProductStatus = 'normal' | 'unlisted';

export interface Seller {
  id: string;
  name: string;
  avatarColor: string;
  rating: number;
  productCount: number;
  hotline: string;
}

export interface VariantOption {
  id: string;
  label: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  primaryOption?: VariantOption;
  secondaryOption?: VariantOption;
  stock: number;
  originalPrice: number;
  discountPrice?: number;
  sku: string;
  image: ImageSourcePropType;
  available?: boolean;
}

export interface Product {
  id: string;
  name: string;
  sellerId: string;
  category: string;
  image: ImageSourcePropType;
  rating: number;
  sold: number;
  discountPercent?: number;
  description: string;
  brand: string;
  origin: string;
  warranty: string;
  status: ProductStatus;
  isPreorder?: boolean;
  variants: ProductVariant[];
}

export const variantPrice = (variant: ProductVariant) =>
  variant.discountPrice ?? variant.originalPrice;
