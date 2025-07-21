import type { IEmits, IProps, TStatus } from './types';
import * as faceapi from 'face-api.js';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { getCenter, getDistance, TOLERANCE } from './models';

export const useFaceID = (_: IProps, emit: IEmits) => {
  let interval: ReturnType<typeof setInterval>;
  const size = { width: 0, height: 0 };

  const status = ref<TStatus>('noFace');
  const video = ref<HTMLVideoElement>();
  const overlay = ref<HTMLCanvasElement>();

  const progressInterval = ref<ReturnType<typeof setInterval>>();
  const progressValue = ref<number>(0);

  const photoProcessing = computed(() => {
    return progressValue.value === 100;
  });

  const resetProgressInterval = () => {
    if (!progressInterval.value || photoProcessing.value) return;
    clearInterval(progressInterval.value);
    progressValue.value = 0;
    progressInterval.value = undefined;
  };

  const takePicture = () => {
    if (!overlay.value) return;
    const ctx = overlay.value.getContext('2d')!;
    ctx.save();

    ctx.translate(size.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video.value!, 0, 0, size.width, size.height);

    ctx.restore();

    overlay.value.toBlob((blob) => {
      if (!blob) return;
      const photoUrl = URL.createObjectURL(blob);
      emit('photo-taken', photoUrl);
      ctx.clearRect(0, 0, size.width, size.height);

      progressValue.value = 0;
      progressInterval.value = undefined;
    }, 'image/png');
  };

  const setProgressInterval = () => {
    if (progressInterval.value || photoProcessing.value) return;
    progressInterval.value = setInterval(() => {
      progressValue.value += 20;
      if (photoProcessing.value) {
        takePicture();
        clearInterval(progressInterval.value);
      }
    }, 200);
  };

  const facePointsCalc = async () => {
    const detection = await faceapi
      .detectSingleFace(video.value!, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true);

    if (!overlay.value) return;
    if (!detection) return status.value = 'noFace';

    const resized = faceapi.resizeResults(detection, size);
    if (!resized) return;

    /* faceapi.draw.drawFaceLandmarks(overlay.value, resized); */

    const box = resized.detection.box;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    const dx = Math.abs(centerX - size.width / 2);
    const dy = Math.abs(centerY - size.height / 2);

    const landmarks = resized.landmarks;

    const leftEyePoints = landmarks.getLeftEye();
    const rightEyePoints = landmarks.getRightEye();
    const leftEye = getCenter(leftEyePoints);
    const rightEye = getCenter(rightEyePoints);
    const eyeTilt = Math.abs(leftEye.y - rightEye.y);
    const leftEyeWidth = getDistance(leftEyePoints[0], leftEyePoints[3]);
    const rightEyeWidth = getDistance(rightEyePoints[0], rightEyePoints[3]);
    const eyeRatio = Math.abs(leftEyeWidth - rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth);

    const jaw = landmarks.getJawOutline();
    const faceCenterX = (jaw[0].x + jaw[16].x) / 2;
    const headTurn = Math.abs(faceCenterX - centerX);

    const nose = getCenter(landmarks.getNose());
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const gazeOffset = Math.abs(nose.x - eyeCenterX);

    const mouth = landmarks.getMouth();
    const mouthTop = getCenter([mouth[13], mouth[14]]); // верхняя губа
    const mouthBottom = getCenter([mouth[17], mouth[18]]); // нижняя губа
    const mouthOpen = getDistance(mouthTop, mouthBottom);
    const mouthWidth = getDistance(mouth[0], mouth[6]);

    const leftEyeOpen = getDistance(leftEyePoints[1], leftEyePoints[5]);
    const rightEyeOpen = getDistance(rightEyePoints[1], rightEyePoints[5]);

    const isMouthTooOpen = mouthOpen > TOLERANCE.mouthOpen;
    const isMouthTooWide = mouthWidth > TOLERANCE.mouthWide;
    const isEyesTooNarrow = leftEyeOpen < TOLERANCE.eyeNarrow || rightEyeOpen < TOLERANCE.eyeNarrow;

    const isMakingFaces = isMouthTooOpen || isMouthTooWide || isEyesTooNarrow;

    if (dx > TOLERANCE.center || dy > TOLERANCE.center) {
      status.value = 'offCenter';
    }
    else if (eyeTilt > TOLERANCE.tilt) {
      status.value = 'tilted';
    }
    else if (headTurn > TOLERANCE.turn) {
      status.value = 'turned';
    }
    else if (gazeOffset > TOLERANCE.gaze || eyeRatio > TOLERANCE.gazeSkew) {
      status.value = 'notLooking';
    }
    else if (isMakingFaces) {
      status.value = 'makingFaces';
    }
    else {
      status.value = 'ok';
    }

    if (status.value === 'ok') {
      setProgressInterval();
    }
    else {
      resetProgressInterval();
    }
  };

  const faceIdInit = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/cv-models');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/cv-models');

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!video.value) return;
      video.value.srcObject = stream;

      video.value.onloadeddata = () => {
        if (!overlay.value) return;
        overlay.value.width = video.value!.clientWidth;
        overlay.value.height = video.value!.clientHeight;

        size.width = overlay.value.width;
        size.height = overlay.value.height;

        faceapi.matchDimensions(overlay.value, size);

        interval = setInterval(facePointsCalc, 200);
      };
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error: unknown) {
      emit('restart', false);
      if (interval) clearInterval(interval);
    }
  };

  onBeforeUnmount(() => {
    clearInterval(interval);
  });

  watch(photoProcessing, (value) => {
    if (value) {
      clearInterval(interval);
    }
  });

  return {
    video,
    status,
    overlay,
    progressValue,
    faceIdInit,
  };
};
