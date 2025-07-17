import type { VNode } from 'vue';

export interface IConfirmation {
  id: number
  component: VNode
}

export interface IConfirmResponse {
  id: number
  result: boolean
}

export type ConfirmationTypes = 'default' | 'success' | 'info' | 'error';

export interface IProps {
  title?: string
  subtitle?: string
  type: ConfirmationTypes
}

export interface IEmits {
  (e: 'accept'): void
  (e: 'reject'): void
}
