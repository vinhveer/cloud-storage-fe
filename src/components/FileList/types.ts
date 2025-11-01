import type React from 'react'

export type ViewMode = 'list' | 'grid' | 'tiles' | 'details'

export type FileItem = {
  id?: string | number
  name: string
  type?: string
  modified?: string
  size?: string
  icon?: React.ReactNode
  height?: string
}

export type FileListProps = {
  files?: FileItem[]
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  className?: string
}


