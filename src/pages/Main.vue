<script setup lang="ts">
import { Button, InputNumber, InputText } from 'primevue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { marker } from '@/assets/icons';
import LangSwitcher from '@/components/UI/LangSwitcher.vue';
import { $confirm } from '@/plugins/confirmation.ts';

const { t } = useI18n();

const defaultConfirm = async () => {
  const result = await $confirm.default({ title: 'Confirmation title', subtitle: `Are you sure to do smth? ${t('hello')}` });
  if (result) {
    console.log('Do smth after accept.');
  }
  else {
    console.log('Do smth after reject.');
  }
};

const infoConfirm = async () => {
  await $confirm.info({ title: 'Info confirmation', subtitle: 'Info confirmation subtitle' });
  console.log('After button click. Info');
};

const successConfirm = async () => {
  await $confirm.success({ title: 'Success confirm', subtitle: 'Success confirmation subtitle' });
  console.log('After button click. Success');
};

const errorConfirm = async () => {
  await $confirm.error({ title: 'Error confirm', subtitle: 'Error confirmation subtitle' });
  console.log('After button click. Error');
};

const loading = ref(true);
</script>

<template>
  <div class="page">
    <LangSwitcher />
    {{ $tl('page.example', { name: '123' }) }}
    <h1>
      {{ $tl('hello') }}
    </h1>
    <hr>

    <Button label="Primary small" size="small" />
    <Button label="Primary" />
    <Button label="Primary large" size="large" />

    <Button label="Secondary small" size="small" severity="secondary" />
    <Button label="Secondary" severity="secondary" />
    <Button label="Secondary large" size="large" severity="secondary" />

    <hr>

    <Button label="svg icon" size="large" :icon="marker" severity="success" />
    <Button label="Check icon fill" size="large" :icon="marker" icon-pos="right" severity="info" icon-class="no-fill" />
    <Button label="Loading test" severity="help" size="large" :loading="loading" />

    <hr>

    <Button label="Default confirmation" severity="warn" @click="defaultConfirm" />
    <Button label="Info confirmation" severity="info" @click="infoConfirm" />
    <Button label="Success confirmation" severity="success" @click="successConfirm" />
    <Button label="Error confirmation" severity="danger" @click="errorConfirm" />
  </div>

  <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
    <InputText fluid placeholder="Search" />
    <InputNumber />
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  hr {
    width: 100%;
  }
}
</style>
