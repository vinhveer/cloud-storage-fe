import React from 'react'
import { DocumentIcon, DocumentTextIcon, PhotoIcon, FolderIcon, TableCellsIcon } from '@heroicons/react/24/solid'
import type { IconName } from '@/components/FileCard/types'

export const iconMap: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  file: DocumentIcon,
  'file-alt': DocumentTextIcon,
  'file-csv': TableCellsIcon,
  'file-image': PhotoIcon,
  'file-word': DocumentTextIcon,
  'file-excel': TableCellsIcon,
  'file-pdf': DocumentIcon,
  'file-lines': DocumentTextIcon,
  folder: FolderIcon,
}


