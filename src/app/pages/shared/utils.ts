export function formatDate(dateStr: string): string {
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

export function getFileTypeFromName(name: string, shareableType: 'file' | 'folder'): string {
  if (shareableType === 'folder') return 'Folder'

  const ext = name.split('.').pop()?.toLowerCase()
  const typeMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    xls: 'Excel',
    xlsx: 'Excel',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
    mp4: 'Video',
    mp3: 'Audio',
    zip: 'Archive',
    rar: 'Archive',
  }
  return typeMap[ext || ''] || 'File'
}

