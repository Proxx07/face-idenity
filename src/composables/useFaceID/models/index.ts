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
