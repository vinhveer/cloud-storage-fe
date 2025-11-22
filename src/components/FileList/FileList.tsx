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
import type { FileListProps, ViewMode } from '@/components/FileList/types'
import { viewModeConfigs } from '@/components/FileList/file-list.constants'

export default function FileList({
  files = [],
  viewMode = 'list',
  onViewModeChange,
  className,
  heightVh,
  onItemOpen,
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

  const dropdownRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    setViewMode(viewMode)
  }, [viewMode, setViewMode])

  React.useEffect(() => {
    const handle = (mode: ViewMode) => onViewModeChange?.(mode)
    handle(currentViewMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentViewMode])

  const currentView = viewModeConfigs[currentViewMode]

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
    <div
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
          />
        )}

        {currentViewMode === 'grid' && (
          <GridView
            files={files}
            selectionMode={selectionMode}
            isSelected={isSelected}
            toggleItem={toggleItem}
            onItemOpen={onItemOpen}
          />
        )}

        {currentViewMode === 'tiles' && (
          <TilesView
            files={files}
            selectionMode={selectionMode}
            isSelected={isSelected}
            toggleItem={toggleItem}
            onItemOpen={onItemOpen}
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
          />
        )}
      </div>
    </div>
  )
}

