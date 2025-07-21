export type TStatus = 'noFace' | 'offCenter' | 'tilted' | 'turned' | 'notLooking' | 'makingFaces' | 'ok';

export interface IEmits {
  (e: 'restart', manual: boolean): void
  (e: 'photo-taken', value: any): void
}

export interface IProps {
  loading: boolean
  responseStatus?: string
}
