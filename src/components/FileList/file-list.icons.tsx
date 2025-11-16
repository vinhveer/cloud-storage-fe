import type React from 'react'
import clsx from 'clsx'
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

  let colorClass = 'text-blue-500'
  if (iconName === 'folder') colorClass = 'text-yellow-400'
  else if (iconName === 'file-word') colorClass = 'text-blue-500'
  else if (iconName === 'file-excel') colorClass = 'text-green-500'
  else if (iconName === 'file-pdf') colorClass = 'text-red-500'
  else if (iconName === 'file-image') colorClass = 'text-pink-500'
  else if (iconName === 'file-lines') colorClass = 'text-gray-500'

  const IconComponent = iconMap[iconName]
  return <IconComponent className={clsx(colorClass, className)} />
}


