<script setup lang="ts">
import type { MessageProps } from 'primevue/message';
import type { IEmits, IProps } from '@/composables/useFaceID/types';
import { Button, Message, ProgressSpinner } from 'primevue';
import { computed, onMounted, watch } from 'vue';
import { reload } from '@/assets/icons';
import RoundProgress from '@/components/UI/RoundProgress.vue';
import { useFaceID } from '@/composables/useFaceID';

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const {
  video, overlay, status,
  initializing, bgImage, faceIdInit,
  handlePhotoUpload, refreshFaceDetection,
} = useFaceID(props, emit);

const messageSeverity = computed<MessageProps['severity']>(() => {
  if (props.responseStatus === 'error') return 'error';
  if (initializing.value) return 'info';
  if (status.value === 'ok' || props.loading) return 'success';
  return 'error';
});

const messageText = computed<string>(() => {
  if (props.responseStatus === 'error') return 'Error from backend';
  if (initializing.value) return 'loading';
  if (status.value === 'ok' || props.loading) return 'ok';
  return status.value;
});

watch(() => props.responseStatus, (value) => {
  if (value === 'error') {
    setTimeout(refreshFaceDetection, 1500);
  }
});

onMounted(() => {
  faceIdInit();
});
</script>

<template>
  <div class="video-wrapper">
    <div class="blur-bg" :style="{ '--bg': `url(${bgImage})` }" />
    <video ref="video" autoplay muted playsinline class="video-feed" />
    <canvas ref="overlay" class="canvas-overlay" />
    <div class="target-box">
      <div class="status-wrapper">
        <Message v-if="!props.responseStatus || props.responseStatus === 'error'" :severity="messageSeverity" class="message">
          <div class="font-18-b">
            {{ $tl(messageText) }}
          </div>
        </Message>
        <RoundProgress v-if="!props.responseStatus && status === 'ok' && !loading" :duration="3" :size="40" @loaded="handlePhotoUpload" />
        <ProgressSpinner v-if="loading" stroke-width="8" class="size-4" />
      </div>
      <Button
        v-if="responseStatus === 'success'"
        severity="primary"
        label="Повторить"
        size="large"
        :icon="reload"
        style="pointer-events: all"
        @click="refreshFaceDetection"
      />
    </div>
    <div class="span" />
  </div>
</template>

<style scoped lang="scss">
.round {
  position: absolute;
}
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
.canvas-overlay,
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
.blur-bg {
  position: absolute;
  inset: 0;
  background-image: var(--bg);
  background-position: center;
  background-size: cover;
}
.target-box {
  position: absolute;
  inset: 0;
  background: rgba(3, 3, 3, 0.5);
  backdrop-filter: blur(20px);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  /* round mask
  -webkit-mask-image: radial-gradient(circle, transparent 40%, black 40.1%);
  mask-image: radial-gradient(circle, transparent 40%, black 40.1%);
  round mask end*/
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  // ellipse mask
  -webkit-mask-image: radial-gradient(ellipse 55% 42% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
  mask-image: radial-gradient(ellipse 55% 42% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
  @include media-min($tablet) {
    -webkit-mask-image: radial-gradient(ellipse 40% 45% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
    mask-image: radial-gradient(ellipse 40% 45% at 50% 50%, transparent 0%, transparent 70%, black 70.1%, black 100%);
  }
  // ellipse mask end
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
