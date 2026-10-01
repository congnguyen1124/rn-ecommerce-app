import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources, type AppLocale } from './resources';

export const supportedLocales: AppLocale[] = ['vi', 'en', 'zh'];

export const normalizeLocale = (languageCode?: string | null): AppLocale => {
  const normalized = languageCode?.toLowerCase().split('-')[0];
  return supportedLocales.includes(normalized as AppLocale) ? (normalized as AppLocale) : 'vi';
};

export const deviceLocale = normalizeLocale(getLocales()[0]?.languageCode);

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: deviceLocale,
  fallbackLng: 'vi',
  supportedLngs: supportedLocales,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export const intlLocale = (locale = i18n.resolvedLanguage ?? i18n.language) =>
  ({ vi: 'vi-VN', en: 'en-US', zh: 'zh-CN' })[normalizeLocale(locale)];

export default i18n;
