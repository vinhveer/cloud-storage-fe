import type { FileItem } from '@/components/FileList'

export type FileListViewProps = Readonly<{
  files: FileItem[]
  selectionMode: boolean
  isSelected: (index: number) => boolean
  toggleItem: (index: number) => void
  onItemOpen?: (file: FileItem, index: number) => void
  tilesAlignLeft?: boolean
}>


