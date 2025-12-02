export function formatFileSize(bytes: number): string {
  const sizeInKB = bytes / 1024
  const sizeInMB = sizeInKB / 1024
  if (sizeInMB >= 1) return `${sizeInMB.toFixed(2)} MB`
  return `${sizeInKB.toFixed(2)} KB`
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

