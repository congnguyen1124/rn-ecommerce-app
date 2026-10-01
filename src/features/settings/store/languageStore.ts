import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { deviceLocale } from '../../../shared/i18n/i18n';
import type { AppLocale } from '../../../shared/i18n/resources';

interface LanguageState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  reset: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: deviceLocale,
      setLocale: (locale) => set({ locale }),
      reset: () => set({ locale: deviceLocale }),
    }),
    {
      name: 'on-plus-language-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
