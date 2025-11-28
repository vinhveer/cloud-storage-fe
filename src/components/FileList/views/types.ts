import type { FileItem } from '@/components/FileList'

export type FileListViewProps = Readonly<{
  files: FileItem[]
  selectionMode: boolean
  isSelected: (index: number) => boolean
  toggleItem: (index: number) => void
  /** Called on double-click to open the file/folder */
  onItemOpen?: (file: FileItem, index: number) => void
  /** Called on single click to highlight/select the row */
  onItemClick?: (file: FileItem, index: number) => void
  onItemContext?: (file: FileItem, index: number, clientX: number, clientY: number, target?: HTMLElement) => void
  tilesAlignLeft?: boolean
  /** Index of the currently highlighted item (single click) */
  highlightedIndex?: number | null
}>


