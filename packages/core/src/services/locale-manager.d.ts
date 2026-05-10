import type { Locale, LocaleCode } from '../types/locale';
export declare function registerLocale(code: LocaleCode, locale: Locale): void;
export declare function getLocale(code: LocaleCode): Locale;
export declare function getAvailableLocales(): LocaleCode[];
