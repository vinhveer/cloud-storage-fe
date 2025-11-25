import React from 'react'
import clsx from 'clsx'
import { useFileList } from './useFileList'
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import ListView from '@/components/FileList/views/ListView'
import GridView from '@/components/FileList/views/GridView'
import TilesView from '@/components/FileList/views/TilesView'
import DetailsView from '@/components/FileList/views/DetailsView'
import FilterButton from '@/components/FileList/FilterButton'
import SortButton from '@/components/FileList/SortButton'
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
import ShareFileDialog from '@/components/Dialog/ShareFileDialog'
import FileDetailPanel from '@/components/FileList/FileDetailPanel'
import { useAlert } from '@/components/Alert/AlertProvider'
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
}: Readonly<FileListProps>) {
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

  const [contextMenu, setContextMenu] = React.useState<{
    file: FileItem
    x: number
    y: number
  } | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const dropdownRef = React.useRef<HTMLDivElement | null>(null)

  const [detailFile, setDetailFile] = React.useState<FileItem | null>(null)

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

  const { folderContextMenuItem, fileContextMenuItem } = useMockMenuItems()

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
    () =>
      folderContextMenuItem.map(item => {
        if (item.label === 'Copy link') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              const link = `${window.location.origin}/share/folder/${folder.id}`
              void navigator.clipboard.writeText(link)
              showAlert({ type: 'success', message: 'Đã sao chép liên kết' })
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
        // Move to / Copy to / Details for folder: keep as is (no implementation yet)
        return item
      }),
    [folderContextMenuItem]
  )

  const enhancedFileContextMenuItem = React.useMemo(
    () =>
      fileContextMenuItem.map(item => {
        if (item.label === 'Copy link') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              const link = `${window.location.origin}/share/file/${file.id}`
              void navigator.clipboard.writeText(link)
              showAlert({ type: 'success', message: 'Đã sao chép liên kết' })
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
        return item
      }),
    [fileContextMenuItem]
  )

  const handleContextMenu = (file: FileItem, index: number, clientX: number, clientY: number) => {
    // On right-click, only open context menu without toggling selection mode
    setContextMenu({ file, x: clientX, y: clientY })
    onItemContext?.(file, index, clientX, clientY)
  }

  const handleToolbarAction = (action: SelectionToolbarAction, items: FileItem[]) => {
    // Dispatch action - in real app, these would call actual APIs
    // For now, just log and show placeholder behavior
    // eslint-disable-next-line no-console
    console.log('Toolbar action:', action, 'items:', items)

    switch (action) {
      case 'open':
        if (items.length === 1) {
          onItemOpen?.(items[0], 0) // Index 0 is placeholder, logic usually depends on ID
        }
        break
      case 'share':
        // TODO: show share dialog
        break
      case 'copyLink':
        // TODO: copy to clipboard
        break
      case 'delete':
        // TODO: delete items via API
        break
      case 'download':
        // TODO: download items
        break
      case 'moveTo':
        // TODO: show move dialog
        break
      case 'copyTo':
        // TODO: show copy dialog
        break
      case 'rename':
        // TODO: show rename dialog (single item only)
        break
      case 'details':
        // TODO: show details panel
        break
      case 'deselectAll':
        deselectAll()
        break
    }
  }

  // No explicit action handler needed; actions are embedded in menu item callbacks

  const getSelectedFilesForToolbar = (): FileItem[] => {
    return selectedItems.map(idx => files[idx]).filter(Boolean)
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
      {selectionMode && selectedItems.length > 0 && !contextMenu && (
        <div className="mb-4">{/* Thêm margin-bottom */}
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
                    {files.length} items
                  </div>
                  <FilterButton />
                  <SortButton />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto flex-1">
          {currentViewMode === 'list' && (
            <ListView
              files={files}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemContext={handleContextMenu}
            />
          )}

          {currentViewMode === 'grid' && (
            <GridView
              files={files}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemContext={handleContextMenu}
            />
          )}

          {currentViewMode === 'tiles' && (
            <TilesView
              files={files}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemContext={handleContextMenu}
              tilesAlignLeft={tilesAlignLeft}
            />
          )}

          {currentViewMode === 'details' && (
            <DetailsView
              files={files}
              selectionMode={selectionMode}
              isSelected={isSelected}
              toggleItem={toggleItem}
              onItemOpen={onItemOpen}
              onItemContext={handleContextMenu}
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
    </>
  )
}
