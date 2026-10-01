import { addressText, isValidVietnamesePhone, validateAddress } from './addressRules';

describe('address rules', () => {
  it.each(['0901234567', '090 123 4567', '+84901234567'])(
    'accepts Vietnamese mobile number %s',
    (phone) => {
      expect(isValidVietnamesePhone(phone)).toBe(true);
    },
  );

  it.each(['123', '0201234567', '09012345678', ''])('rejects invalid phone %s', (phone) => {
    expect(isValidVietnamesePhone(phone)).toBe(false);
  });

  it('reports every missing address field', () => {
    expect(
      validateAddress({
        name: '',
        phone: '',
        street: '',
        area: { city: '', district: '', ward: '' },
        isDefault: false,
      }),
    ).toEqual(['name', 'phone', 'street', 'area']);
  });

  it('formats street through city in Android display order', () => {
    expect(
      addressText({
        id: '1',
        name: 'A',
        phone: '0901234567',
        street: '12 Nguyễn Huệ',
        area: { ward: 'Bến Nghé', district: 'Quận 1', city: 'Hồ Chí Minh' },
        isDefault: true,
      }),
    ).toBe('12 Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh');
  });
});
