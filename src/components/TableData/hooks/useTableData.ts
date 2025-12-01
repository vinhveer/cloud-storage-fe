import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import type { TableColumn } from '../../Table/types'

export type SortConfig<T> = {
  key: keyof T
  direction: 'asc' | 'desc'
} | null

export type UseTableDataOptions<T extends { id: string | number }> = {
  data: T[]
  columns: TableColumn<T>[]
  selectable?: boolean
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  loading?: boolean
}

export function useTableData<T extends { id: string | number }>({
  data,
  columns: _columns,
  selectable = false,
  onSelectionChange,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  loading = false,
}: UseTableDataOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !onLoadMore || !hasMore || isLoadingMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isLoadingMore && !loading) {
          onLoadMore()
        }
      },
      {
        root: containerRef.current,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, hasMore, isLoadingMore, loading])

  const applySelection = useCallback(
    (updater: (prev: Set<string | number>) => Set<string | number>) => {
      setSelectedIds(prev => {
        const next = updater(prev)
        onSelectionChange?.([...next])
        return next
      })
    },
    [onSelectionChange]
  )

  const setSelection = useCallback(
    (ids: Array<string | number>) => {
      setSelectedIds(() => {
        const next = new Set(ids)
        onSelectionChange?.([...next])
        return next
      })
    },
    [onSelectionChange]
  )

  const handleSort = useCallback((column: TableColumn<T>) => {
    if (!column.sortable) return

    setSortConfig(prev => {
      if (prev?.key === column.key) {
        return {
          key: column.key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key: column.key, direction: 'asc' }
    })
  }, [_columns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const handleSelectRow = useCallback((id: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    applySelection(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [applySelection])

  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelection(data.map(row => row.id))
    } else {
      setSelection([])
    }
  }, [data, setSelection])

  const allSelected = data.length > 0 && selectedIds.size === data.length
  const hasSelection = selectable && selectedIds.size > 0
  const showSelectionControls = selectable
  const selectedRows = useMemo(() => data.filter(row => selectedIds.has(row.id)), [data, selectedIds])

  const deselectAll = useCallback(() => setSelection([]), [setSelection])

  return {
    selectedIds,
    sortConfig,
    containerRef,
    loadMoreRef,
    sortedData,
    allSelected,
    hasSelection,
    showSelectionControls,
    selectedRows,
    handleSort,
    handleSelectRow,
    handleSelectAll,
    deselectAll,
  }
}

