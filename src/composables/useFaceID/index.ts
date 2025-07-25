import type { IEmits, INoseBoxArea, IProps, ISquare, TStatus } from './types';
import * as faceapi from 'face-api.js';
import { onBeforeUnmount, ref } from 'vue';
import {
  FACE_ID_INTERVALS_DELAY,
  getCenter,
  getDistance,
  preferableSquare,
  setConstraint,
  setNoseBoxArea,
  takePhoto,
  TOLERANCE,
} from './models';

export const useFaceID = (_: IProps, emit: IEmits) => {
  let interval: ReturnType<typeof setInterval>;
  const size = { width: 0, height: 0 };
  let square: ISquare;
  let noseBoxArea: INoseBoxArea;

  const status = ref<TStatus>('noFace');
  const video = ref<HTMLVideoElement>();
  const overlay = ref<HTMLCanvasElement>();
  const bgImage = ref<string>('');

  const initializing = ref<boolean>(true);

  const resetStream = () => {
    if (!video.value || !video.value.srcObject) return;
    const tracks = (video.value.srcObject as MediaStream).getTracks();
    if (tracks && tracks.length) {
      tracks.forEach(track => track.stop());
    }
  };

  const handlePhotoUpload = async () => {
    const photo = await takePhoto(overlay.value!, video.value!);
    emit('photo-taken', photo);
    clearInterval(interval);
  };

  const facePointsCalc = async () => {
    const detection = await faceapi
      .detectSingleFace(video.value!, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.7 }))
      .withFaceLandmarks(true);

    if (!overlay.value) return;
    if (initializing.value) initializing.value = false;
    if (!detection) return status.value = 'noFace';

    faceapi.draw.drawFaceLandmarks(overlay.value, detection.landmarks);

    const box = detection.detection.box;
    const centerX = box.x + box.width / 2;
    const boxSquare = box.width * box.height;

    if (!square) square = preferableSquare(size);

    if (boxSquare < square.faceSquareMin) {
      status.value = 'tooFar';
      return;
    }

    if (boxSquare > square.faceSquareMax) {
      status.value = 'tooClose';
      return;
    }

    const landmarks = detection.landmarks;

    const nose = getCenter(landmarks.getNose());
    if (!noseBoxArea) noseBoxArea = setNoseBoxArea(size);
    if (nose.x < noseBoxArea.x[0] || nose.x > noseBoxArea.x[1] || nose.y < noseBoxArea.y[0] || nose.y > noseBoxArea.y[1]) {
      status.value = 'offCenter';
      return;
    }

    const mouth = landmarks.getMouth();
    const mouthTop = getCenter([mouth[13], mouth[14]]); // верхняя губа
    const mouthBottom = getCenter([mouth[17], mouth[18]]); // нижняя губа
    const mouthHeight = getDistance(mouthTop, mouthBottom);
    const mouthWidth = getDistance(mouth[0], mouth[6]);

    if (mouthHeight > square.height * 0.05) {
      status.value = 'mouthOpened';
      return;
    }
    if (mouthWidth > box.width * 0.28) {
      status.value = 'smiling';
      return;
    }

    const leftEyePoints = landmarks.getLeftEye();
    const rightEyePoints = landmarks.getRightEye();
    const leftEye = getCenter(leftEyePoints);
    const rightEye = getCenter(rightEyePoints);
    const eyeTilt = Math.abs(leftEye.y - rightEye.y);
    if (eyeTilt > TOLERANCE.tilt) {
      status.value = 'tilted';
      return;
    }

    const leftEyeWidth = getDistance(leftEyePoints[0], leftEyePoints[3]);
    const rightEyeWidth = getDistance(rightEyePoints[0], rightEyePoints[3]);
    const eyeRatio = Math.abs(leftEyeWidth - rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth);
    const jaw = landmarks.getJawOutline();
    const faceCenterX = (jaw[0].x + jaw[16].x) / 2;
    const headTurn = Math.abs(faceCenterX - centerX);
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const gazeOffset = Math.abs(nose.x - eyeCenterX);
    if (headTurn > TOLERANCE.turn) {
      status.value = 'turned';
    }
    else if (gazeOffset > TOLERANCE.gaze || eyeRatio > TOLERANCE.gazeSkew) {
      status.value = 'notLooking';
    }
    else {
      status.value = 'ok';
    }
  };

  const faceIdInit = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/cv-models');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/cv-models');
      const stream = await navigator.mediaDevices.getUserMedia(setConstraint());
      if (!video.value) return;
      video.value.srcObject = stream;

      video.value.onloadeddata = async () => {
        if (!overlay.value) return;
        overlay.value.width = video.value!.clientWidth;
        overlay.value.height = video.value!.clientHeight;

        size.width = overlay.value.width;
        size.height = overlay.value.height;

        square = preferableSquare(size);
        noseBoxArea = setNoseBoxArea(size);

        faceapi.matchDimensions(overlay.value, size);
        await new Promise(resolve => setTimeout(resolve, 100));
        const photoUrl = await takePhoto(overlay.value, video.value!);
        bgImage.value = photoUrl;
        interval = setInterval(facePointsCalc, FACE_ID_INTERVALS_DELAY);
      };
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error: unknown) {
      emit('restart');
      if (interval) clearInterval(interval);
    }
  };

  const refreshFaceDetection = () => {
    interval = setInterval(facePointsCalc, FACE_ID_INTERVALS_DELAY);
    emit('face-id-refreshed');
  };

  onBeforeUnmount(() => {
    clearInterval(interval);
    resetStream();
  });

  return {
    video,
    status,
    overlay,
    initializing,
    bgImage,
    faceIdInit,
    handlePhotoUpload,
    refreshFaceDetection,
  };
};
