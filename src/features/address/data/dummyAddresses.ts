import type { ShippingAddress } from '../domain/types';

export const initialAddresses: ShippingAddress[] = [
  {
    id: 'address-home',
    name: 'Nguyễn Minh Anh',
    phone: '090 123 4567',
    street: '12 Nguyễn Huệ',
    area: { city: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé' },
    isDefault: true,
  },
  {
    id: 'address-office',
    name: 'Nguyễn Minh Anh',
    phone: '090 123 4567',
    street: '88 Trần Não',
    area: { city: 'Hồ Chí Minh', district: 'Thành phố Thủ Đức', ward: 'Phường An Phú' },
    isDefault: false,
  },
];
