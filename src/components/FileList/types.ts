import type React from 'react'

export type ViewMode = 'list' | 'grid' | 'tiles' | 'details'

export type FileItem = {
  id?: string | number
  name: string
  type?: string
  modified?: string
  size?: string
  /** Số item con trong folder (dùng cho hiển thị "X items") */
  itemsCount?: number
  icon?: React.ReactNode
  height?: string
}

export type FileListProps = {
  files?: FileItem[]
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  className?: string
  /** Height as viewport percentage, e.g. 60 => 60dvh. If set, component fills this height */
  heightVh?: number
  /** Callback khi user click vào item (khi không ở selection mode) */
  onItemOpen?: (file: FileItem, index: number) => void
  /** Callback khi user right-click (context) vào item: (file, index, clientX, clientY) */
  onItemContext?: (file: FileItem, index: number, clientX: number, clientY: number, target?: HTMLElement) => void
  /** Custom nội dung bên phải toolbar; nếu không truyền sẽ hiện số lượng + Filter/Sort */
  toolbarRight?: React.ReactNode
  /** If true, tiles view will align items to the left (useful when few items) */
  tilesAlignLeft?: boolean
}


