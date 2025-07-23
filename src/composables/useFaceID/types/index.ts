export type TStatus = 'noFace' | 'tooClose' | 'tooFar' | 'offCenter' | 'tilted' | 'turned' | 'notLooking' | 'makingFaces' | 'ok';

export interface IEmits {
  (e: 'restart'): void
  (e: 'photo-taken', value: any): void
  (e: 'face-id-refreshed'): void
}

export interface IProps {
  loading: boolean
  responseStatus?: string
}
