<script setup lang="ts">
import { Button } from 'primevue';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { reload } from '@/assets/icons';
import FaceId from '@/components/FaceId/index.vue';

const restartVideoSourceCount = ref(0);
const faceIdActive = ref<boolean>(true);

const videoError = ref(false);
const photoChecking = ref(false);

const responseStatus = ref<string>('');

const handleCameraActive = () => {
  faceIdActive.value = !document.hidden;
};

const handlePhoto = (image: string) => {
  photoChecking.value = true;
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    responseStatus.value = 'success';
    photoChecking.value = false;
  }, 3000);
};
const restartVideo = (manual: boolean) => {
  faceIdActive.value = false;
  if (manual) responseStatus.value = '';
  if (!manual && restartVideoSourceCount.value === 3) {
    videoError.value = true;
  }
  else {
    setTimeout(() => {
      faceIdActive.value = true;
      restartVideoSourceCount.value = manual ? 0 : restartVideoSourceCount.value + 1;
    });
  }
};
const reloadPage = async () => {
  document.location.reload();
};

onBeforeMount(() => {
  document.addEventListener('visibilitychange', handleCameraActive);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleCameraActive);
});
</script>

<template>
  <div class="main-page face-id-page">
    <FaceId
      v-if="faceIdActive && !videoError"
      :loading="photoChecking"
      :response-status="responseStatus"
      @restart="restartVideo"
      @photo-taken="handlePhoto"
    />
    <div v-if="videoError" class="error-wrapper">
      <h3>
        Не удалось запустить камеру. <br>
        Попбробуйте обновить страницу. <br>
        И убедитесь что приложение имеет доступ к камере.
      </h3>

      <Button severity="primary" label="Обновить" size="large" :icon="reload" icon-pos="right" @click="reloadPage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  flex-grow: 1;
  display: flex;
  background: var(--secondary-500);
  width: 100%;
}

.error-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-direction: column;
  h3 {
    font: var(--font-24-b);
    text-align: center;
    line-height: 1.2;
  }
}
</style>
