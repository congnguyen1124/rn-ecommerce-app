import type { AddressField, ShippingAddress } from './types';

export const isValidVietnamesePhone = (phone: string) =>
  /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(phone.replace(/\s/g, ''));

export const validateAddress = (address: Omit<ShippingAddress, 'id'>): AddressField[] => {
  const errors: AddressField[] = [];
  if (!address.name.trim()) errors.push('name');
  if (!isValidVietnamesePhone(address.phone)) errors.push('phone');
  if (!address.street.trim()) errors.push('street');
  if (!address.area.city || !address.area.district || !address.area.ward) errors.push('area');
  return errors;
};

export const addressText = (address: ShippingAddress) =>
  [address.street, address.area.ward, address.area.district, address.area.city]
    .filter(Boolean)
    .join(', ');
