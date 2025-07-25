export type TStatus = 'noFace' | 'tooClose' | 'tooFar' | 'offCenter' | 'tilted' | 'turned' | 'notLooking' | 'mouthOpened' | 'smiling' | 'ok';

export interface IEmits {
  (e: 'restart'): void
  (e: 'photo-taken', value: any): void
  (e: 'face-id-refreshed'): void
}

export interface IProps {
  loading: boolean
  responseStatus?: string
}

export interface INoseBoxArea {
  x: [number, number]
  y: [number, number]
}

export interface ISquare {
  width: number
  height: number
  faceSquareMin: number
  faceSquareMax: number
}
