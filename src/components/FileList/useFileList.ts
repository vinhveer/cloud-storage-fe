import React from 'react'
import type { ViewMode } from '@/components/FileList'

export type UseFileListOptions = {
  initialViewMode?: ViewMode
  fileCount?: number
}

export function useFileList({ initialViewMode = 'list', fileCount = 0 }: UseFileListOptions = {}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<ViewMode>(initialViewMode)
  const [selectionMode, setSelectionMode] = React.useState(false)
  const [selected, setSelected] = React.useState<number[]>([])

  const changeViewMode = React.useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  const toggleSelectionMode = React.useCallback(() => {
    setSelectionMode(prev => !prev)
    setSelected([])
  }, [])

  const enableSelectionMode = React.useCallback(() => {
    setSelectionMode(true)
  }, [])

  const selectSingle = React.useCallback((index: number) => {
    setSelected([index])
  }, [])

  const isSelected = React.useCallback((index: number) => selected.includes(index), [selected])

  const toggleItem = React.useCallback((index: number) => {
    setSelected(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]))
  }, [])

  const selectAll = React.useCallback(() => {
    setSelected(Array.from({ length: fileCount }, (_, i) => i))
  }, [fileCount])

  const deselectAll = React.useCallback(() => setSelected([]), [])

  return {
    // UI
    dropdownOpen,
    setDropdownOpen,

    // view
    viewMode,
    setViewMode,
    changeViewMode,

    // selection
    selectionMode,
    toggleSelectionMode,
    enableSelectionMode,
    setSelectionMode,
    selected,
    isSelected,
    toggleItem,
    selectSingle,
    selectAll,
    deselectAll,
  }
}


