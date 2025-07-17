import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import { createApp } from 'vue';
import {
  createI18n,
} from 'vue-i18n';
import App from '@/App.vue';
import { i18nOptions } from '@/plugins/i18n';
import { options } from '@/plugins/PrimeVue';
import router from '@/router/router.ts';
import '@/styles/main.scss';

const app = createApp(App);
const i18n = createI18n(i18nOptions);
const pinia = createPinia();

app
  .use(i18n)
  .use(pinia)
  .use(router)
  .use(PrimeVue, options)
  .mount('#app');

app.config.globalProperties.$tl = i18n.global.t;

interface GlobalProperties {
  $tl: typeof i18n.global.t
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends GlobalProperties {}
}
