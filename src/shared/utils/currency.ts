import { intlLocale } from '../i18n/i18n';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat(intlLocale(), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
