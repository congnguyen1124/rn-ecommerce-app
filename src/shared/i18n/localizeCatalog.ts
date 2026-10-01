import type { TFunction } from 'i18next';

const textKeys: Record<string, string> = {
  'Tai nghe không dây Airy Pods': 'data.product.earbudsName',
  'Thiết kế nhỏ gọn, chống ồn chủ động và âm thanh cân bằng. Hộp sạc cho tổng thời lượng sử dụng lên đến 28 giờ.':
    'data.product.earbudsDescription',
  'Bộ dưỡng da Coral Glow': 'data.product.skincareName',
  'Serum cấp ẩm kết hợp kem dưỡng dịu nhẹ, phù hợp cho làn da thiếu nước. Công thức tối giản và không hương liệu.':
    'data.product.skincareDescription',
  'Túi tote Everyday Canvas': 'data.product.toteName',
  'Túi canvas dày dặn với ngăn trong tiện dụng, phù hợp đi làm, đi học và những chuyến đi ngắn.':
    'data.product.toteDescription',
  'Bình giữ nhiệt Go 750 ml': 'data.product.bottleName',
  'Bình thép không gỉ hai lớp, giữ lạnh 24 giờ và giữ nóng 12 giờ.':
    'data.product.bottleDescription',
  'Công nghệ': 'home.technology',
  'Làm đẹp': 'home.beauty',
  'Thời trang': 'home.fashion',
  'Đời sống': 'home.lifestyle',
  'Tím lilac': 'data.option.lilac',
  'Tiêu chuẩn': 'data.option.standard',
  'Kem sữa': 'data.option.milk',
  'Bản Pro': 'data.option.pro',
  Kem: 'data.option.cream',
  Tím: 'data.option.purple',
  'Tím lilac, Tiêu chuẩn': 'data.option.lilacStandard',
  'Việt Nam': 'data.origin.vietnam',
  'Hàn Quốc': 'data.origin.korea',
  '12 tháng': 'data.warranty.twelveMonths',
  'Đổi mới 7 ngày': 'data.warranty.sevenDays',
  '30 ngày': 'data.warranty.thirtyDays',
  '6 tháng': 'data.warranty.sixMonths',
  'Giao giờ hành chính': 'data.note.officeHours',
  'Sản phẩm đã hết hàng': 'data.note.soldOut',
};

export const localizeCatalogText = (value: string, t: TFunction) =>
  textKeys[value] ? t(textKeys[value]) : value;

export const localizeVariantLabel = (value: string, t: TFunction) =>
  value
    .split(', ')
    .map((part) => localizeCatalogText(part, t))
    .join(', ');
