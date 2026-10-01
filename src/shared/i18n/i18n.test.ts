import i18n, { normalizeLocale } from './i18n';
import { localizeCatalogText, localizeVariantLabel } from './localizeCatalog';
import { resources } from './resources';

const leafKeys = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === 'object' && child !== null ? leafKeys(child, path) : [path];
  });

describe('internationalization', () => {
  it('normalizes supported device locales and falls back to Vietnamese', () => {
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('zh-Hans')).toBe('zh');
    expect(normalizeLocale('fr-FR')).toBe('vi');
  });

  it('keeps every translation locale structurally complete', () => {
    const viKeys = leafKeys(resources.vi.translation).sort();
    expect(leafKeys(resources.en.translation).sort()).toEqual(viKeys);
    expect(leafKeys(resources.zh.translation).sort()).toEqual(viKeys);
  });

  it('localizes dummy product and variant data in English', () => {
    const t = i18n.getFixedT('en');
    expect(localizeCatalogText('Tai nghe không dây Airy Pods', t)).toBe(
      'Airy Pods Wireless Earbuds',
    );
    expect(localizeVariantLabel('Tím lilac, Tiêu chuẩn', t)).toBe('Lilac, Standard');
  });

  it('localizes dummy product and variant data in Simplified Chinese', () => {
    const t = i18n.getFixedT('zh');
    expect(localizeCatalogText('Bộ dưỡng da Coral Glow', t)).toBe('Coral Glow 护肤套装');
    expect(localizeVariantLabel('Tím lilac, Tiêu chuẩn', t)).toBe('淡紫色, 标准版');
  });
});
