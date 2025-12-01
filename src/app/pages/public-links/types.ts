import type { PublicLinkListItem } from '@/api/features/public-link/public-link.types'

export type PublicLinkItem = PublicLinkListItem & {
  status: 'active' | 'expired' | 'revoked'
}

