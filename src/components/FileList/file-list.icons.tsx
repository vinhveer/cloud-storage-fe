import type React from 'react'
import { iconMap } from '@/components/FileCard/constants'
import type { IconName } from '@/components/FileCard/types'
import type { FileItem } from '@/components/FileList/types'

export function getDefaultFileIcon(file: FileItem, className: string): React.ReactNode {
  const type = file.type?.toLowerCase().trim()

  let iconName: IconName = 'file'
  if (type === 'folder' || type === 'directory') {
    iconName = 'folder'
  } else if (type === 'pdf') {
    iconName = 'file-pdf'
  } else if (type === 'image' || type === 'photo' || type === 'png' || type === 'jpg' || type === 'jpeg') {
    iconName = 'file-image'
  } else if (type === 'word' || type === 'doc' || type === 'docx') {
    iconName = 'file-word'
  } else if (type === 'excel' || type === 'xls' || type === 'xlsx' || type === 'csv') {
    iconName = 'file-excel'
  } else if (type === 'text' || type === 'txt') {
    iconName = 'file-lines'
  }

  const IconComponent = iconMap[iconName]
  return <IconComponent className={className} />
}


