import React from 'react'
import clsx from 'clsx'
import { useFileList } from './useFileList'
import { ChevronDownIcon, CheckCircleIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from '@tanstack/react-query'
import ListView from '@/components/FileList/views/ListView'
import GridView from '@/components/FileList/views/GridView'
import TilesView from '@/components/FileList/views/TilesView'
import DetailsView from '@/components/FileList/views/DetailsView'
import SortDropdown, { type SortOption } from '@/components/FileList/SortDropdown'
import FilterDropdown, { type FilterState } from '@/components/FileList/FilterDropdown'
import { sortFiles, filterFiles } from '@/components/FileList/fileListUtils'
import SelectionToolbar from '@/components/FileList/SelectionToolbar'
import ContextMenu from '@/components/FileList/ContextMenu'
import { useMockMenuItems } from '@/components/FileList/mockMenuItems'
import DeleteFileDialog from '@/components/Dialog/DeleteFileDialog'
import DeleteFolderDialog from '@/components/Dialog/DeleteFolderDialog'
import RenameFileDialog from '@/components/Dialog/RenameFileDialog'
import RenameFolderDialog from '@/components/Dialog/RenameFolderDialog'
import ShareFolderDialog from '@/components/Dialog/ShareFolderDialog'
import MoveFileDialog from '@/components/Dialog/MoveFileDialog'
import CopyFileDialog from '@/components/Dialog/CopyFileDialog'
import MoveFolderDialog from '@/components/Dialog/MoveFolderDialog'
import CopyFolderDialog from '@/components/Dialog/CopyFolderDialog'
import ShareFileDialog from '@/components/Dialog/ShareFileDialog'
import ManageAccessDialog from '@/components/Dialog/ManageAccessDialog'
import MoveMultipleFilesDialog from '@/components/Dialog/MoveMultipleFilesDialog'
import CopyMultipleFilesDialog from '@/components/Dialog/CopyMultipleFilesDialog'
import DeleteMultipleFilesDialog from '@/components/Dialog/DeleteMultipleFilesDialog'
import FileDetailPanel from '@/components/FileList/FileDetailPanel'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useDownloadFile } from '@/api/features/file/file.mutations'
import { useRestoreTrashItem, useDeleteTrashItem } from '@/api/features/trash/trash.mutations'
import type { FileListProps, ViewMode, FileItem } from '@/components/FileList/types'
import type { SelectionToolbarAction } from './SelectionToolbar'
import { viewModeConfigs } from '@/components/FileList/file-list.constants'

export default function FileList({
  files = [],
  viewMode = 'list',
  onViewModeChange,
  className,
  heightVh,
  onItemOpen,
  onItemContext,
  toolbarRight,
  tilesAlignLeft,
  onSelectionChange,
  externalSelectionToolbar,
  onSelectionToolbarAction,
  actionRef,
  contextMenuMode = 'default',
}: Readonly<FileListProps & { contextMenuMode?: 'default' | 'trash' }>) {
  const {
    dropdownOpen,
    setDropdownOpen,
    viewMode: currentViewMode,
    setViewMode,
    changeViewMode,
    selectionMode,
    toggleSelectionMode,
    selected: selectedItems,
    isSelected,
    toggleItem,
    selectAll,
    deselectAll,
  } = useFileList({ initialViewMode: viewMode, fileCount: files.length })

  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

  const [contextMenu, setContextMenu] = React.useState<{
    file: FileItem
    x: number
    y: number
  } | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const dropdownRef = React.useRef<HTMLDivElement | null>(null)

  const [detailFile, setDetailFile] = React.useState<FileItem | null>(null)

  // Highlighted item index (single click highlight, not selection mode)
  const [highlightedIndex] = React.useState<number | null>(null)

  // Handle single click to open/view an item
  const handleItemClick = React.useCallback((file: FileItem, index: number) => {
    if (!selectionMode) {
      onItemOpen?.(file, index)
    }
  }, [selectionMode, onItemOpen])

  const [shareFileDialog, setShareFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
  }>({
    open: false,
    file: null,
  })

  const [deleteFileDialog, setDeleteFileDialog] = React.useState<{ open: boolean; file: FileItem | null }>(
    {
      open: false,
      file: null,
    }
  )

  const [renameFileDialog, setRenameFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
  }>({
    open: false,
    file: null,
  })

  const [moveFileDialog, setMoveFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
    destinationFolderId?: number
  }>({
    open: false,
    file: null,
    destinationFolderId: undefined,
  })

  const [copyFileDialog, setCopyFileDialog] = React.useState<{
    open: boolean
    file: FileItem | null
    destinationFolderId?: number | null
    onlyLatest?: boolean
  }>({
    open: false,
    file: null,
    destinationFolderId: null,
    onlyLatest: true,
  })

  const [renameFolderDialog, setRenameFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [deleteFolderDialog, setDeleteFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [shareFolderDialog, setShareFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [moveFolderDialog, setMoveFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [copyFolderDialog, setCopyFolderDialog] = React.useState<{
    open: boolean
    folder: FileItem | null
  }>({
    open: false,
    folder: null,
  })

  const [manageAccessDialog, setManageAccessDialog] = React.useState<{
    open: boolean
    item: FileItem | null
    type: 'file' | 'folder'
  }>({
    open: false,
    item: null,
    type: 'file',
  })

  const [moveMultipleDialog, setMoveMultipleDialog] = React.useState<{
    open: boolean
    items: FileItem[]
  }>({
    open: false,
    items: [],
  })

  const [copyMultipleDialog, setCopyMultipleDialog] = React.useState<{
    open: boolean
    items: FileItem[]
  }>({
    open: false,
    items: [],
  })

  const [deleteMultipleDialog, setDeleteMultipleDialog] = React.useState<{
    open: boolean
    items: FileItem[]
  }>({
    open: false,
    items: [],
  })

  // Sort and filter state
  const [sortOption, setSortOption] = React.useState<SortOption>('name-asc')
  const [filterState, setFilterState] = React.useState<FilterState>({
    fileType: 'all',
    date: 'all',
    size: 'all',
  })

  // Apply filtering and sorting to files
  const processedFiles = React.useMemo(() => {
    const filtered = filterFiles(files, filterState)
    return sortFiles(filtered, sortOption)
  }, [files, filterState, sortOption])

  // Notify parent when selection changes (for external toolbar/breadcrumb visibility)
  // Note: selectedItems contains indices into processedFiles (after sort/filter), not files
  React.useEffect(() => {
    if (!onSelectionChange) return
    const selected = selectedItems.map(idx => processedFiles[idx]).filter(Boolean)
    onSelectionChange(selected)
  }, [processedFiles, onSelectionChange, selectedItems])

  const { folderContextMenuItem, fileContextMenuItem } = useMockMenuItems()
  const isTrashContextMenu = contextMenuMode === 'trash'
  const downloadFileMutation = useDownloadFile()
  const restoreTrashItemMutation = useRestoreTrashItem()
  const deleteTrashItemMutation = useDeleteTrashItem()

  React.useEffect(() => {
    setViewMode(viewMode)
  }, [viewMode, setViewMode])

  React.useEffect(() => {
    const handle = (mode: ViewMode) => onViewModeChange?.(mode)
    handle(currentViewMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentViewMode])

  const currentView = viewModeConfigs[currentViewMode]

  const enhancedFolderContextMenuItem = React.useMemo(
    () => {
      const baseItems = isTrashContextMenu
        ? folderContextMenuItem.filter(item => ['Delete', 'Download', 'Details'].includes(item.label))
        : folderContextMenuItem

      const itemsWithRestore = isTrashContextMenu
        ? [
          {
            label: 'Restore',
            icon: ArrowUturnRightIcon,
            action: (folder: FileItem) => {
              if (!folder.id) return
              const id = Number(folder.id)
              if (Number.isNaN(id)) return
              const type: 'file' | 'folder' = (folder.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
              restoreTrashItemMutation.mutate(
                { id, type },
                {
                  onSuccess: () => {
                    showAlert({ type: 'success', heading: 'Restored', message: `Restored "${folder.name}" successfully.` })
                    queryClient.invalidateQueries({ queryKey: ['trash'] })
                  },
                  onError: () => {
                    showAlert({ type: 'error', heading: 'Restore Failed', message: `Failed to restore "${folder.name}".` })
                  },
                },
              )
            },
          },
          ...baseItems,
        ]
        : baseItems

      return itemsWithRestore.map(item => {
        if (item.label === 'Copy link') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              const link = `${window.location.origin}/share/folder/${folder.id}`
              void navigator.clipboard.writeText(link)
              showAlert({ type: 'success', heading: 'Link Copied', message: 'Link copied to clipboard.' })
            },
          }
        }
        if (item.label === 'Share') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              setShareFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Delete') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (isTrashContextMenu) {
                if (!folder.id) return
                const id = Number(folder.id)
                if (Number.isNaN(id)) return
                const type: 'file' | 'folder' = (folder.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
                deleteTrashItemMutation.mutate(
                  { id, type },
                  {
                    onSuccess: () => {
                      showAlert({ type: 'success', heading: 'Deleted', message: `Deleted "${folder.name}" permanently.` })
                      queryClient.invalidateQueries({ queryKey: ['trash'] })
                    },
                    onError: () => {
                      showAlert({ type: 'error', heading: 'Delete Failed', message: `Failed to delete "${folder.name}".` })
                    },
                  },
                )
                return
              }
              setDeleteFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Rename') {
          return {
            ...item,
            action: (folder: FileItem) => {
              setRenameFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Move to') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              setMoveFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Copy to') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              setCopyFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Manage access') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              setManageAccessDialog({ open: true, item: folder, type: 'folder' })
            },
          }
        }
        if (item.label === 'Details') {
          return {
            ...item,
            action: (folder: FileItem) => {
              setDetailFile(folder)
            },
          }
        }
        return item
      })
    },
    [
      deleteTrashItemMutation,
      folderContextMenuItem,
      isTrashContextMenu,
      restoreTrashItemMutation,
      showAlert,
    ]
  )

  const enhancedFileContextMenuItem = React.useMemo(
    () => {
      const baseItems = isTrashContextMenu
        ? fileContextMenuItem.filter(item => ['Delete', 'Download', 'Details'].includes(item.label))
        : fileContextMenuItem

      const itemsWithRestore = isTrashContextMenu
        ? [
          {
            label: 'Restore',
            icon: ArrowUturnRightIcon,
            action: (file: FileItem) => {
              if (!file.id) return
              const id = Number(file.id)
              if (Number.isNaN(id)) return
              const type: 'file' | 'folder' = (file.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
              restoreTrashItemMutation.mutate(
                { id, type },
                {
                  onSuccess: () => {
                    showAlert({ type: 'success', heading: 'Restored', message: `Restored "${file.name}" successfully.` })
                    queryClient.invalidateQueries({ queryKey: ['trash'] })
                  },
                  onError: () => {
                    showAlert({ type: 'error', heading: 'Restore Failed', message: `Failed to restore "${file.name}".` })
                  },
                },
              )
            },
          },
          ...baseItems,
        ]
        : baseItems

      return itemsWithRestore.map(item => {
        if (item.label === 'Copy link') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              const link = `${window.location.origin}/share/file/${file.id}`
              void navigator.clipboard.writeText(link)
              showAlert({ type: 'success', heading: 'Link Copied', message: 'Link copied to clipboard.' })
            },
          }
        }
        if (item.label === 'Share') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              setShareFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Delete') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (isTrashContextMenu) {
                if (!file.id) return
                const id = Number(file.id)
                if (Number.isNaN(id)) return
                const type: 'file' | 'folder' = (file.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
                deleteTrashItemMutation.mutate(
                  { id, type },
                  {
                    onSuccess: () => {
                      showAlert({ type: 'success', heading: 'Deleted', message: `Deleted "${file.name}" permanently.` })
                      queryClient.invalidateQueries({ queryKey: ['trash'] })
                    },
                    onError: () => {
                      showAlert({ type: 'error', heading: 'Delete Failed', message: `Failed to delete "${file.name}".` })
                    },
                  },
                )
                return
              }
              if (!file.id) return
              setDeleteFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Rename') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              setRenameFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Move to') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              setMoveFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Copy to') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              setCopyFileDialog({ open: true, file, destinationFolderId: null, onlyLatest: true })
            },
          }
        }
        if (item.label === 'Details') {
          return {
            ...item,
            action: (file: FileItem) => {
              setDetailFile(file)
            },
          }
        }
        if (item.label === 'Download') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              downloadFileMutation.mutate(Number(file.id), {
                onSuccess: (blob) => {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = file.name
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                  showAlert({ type: 'success', heading: 'Downloaded', message: `Downloaded "${file.name}" successfully.` })
                },
                onError: () => {
                  showAlert({ type: 'error', heading: 'Download Failed', message: `Failed to download "${file.name}".` })
                },
              })
            },
          }
        }
        if (item.label === 'Manage access') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              setManageAccessDialog({ open: true, item: file, type: 'file' })
            },
          }
        }
        return item
      })
    },
    [
      deleteTrashItemMutation,
      downloadFileMutation,
      fileContextMenuItem,
      isTrashContextMenu,
      restoreTrashItemMutation,
      showAlert,
    ]
  )

  const handleContextMenu = (file: FileItem, index: number, clientX: number, clientY: number) => {
    // On right-click, only open context menu without changing current selection/toolbar state
    setContextMenu({ file, x: clientX, y: clientY })
    onItemContext?.(file, index, clientX, clientY)
  }

  const handleToolbarAction = (action: SelectionToolbarAction, items: FileItem[]) => {
    // If external toolbar is controlling actions, just notify parent
    if (externalSelectionToolbar && onSelectionToolbarAction) {
      onSelectionToolbarAction(action, items)
      return
    }
    if (items.length === 0) return

    const firstItem = items[0]
    const isFolder = (firstItem.type ?? '').toLowerCase() === 'folder'

    switch (action) {
      case 'open':
        if (items.length === 1) {
          onItemOpen?.(firstItem, 0)
        }
        break
      case 'share':
        if (items.length === 1 && firstItem.id) {
          if (isFolder) {
            setShareFolderDialog({ open: true, folder: firstItem })
          } else {
            setShareFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'copyLink': {
        if (items.length === 1 && firstItem.id) {
          const type = isFolder ? 'folder' : 'file'
          const link = `${window.location.origin}/share/${type}/${firstItem.id}`
          void navigator.clipboard.writeText(link)
          showAlert({ type: 'success', message: 'Link copied to clipboard.' })
        }
        break
      }
      case 'delete':
        if (isTrashContextMenu) {
          // Permanent delete from Trash using trash API
          for (const item of items) {
            if (!item.id) continue
            const id = Number(item.id)
            if (Number.isNaN(id)) continue
            const type: 'file' | 'folder' = (item.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
            deleteTrashItemMutation.mutate(
              { id, type },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['trash'] })
                },
              },
            )
          }
          break
        }
        if (items.length > 1) {
          // Multiple items - use batch dialog
          setDeleteMultipleDialog({ open: true, items })
        } else if (items.length === 1 && firstItem.id) {
          // Single item - use specific dialog
          if (isFolder) {
            setDeleteFolderDialog({ open: true, folder: firstItem })
          } else {
            setDeleteFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'download': {
        // Download files (folders not supported)
        const filesToDownload = items.filter(item => item.id && (item.type ?? '').toLowerCase() !== 'folder')
        if (filesToDownload.length === 0) {
          showAlert({ type: 'warning', heading: 'Download Warning', message: 'No files to download (folders are not supported).' })
          break
        }

        // Download files sequentially to avoid mutation conflicts
        const downloadFiles = async () => {
          let downloadedCount = 0
          let errorCount = 0

          for (const item of filesToDownload) {
            try {
              const blob = await downloadFileMutation.mutateAsync(Number(item.id))
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = item.name
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
              downloadedCount++
            } catch {
              errorCount++
            }
          }

          // Show summary
          if (errorCount === 0) {
            showAlert({ type: 'success', heading: 'Downloaded', message: `Downloaded ${downloadedCount} file${downloadedCount > 1 ? 's' : ''} successfully.` })
          } else if (downloadedCount === 0) {
            showAlert({ type: 'error', heading: 'Download Failed', message: 'Failed to download the selected files.' })
          } else {
            showAlert({ type: 'warning', heading: 'Download Warning', message: `Downloaded ${downloadedCount} file${downloadedCount > 1 ? 's' : ''} successfully, ${errorCount} failed.` })
          }
        }

        void downloadFiles()
        break
      }
      case 'moveTo':
        if (items.length > 1) {
          // Multiple items - use batch dialog
          setMoveMultipleDialog({ open: true, items })
        } else if (items.length === 1 && firstItem.id) {
          // Single item - use specific dialog
          if (isFolder) {
            setMoveFolderDialog({ open: true, folder: firstItem })
          } else {
            setMoveFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'copyTo':
        if (items.length > 1) {
          // Multiple items - use batch dialog
          setCopyMultipleDialog({ open: true, items })
        } else if (items.length === 1 && firstItem.id) {
          // Single item - use specific dialog
          if (isFolder) {
            setCopyFolderDialog({ open: true, folder: firstItem })
          } else {
            setCopyFileDialog({ open: true, file: firstItem, destinationFolderId: null, onlyLatest: true })
          }
        }
        break
      case 'rename':
        if (items.length === 1 && firstItem.id) {
          if (isFolder) {
            setRenameFolderDialog({ open: true, folder: firstItem })
          } else {
            setRenameFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'details':
        if (items.length === 1) {
          setDetailFile(firstItem)
        }
        break
      case 'restore':
        if (!isTrashContextMenu) break
        for (const item of items) {
          if (!item.id) continue
          const id = Number(item.id)
          if (Number.isNaN(id)) continue
          const type: 'file' | 'folder' = (item.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
          restoreTrashItemMutation.mutate(
            { id, type },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['trash'] })
              },
            },
          )
        }
        break
      case 'deselectAll':
        deselectAll()
        break
    }
  }

  // Expose handleToolbarAction to parent via actionRef
  React.useEffect(() => {
    if (actionRef) {
      actionRef.current = handleToolbarAction
    }
  }, [actionRef, handleToolbarAction])

  // No explicit action handler needed; actions are embedded in menu item callbacks

  const getSelectedFilesForToolbar = (): FileItem[] => {
    return selectedItems.map(idx => processedFiles[idx]).filter(Boolean)
  }

  React.useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const node = dropdownRef.current
      if (node && !node.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dropdownOpen, setDropdownOpen])

  return (
    <>
      {/* Floating Selection Toolbar */}
      {!externalSelectionToolbar && selectionMode && selectedItems.length > 0 && (
        <div className="">{/* Thêm margin-bottom */}
          <SelectionToolbar
            selectedItems={getSelectedFilesForToolbar()}
            selectedCount={selectedItems.length}
            onAction={handleToolbarAction}
            onDeselectAll={deselectAll}
          />
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          file={contextMenu.file}
          x={contextMenu.x}
          y={contextMenu.y}
          containerRect={containerRef.current?.getBoundingClientRect()}
          menuItems={(contextMenu.file.type ?? '').toLowerCase() === 'folder' ? enhancedFolderContextMenuItem : enhancedFileContextMenuItem}
          onClose={() => setContextMenu(null)}
        />
      )}

      <div
        ref={containerRef}
        className={clsx('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex flex-col', className)}
        style={heightVh ? { height: `${heightVh}dvh` } : undefined}
      >
        {/* Toolbar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* View mode dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev: boolean) => !prev)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <span className="text-sm">
                    <currentView.icon className="w-4 h-4" />
                  </span>
                  <span>{currentView.label}</span>
                  <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {Object.entries(viewModeConfigs).map(([modeKey, cfg]) => (
                      <button
                        key={modeKey}
                        type="button"
                        onClick={() => {
                          changeViewMode(modeKey as ViewMode)
                          setDropdownOpen(false)
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        aria-pressed={currentViewMode === (modeKey as ViewMode)}
                      >
                        <span className="text-sm">
                          <cfg.icon className="w-4 h-4" />
                        </span>
                        <span>{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selection toggle */}
              <button
                type="button"
                onClick={toggleSelectionMode}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200',
                  selectionMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700'
                )}
                aria-pressed={selectionMode}
              >
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span>{selectionMode ? 'Cancel' : 'Select'}</span>
              </button>

              {selectionMode && (
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={selectAll} className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">Select All</button>
                  <button type="button" onClick={deselectAll} className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">Deselect All</button>
                  {selectedItems.length > 0 && (
                    <span className="text-sm text-gray-500">({selectedItems.length} selected)</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {toolbarRight ?? (
                <>
                  <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {processedFiles.length}{processedFiles.length !== files.length ? `/${files.length}` : ''} items
                  </div>
                  <FilterDropdown value={filterState} onChange={setFilterState} />
                  <SortDropdown value={sortOption} onChange={setSortOption} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto flex-1">
          {currentViewMode === 'list' && (
            <ListView
              files={processedFiles}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemClick={handleItemClick}
              onItemContext={handleContextMenu}
              highlightedIndex={highlightedIndex}
            />
          )}

          {currentViewMode === 'grid' && (
            <GridView
              files={processedFiles}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemClick={handleItemClick}
              onItemContext={handleContextMenu}
              highlightedIndex={highlightedIndex}
            />
          )}

          {currentViewMode === 'tiles' && (
            <TilesView
              files={processedFiles}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemClick={handleItemClick}
              onItemContext={handleContextMenu}
              tilesAlignLeft={tilesAlignLeft}
              highlightedIndex={highlightedIndex}
            />
          )}

          {currentViewMode === 'details' && (
            <DetailsView
              files={processedFiles}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemClick={handleItemClick}
              onItemContext={handleContextMenu}
              highlightedIndex={highlightedIndex}
            />
          )}
        </div>
      </div>
      <FileDetailPanel
        file={detailFile}
        open={detailFile != null}
        onClose={() => setDetailFile(null)}
      />
      {deleteFolderDialog.open && deleteFolderDialog.folder?.id && (
        <DeleteFolderDialog
          open={deleteFolderDialog.open}
          onOpenChange={open => {
            if (!open) setDeleteFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(deleteFolderDialog.folder.id)}
          folderName={deleteFolderDialog.folder.name}
        />
      )}
      {renameFolderDialog.open && renameFolderDialog.folder?.id && (
        <RenameFolderDialog
          open={renameFolderDialog.open}
          onOpenChange={open => {
            if (!open) setRenameFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(renameFolderDialog.folder.id)}
          currentName={renameFolderDialog.folder.name}
        />
      )}
      {shareFolderDialog.open && shareFolderDialog.folder?.id && (
        <ShareFolderDialog
          open={shareFolderDialog.open}
          onOpenChange={open => {
            if (!open) setShareFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(shareFolderDialog.folder.id)}
          folderName={shareFolderDialog.folder.name}
        />
      )}
      {shareFileDialog.open && shareFileDialog.file?.id && (
        <ShareFileDialog
          open={shareFileDialog.open}
          onOpenChange={open => {
            if (!open) setShareFileDialog({ open: false, file: null })
          }}
          fileId={Number(shareFileDialog.file.id)}
          fileName={shareFileDialog.file.name}
        />
      )}
      {deleteFileDialog.open && deleteFileDialog.file?.id && (
        <DeleteFileDialog
          open={deleteFileDialog.open}
          onOpenChange={open => {
            if (!open) setDeleteFileDialog({ open: false, file: null })
          }}
          title="Delete file"
          confirmType="danger"
          confirmText={`Are you sure you want to delete "${deleteFileDialog.file.name}"?`}
          fileId={Number(deleteFileDialog.file.id)}
          onSuccess={() => {
            setDeleteFileDialog({ open: false, file: null })
          }}
        />
      )}
      {renameFileDialog.open && renameFileDialog.file?.id && (
        <RenameFileDialog
          open={renameFileDialog.open}
          onOpenChange={open => {
            if (!open) setRenameFileDialog(prev => ({ ...prev, open: false }))
          }}
          fileId={Number(renameFileDialog.file.id)}
          currentName={renameFileDialog.file.name}
          onSuccess={() => {
            setRenameFileDialog(prev => ({ ...prev, open: false }))
          }}
        />
      )}
      {moveFileDialog.open && moveFileDialog.file?.id && (
        <MoveFileDialog
          open={moveFileDialog.open}
          onOpenChange={open => {
            if (!open) setMoveFileDialog(prev => ({ ...prev, open: false }))
          }}
          title="Move file"
          confirmButtonText="Move"
          fileId={Number(moveFileDialog.file.id)}
          destinationFolderId={moveFileDialog.destinationFolderId}
          onSuccess={() => {
            setMoveFileDialog(prev => ({ ...prev, open: false }))
          }}
        />
      )}
      {copyFileDialog.open && copyFileDialog.file?.id && (
        <CopyFileDialog
          open={copyFileDialog.open}
          onOpenChange={open => {
            if (!open) setCopyFileDialog(prev => ({ ...prev, open: false }))
          }}
          title="Copy file"
          confirmButtonText="Copy"
          fileId={Number(copyFileDialog.file.id)}
          destinationFolderId={copyFileDialog.destinationFolderId}
          onlyLatest={copyFileDialog.onlyLatest}
          onSuccess={() => {
            setCopyFileDialog(prev => ({ ...prev, open: false }))
          }}
        />
      )}
      {moveFolderDialog.open && moveFolderDialog.folder?.id && (
        <MoveFolderDialog
          open={moveFolderDialog.open}
          onOpenChange={open => {
            if (!open) setMoveFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(moveFolderDialog.folder.id)}
          folderName={moveFolderDialog.folder.name}
          onSuccess={() => {
            setMoveFolderDialog({ open: false, folder: null })
          }}
        />
      )}
      {copyFolderDialog.open && copyFolderDialog.folder?.id && (
        <CopyFolderDialog
          open={copyFolderDialog.open}
          onOpenChange={open => {
            if (!open) setCopyFolderDialog({ open: false, folder: null })
          }}
          folderId={Number(copyFolderDialog.folder.id)}
          folderName={copyFolderDialog.folder.name}
          onSuccess={() => {
            setCopyFolderDialog({ open: false, folder: null })
          }}
        />
      )}
      {manageAccessDialog.open && manageAccessDialog.item?.id && (
        <ManageAccessDialog
          open={manageAccessDialog.open}
          onOpenChange={open => {
            if (!open) setManageAccessDialog({ open: false, item: null, type: 'file' })
          }}
          shareableType={manageAccessDialog.type}
          shareableId={Number(manageAccessDialog.item.id)}
          shareableName={manageAccessDialog.item.name}
        />
      )}
      {moveMultipleDialog.open && moveMultipleDialog.items.length > 0 && (
        <MoveMultipleFilesDialog
          open={moveMultipleDialog.open}
          onOpenChange={open => {
            if (!open) setMoveMultipleDialog({ open: false, items: [] })
          }}
          items={moveMultipleDialog.items}
          onSuccess={() => {
            setMoveMultipleDialog({ open: false, items: [] })
            deselectAll()
          }}
        />
      )}
      {copyMultipleDialog.open && copyMultipleDialog.items.length > 0 && (
        <CopyMultipleFilesDialog
          open={copyMultipleDialog.open}
          onOpenChange={open => {
            if (!open) setCopyMultipleDialog({ open: false, items: [] })
          }}
          items={copyMultipleDialog.items}
          onSuccess={() => {
            setCopyMultipleDialog({ open: false, items: [] })
            deselectAll()
          }}
        />
      )}
      {deleteMultipleDialog.open && deleteMultipleDialog.items.length > 0 && (
        <DeleteMultipleFilesDialog
          open={deleteMultipleDialog.open}
          onOpenChange={open => {
            if (!open) setDeleteMultipleDialog({ open: false, items: [] })
          }}
          items={deleteMultipleDialog.items}
          onSuccess={() => {
            setDeleteMultipleDialog({ open: false, items: [] })
            deselectAll()
          }}
        />
      )}
    </>
  )
}
