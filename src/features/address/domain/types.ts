export interface AreaSelection {
  city: string;
  district: string;
  ward: string;
}

export interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  area: AreaSelection;
  isDefault: boolean;
}

export type AddressField = 'name' | 'phone' | 'street' | 'area';
