export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(isThisYear ? {} : { year: 'numeric' }),
  }
  return date.toLocaleDateString('en-US', options)
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export function isExpired(expiredAt: string | null): boolean {
  if (!expiredAt) return false
  return new Date(expiredAt) < new Date()
}

export function isRevoked(revokedAt: string | null): boolean {
  return revokedAt !== null
}

export function getPublicLinkStatus(
  expiredAt: string | null,
  revokedAt: string | null
): 'active' | 'expired' | 'revoked' {
  if (isRevoked(revokedAt)) return 'revoked'
  if (isExpired(expiredAt)) return 'expired'
  return 'active'
}

