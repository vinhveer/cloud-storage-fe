import type { TableColumn, TableContextMenuAction, TableToolbarAction } from '../Table/types'

export type TableDataProps<T extends { id: string | number }> = {
  columns: TableColumn<T>[]
  data: T[]
  className?: string
  rowClassName?: string
  headerClassName?: string
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  selectable?: boolean
  onSelectionChange?: (selectedIds: (string | number)[]) => void
  toolbarActions?: TableToolbarAction[]
  onToolbarAction?: (actionId: string, rows: T[]) => void
  contextMenuActions?: TableContextMenuAction[]
  onContextMenuAction?: (actionId: string, row: T) => void
  enableContextMenu?: boolean
  // Infinite scroll props
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

