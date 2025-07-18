<script setup lang="ts">
import type { TLangs } from '@/plugins/i18n/models';
import { Button } from 'primevue';
import { useI18n } from 'vue-i18n';
import { locales } from '@/plugins/i18n';

const { locale } = useI18n();

const setLang = (lang: TLangs) => {
  locale.value = lang;
};
</script>

<template>
  <div class="langs">
    <Button
      v-for="lang in locales"
      :key="lang.value"
      :severity="lang.value === locale ? 'success' : 'primary'"
      size="small"
      @click="setLang(lang.value)"
    >
      {{ lang.name }}
    </Button>
  </div>
</template>

<style scoped lang="scss">
.langs {
  display: flex;
  gap: .6rem;
}
</style>
