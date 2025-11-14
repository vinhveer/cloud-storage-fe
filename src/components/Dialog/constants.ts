import type { ConfirmType } from '@/components/Dialog/types'

export type ConfirmButtonVariant = 'primary' | 'secondary' | 'danger'

export const confirmVariantMap: Record<ConfirmType, ConfirmButtonVariant> = {
  danger: 'danger',
  primary: 'primary',
  neutral: 'secondary',
}


