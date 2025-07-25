import type { IPoint } from 'face-api.js';
import type { INoseBoxArea, ISquare } from '@/composables/useFaceID/types';

export const FACE_ID_INTERVALS_DELAY = 250;

export const TOLERANCE = {
  tilt: 10,
  turn: 20,
  gaze: 20,
  gazeSkew: 0.10,
};

const constraints: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: 'user',
    aspectRatio: 9 / 16,
    width: { min: Math.min(800, window.innerWidth), max: Math.min(800, window.innerWidth) },
    height: { min: window.innerHeight, max: window.innerHeight },
  },
};

export const setConstraint = (): MediaStreamConstraints => {
  if (window.innerWidth >= 720) return constraints;
  return {
    audio: false,
    video: true,
  };
};

export const getCenter = (points: IPoint[]) => {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
};

export const getDistance = (a: IPoint, b: IPoint) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

export const setNoseBoxArea = (size: { width: number, height: number }): INoseBoxArea => {
  const xStart = size.width / 2 - size.width / 16;
  const xEnd = xStart + size.width / 8;

  const yStart = size.height / 2 - size.height * 0.03;
  const yEnd = yStart + size.height / 6;

  return { x: [xStart, xEnd], y: [yStart, yEnd] };
};

export const preferableSquare = (size: { width: number, height: number }): ISquare => {
  const width = size.width * 45 / 100;
  const height = size.height * 55 / 100;
  const square = width * height;
  return {
    width, height,
    faceSquareMin: square * 1.01,
    faceSquareMax: square * 1.48,
  };
};

export const takePhoto = async (canvas: HTMLCanvasElement, video: HTMLVideoElement): Promise<string> => {
  const size = {
    width: video.clientWidth,
    height: video.clientHeight,
  };

  const ctx = canvas.getContext('2d')!;
  ctx.save();
  ctx.translate(size.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, 0, 0, size.width, size.height);

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const photoUrl = URL.createObjectURL(blob);
      ctx.clearRect(0, 0, size.width, size.height);
      resolve(photoUrl);
    }, 'image/png');
  });
};
