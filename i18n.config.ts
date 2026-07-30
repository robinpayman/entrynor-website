export const defaultLocale = 'en';
export const locales = ['en', 'no', 'sv', 'da', 'de', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  no: 'Norsk',
  sv: 'Svenska',
  da: 'Dansk',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};
