import type { IPoint } from 'face-api.js';

export const TOLERANCE = {
  center: 50,
  tilt: 10,
  turn: 20,
  gaze: 20,
  gazeSkew: 0.10,

  mouthOpen: 15,
  mouthWide: 60,
  eyeNarrow: 5,
};

export const constraints: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: 'user',
    aspectRatio: 9 / 16,
    width: { min: window.innerWidth, max: window.innerWidth },
    height: { min: window.innerHeight, max: window.innerHeight },
  },
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
