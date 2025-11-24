import type { FileItem } from '@/components/FileList'

export type FileListViewProps = Readonly<{
  files: FileItem[]
  selectionMode: boolean
  isSelected: (index: number) => boolean
  toggleItem: (index: number) => void
  onItemOpen?: (file: FileItem, index: number) => void
  onItemContext?: (file: FileItem, index: number, clientX: number, clientY: number, target?: HTMLElement) => void
  tilesAlignLeft?: boolean
}>


