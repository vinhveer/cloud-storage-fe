import type { FileItem } from '@/components/FileList/types'

export type SharedItem = FileItem & {
  owner: string
  sharedDate: string
  shareId: number
  shareableType: 'file' | 'folder'
  shareableId?: number
}

export type Tab = 'with' | 'by'

