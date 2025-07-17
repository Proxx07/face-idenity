import type { I18nOptions } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import { DEFAULT_LANGUAGE } from './models';

export const i18nOptions: I18nOptions = {
  locale: DEFAULT_LANGUAGE,
  fallbackLocale: DEFAULT_LANGUAGE,
  messages: {
    'ru-RU': ru,
    'en-US': en,
    'uz-UZ': uz,
  },
};
