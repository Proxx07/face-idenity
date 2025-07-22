<script setup lang="ts">
import type { MessageProps } from 'primevue/message';
import type { IEmits, IProps } from '@/composables/useFaceID/types';
import { Button, Knob, Message, ProgressSpinner } from 'primevue';
import { computed, onMounted } from 'vue';
import { reload } from '@/assets/icons';
import { useFaceID } from '@/composables/useFaceID';

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { video, overlay, status, loading: faceIdInitializing, progressValue, faceIdInit, data } = useFaceID(props, emit);

const messageSeverity = computed<MessageProps['severity']>(() => {
  if (faceIdInitializing.value) return 'info';
  if (status.value === 'ok') return 'success';
  return 'error';
});

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
        <Message v-if="!props.responseStatus" :severity="messageSeverity" class="message">
          <div class="font-18-b" style="min-height: 36px">
            {{ faceIdInitializing ? $tl('loading') : $tl(status) }}
          </div>
          <div style="background: #000; color: #fff;">
            {{ data }}
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
  object-fit: none;
}

.canvas-overlay,
.video-feed {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%) rotateY(180deg);
  max-width: 100%;
}

.target-box {
  position: absolute;
  inset: 0;
  background: rgba(3, 3, 3, .2);
  backdrop-filter: blur(10px);
  -webkit-mask-image: radial-gradient(ellipse 55% 42% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
  mask-image: radial-gradient(ellipse 55% 42% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;

  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  @include media-min($tablet) {
    -webkit-mask-image: radial-gradient(ellipse 40% 45% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
    mask-image: radial-gradient(ellipse 40% 45% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
  }
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
  width: 100%;
  :deep(.p-message-content) {
    justify-content: center;
    text-align: center;
  }
}
</style>
