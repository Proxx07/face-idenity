import type { MessageSchema } from './types';
import { createI18n } from 'vue-i18n';
import en from './locales/en';
import ru from './locales/ru';
import uz from './locales/uz';
import { DEFAULT_LANGUAGE } from './models';

export const i18n = createI18n<[MessageSchema], 'ru-RU' | 'en-US' | 'uz-UZ'>({
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: DEFAULT_LANGUAGE,
  messages: {
    'ru-RU': ru,
    'en-US': en,
    'uz-UZ': uz,
  },
});

export const locales = i18n.global.availableLocales.map(ln => ({ name: ln.split('-')[0], value: ln }));
