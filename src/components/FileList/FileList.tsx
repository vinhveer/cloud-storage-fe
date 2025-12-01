import React from 'react'
import clsx from 'clsx'
import { useFileList } from './useFileList'
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import ListView from '@/components/FileList/views/ListView'
import GridView from '@/components/FileList/views/GridView'
import TilesView from '@/components/FileList/views/TilesView'
import DetailsView from '@/components/FileList/views/DetailsView'
import SortDropdown, { type SortOption } from '@/components/FileList/SortDropdown'
import FilterDropdown, { type FilterState } from '@/components/FileList/FilterDropdown'
import { sortFiles, filterFiles } from '@/components/FileList/fileListUtils'
import SelectionToolbar from '@/components/FileList/SelectionToolbar'
import ContextMenu from '@/components/FileList/ContextMenu'
import type { FileListProps, ViewMode, FileItem } from '@/components/FileList/types'
import type { SelectionToolbarAction } from './SelectionToolbar'
import { viewModeConfigs } from '@/components/FileList/file-list.constants'

export default function FileList({
  files = [],
  viewMode = 'list',
  onViewModeChange,
  className,
  heightVh,
  onItemClick,
  onItemOpen,
  onItemContext,
  toolbarRight,
  tilesAlignLeft,
  onSelectionChange,
  externalSelectionToolbar,
  onSelectionToolbarAction,
  actionRef,
  folderContextMenuItems,
  fileContextMenuItems,
  hideToolbar = false,
  hideContextMenu = false,
  filterState: externalFilterState,
  onFilterChange,
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

  const [contextMenu, setContextMenu] = React.useState<{
    file: FileItem
    x: number
    y: number
  } | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement | null>(null)

  const [highlightedIndex] = React.useState<number | null>(null)

  const handleItemClick = React.useCallback((file: FileItem, index: number) => {
    if (!selectionMode) {
      if (onItemClick) {
        onItemClick(file, index)
      } else {
        onItemOpen?.(file, index)
      }
    }
  }, [selectionMode, onItemClick, onItemOpen])

  // Sort and filter state
  const [sortOption, setSortOption] = React.useState<SortOption>('name-asc')
  const [internalFilterState, setInternalFilterState] = React.useState<FilterState>({
    fileType: 'all',
    date: 'all',
    size: 'all',
  })
  
  // Use external filter state if provided, otherwise use internal
  const filterState = externalFilterState ?? internalFilterState
  const setFilterState = React.useCallback((newState: FilterState) => {
    if (onFilterChange) {
      onFilterChange(newState)
    } else {
      setInternalFilterState(newState)
    }
  }, [onFilterChange])

  // Apply filtering and sorting to files
  const processedFiles = React.useMemo(() => {
    const filtered = filterFiles(files, filterState)
    return sortFiles(filtered, sortOption)
  }, [files, filterState, sortOption])

  React.useEffect(() => {
    if (!onSelectionChange) return
    const selected = selectedItems.map(idx => processedFiles[idx]).filter(Boolean)
    onSelectionChange(selected)
  }, [processedFiles, onSelectionChange, selectedItems])

  React.useEffect(() => {
    setViewMode(viewMode)
  }, [viewMode, setViewMode])

  React.useEffect(() => {
    const handle = (mode: ViewMode) => onViewModeChange?.(mode)
    handle(currentViewMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentViewMode])

  const currentView = viewModeConfigs[currentViewMode]

  const handleContextMenu = (file: FileItem, index: number, clientX: number, clientY: number) => {
    setContextMenu({ file, x: clientX, y: clientY })
    onItemContext?.(file, index, clientX, clientY)
  }

  const handleToolbarAction = (action: SelectionToolbarAction, items: FileItem[]) => {
    if (externalSelectionToolbar && onSelectionToolbarAction) {
      onSelectionToolbarAction(action, items)
      return
    }
    if (items.length === 0) return
    const firstItem = items[0]
    switch (action) {
      case 'open':
        if (items.length === 1) {
          onItemOpen?.(firstItem, 0)
        }
        break
      case 'deselectAll':
        deselectAll()
        break
      default:
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
      {contextMenu && folderContextMenuItems && fileContextMenuItems && (
        <ContextMenu
          file={contextMenu.file}
          x={contextMenu.x}
          y={contextMenu.y}
          containerRect={containerRef.current?.getBoundingClientRect()}
          menuItems={(contextMenu.file.type ?? '').toLowerCase() === 'folder' ? folderContextMenuItems : fileContextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}

      <div
        ref={containerRef}
        className={clsx('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col', className)}
        style={heightVh ? { height: `${heightVh}dvh` } : undefined}
      >
        {/* Toolbar */}
        {!hideToolbar && (
          <div className="relative px-3 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 min-w-0">
                {/* View mode dropdown */}
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev: boolean) => !prev)}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                  >
                    <span className="text-sm">
                      <currentView.icon className="w-4 h-4" />
                    </span>
                    <span className="hidden sm:inline">{currentView.label}</span>
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
                    'flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 flex-shrink-0',
                    selectionMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700'
                  )}
                  aria-pressed={selectionMode}
                >
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{selectionMode ? 'Cancel' : 'Select'}</span>
                </button>

                {selectionMode && (
                  <div className="flex items-center flex-wrap gap-2 min-w-0">
                    <button type="button" onClick={selectAll} className="px-2 sm:px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 whitespace-nowrap">Select All</button>
                    <button type="button" onClick={deselectAll} className="px-2 sm:px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 whitespace-nowrap">Deselect All</button>
                    {selectedItems.length > 0 && (
                      <span className="text-sm text-gray-500 whitespace-nowrap">({selectedItems.length} selected)</span>
                    )}
                  </div>
                )}
              </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {toolbarRight ?? (
                <>
                  <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">
                    {processedFiles.length}{processedFiles.length !== files.length ? `/${files.length}` : ''} items
                  </div>
                  <FilterDropdown value={filterState} onChange={setFilterState} />
                  <SortDropdown value={sortOption} onChange={setSortOption} />
                </>
              )}
            </div>
          </div>
          </div>
        )}

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
              onItemContext={hideContextMenu ? undefined : handleContextMenu}
              highlightedIndex={highlightedIndex}
              hideContextMenu={hideContextMenu}
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
              onItemContext={hideContextMenu ? undefined : handleContextMenu}
              highlightedIndex={highlightedIndex}
              hideContextMenu={hideContextMenu}
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
              onItemContext={hideContextMenu ? undefined : handleContextMenu}
              tilesAlignLeft={tilesAlignLeft}
              highlightedIndex={highlightedIndex}
              hideContextMenu={hideContextMenu}
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
              onItemContext={hideContextMenu ? undefined : handleContextMenu}
              highlightedIndex={highlightedIndex}
              hideContextMenu={hideContextMenu}
            />
          )}
        </div>
      </div>
    </>
  )
}
