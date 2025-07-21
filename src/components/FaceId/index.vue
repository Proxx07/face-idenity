<script setup lang="ts">
import type { IEmits, IProps } from '@/composables/useFaceID/types';
import { Button, Knob, Message, ProgressSpinner } from 'primevue';
import { onMounted } from 'vue';
import { reload } from '@/assets/icons';
import { useFaceID } from '@/composables/useFaceID';

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { video, overlay, status, progressValue, faceIdInit } = useFaceID(props, emit);

onMounted(() => {
  faceIdInit();
});
</script>

<template>
  <div class="video-wrapper">
    <video ref="video" autoplay muted playsinline class="video-feed" />
    <canvas ref="overlay" class="canvas-overlay" />
    <div class="target-box">
      <div class="status-wrapper">
        <Message v-if="!props.responseStatus" :severity="status === 'ok' ? 'success' : 'error'" class="message">
          <div class="font-18-b">
            {{ $tl(status) }}
          </div>
        </Message>
        <ProgressSpinner
          v-if="props.loading && !responseStatus"
          stroke-width="6"
          style="width: 4rem; height: 4rem;"
        />
        <Knob
          v-if="progressValue && !props.loading"
          v-model="progressValue"
          readonly
          :size="40"
          value-color="var(--p-green-500)"
        />
      </div>

      <Button
        v-if="responseStatus"
        severity="primary"
        label="Обновить"
        size="large"
        :icon="reload"
        style="pointer-events: all"
        @click="emit('restart', true)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-wrapper {
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 800px;
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
}

.canvas-overlay {
  opacity: 0;
}

.video-feed {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%) rotateY(180deg);
  max-width: 100%;
  @media all and (max-width: 480px) {
    max-width: 480px;
  }
}

.target-box {
  position: absolute;
  inset: 0;
  background: var(--secondary-500);
  -webkit-mask-image: radial-gradient(circle, transparent 40%, black 40.1%);
  mask-image: radial-gradient(circle, transparent 40%, black 40.1%);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 320px;
  width: 100%;
  margin: 0 auto auto;
}
.message {
  --p-message-content-padding: 1rem 1.2rem;
  max-width: 270px;
  width: 100%;
  margin-right: auto;
  :deep(.p-message-content) {
    justify-content: center;
    text-align: center;
  }
}
</style>
