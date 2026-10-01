import { useLanguageStore } from './languageStore';

describe('language Zustand store', () => {
  beforeEach(() => {
    useLanguageStore.setState({ locale: 'vi' });
  });

  it('switches between all supported locales', () => {
    useLanguageStore.getState().setLocale('en');
    expect(useLanguageStore.getState().locale).toBe('en');
    useLanguageStore.getState().setLocale('zh');
    expect(useLanguageStore.getState().locale).toBe('zh');
    useLanguageStore.getState().setLocale('vi');
    expect(useLanguageStore.getState().locale).toBe('vi');
  });
});
