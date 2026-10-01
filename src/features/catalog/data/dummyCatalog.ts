import type { Product, Seller } from '../domain/types';

const hero = require('../../../../assets/images/commerce-hero.png');
const earbuds = require('../../../../assets/images/lavender-earbuds.png');
const skincare = require('../../../../assets/images/coral-skincare.png');

export const catalogImages = { hero, earbuds, skincare } as const;

export const sellers: Seller[] = [
  {
    id: 'studio-lavie',
    name: 'La Vie Studio',
    avatarColor: '#7650DA',
    rating: 4.9,
    productCount: 36,
    hotline: '1900 6868',
  },
  {
    id: 'studio-haru',
    name: 'Haru Official',
    avatarColor: '#EF7E77',
    rating: 4.8,
    productCount: 24,
    hotline: '1900 6688',
  },
];

export const products: Product[] = [
  {
    id: 'earbuds-airy',
    name: 'Tai nghe không dây Airy Pods',
    sellerId: 'studio-lavie',
    category: 'Công nghệ',
    image: earbuds,
    rating: 4.9,
    sold: 1240,
    discountPercent: 25,
    description:
      'Thiết kế nhỏ gọn, chống ồn chủ động và âm thanh cân bằng. Hộp sạc cho tổng thời lượng sử dụng lên đến 28 giờ.',
    brand: 'Airy',
    origin: 'Việt Nam',
    warranty: '12 tháng',
    status: 'normal',
    variants: [
      {
        id: 'earbuds-lilac',
        productId: 'earbuds-airy',
        primaryOption: { id: 'lilac', label: 'Tím lilac' },
        secondaryOption: { id: 'standard', label: 'Tiêu chuẩn' },
        stock: 4,
        originalPrice: 1190000,
        discountPrice: 890000,
        sku: 'AIRY-LILAC',
        image: earbuds,
      },
      {
        id: 'earbuds-cream',
        productId: 'earbuds-airy',
        primaryOption: { id: 'cream', label: 'Kem sữa' },
        secondaryOption: { id: 'standard', label: 'Tiêu chuẩn' },
        stock: 8,
        originalPrice: 1190000,
        discountPrice: 890000,
        sku: 'AIRY-CREAM',
        image: earbuds,
      },
      {
        id: 'earbuds-lilac-pro',
        productId: 'earbuds-airy',
        primaryOption: { id: 'lilac', label: 'Tím lilac' },
        secondaryOption: { id: 'pro', label: 'Bản Pro' },
        stock: 0,
        originalPrice: 1490000,
        discountPrice: 1190000,
        sku: 'AIRY-LILAC-PRO',
        image: earbuds,
      },
    ],
  },
  {
    id: 'serum-glow',
    name: 'Bộ dưỡng da Coral Glow',
    sellerId: 'studio-haru',
    category: 'Làm đẹp',
    image: skincare,
    rating: 4.8,
    sold: 862,
    discountPercent: 18,
    description:
      'Serum cấp ẩm kết hợp kem dưỡng dịu nhẹ, phù hợp cho làn da thiếu nước. Công thức tối giản và không hương liệu.',
    brand: 'Haru',
    origin: 'Hàn Quốc',
    warranty: 'Đổi mới 7 ngày',
    status: 'normal',
    variants: [
      {
        id: 'serum-30',
        productId: 'serum-glow',
        primaryOption: { id: '30ml', label: '30 ml' },
        stock: 3,
        originalPrice: 690000,
        discountPrice: 565000,
        sku: 'HARU-CORAL-30',
        image: skincare,
      },
      {
        id: 'serum-50',
        productId: 'serum-glow',
        primaryOption: { id: '50ml', label: '50 ml' },
        stock: 12,
        originalPrice: 890000,
        discountPrice: 729000,
        sku: 'HARU-CORAL-50',
        image: skincare,
      },
    ],
  },
  {
    id: 'tote-everyday',
    name: 'Túi tote Everyday Canvas',
    sellerId: 'studio-lavie',
    category: 'Thời trang',
    image: hero,
    rating: 4.7,
    sold: 519,
    description:
      'Túi canvas dày dặn với ngăn trong tiện dụng, phù hợp đi làm, đi học và những chuyến đi ngắn.',
    brand: 'La Vie',
    origin: 'Việt Nam',
    warranty: '30 ngày',
    status: 'normal',
    variants: [
      {
        id: 'tote-cream',
        productId: 'tote-everyday',
        primaryOption: { id: 'cream', label: 'Kem' },
        stock: 0,
        originalPrice: 329000,
        sku: 'TOTE-CREAM',
        image: hero,
      },
      {
        id: 'tote-lilac',
        productId: 'tote-everyday',
        primaryOption: { id: 'lilac', label: 'Tím' },
        stock: 7,
        originalPrice: 329000,
        sku: 'TOTE-LILAC',
        image: hero,
      },
    ],
  },
  {
    id: 'bottle-go',
    name: 'Bình giữ nhiệt Go 750 ml',
    sellerId: 'studio-lavie',
    category: 'Đời sống',
    image: hero,
    rating: 4.9,
    sold: 971,
    discountPercent: 12,
    description: 'Bình thép không gỉ hai lớp, giữ lạnh 24 giờ và giữ nóng 12 giờ.',
    brand: 'Go',
    origin: 'Việt Nam',
    warranty: '6 tháng',
    status: 'normal',
    variants: [
      {
        id: 'bottle-lilac',
        productId: 'bottle-go',
        primaryOption: { id: 'lilac', label: 'Tím' },
        stock: 15,
        originalPrice: 459000,
        discountPrice: 399000,
        sku: 'GO-750-LILAC',
        image: hero,
      },
    ],
  },
];

export const getProduct = (productId: string) => products.find(({ id }) => id === productId);

export const getVariant = (variantId: string) =>
  products.flatMap(({ variants }) => variants).find(({ id }) => id === variantId);

export const getSeller = (sellerId: string) => sellers.find(({ id }) => id === sellerId);
