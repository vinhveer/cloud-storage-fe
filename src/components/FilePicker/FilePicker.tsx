import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFolderContents, getFolderBreadcrumb } from '@/api/features/folder/folder.api'
import { qk } from '@/api/query/keys'
import FileList from '@/components/FileList'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Loading from '@/components/Loading/Loading'
import type { FileItem } from '@/components/FileList/types'
import clsx from 'clsx'

export type FilePickerProps = {
  currentFolderId: number | null
  onFolderChange: (folderId: number | null) => void
  selectedFolderId: number | null
  onSelectFolder: (folderId: number | null) => void
  excludeFolderIds?: number[]
  className?: string
  disabled?: boolean
}

export default function FilePicker({
  currentFolderId,
  onFolderChange,
  selectedFolderId,
  onSelectFolder,
  excludeFolderIds = [],
  className,
  disabled = false,
}: Readonly<FilePickerProps>) {
  const [selectedFolderName, setSelectedFolderName] = React.useState<string | null>(null)

  const { data: contents, isLoading } = useQuery({
    queryKey: qk.folders.contents(currentFolderId ?? 'root'),
    queryFn: () => {
      if (currentFolderId === null) {
        return getFolderContents(0)
      }
      return getFolderContents(currentFolderId)
    },
  })

  const { data: breadcrumbData } = useQuery({
    queryKey: qk.folders.breadcrumb(currentFolderId ?? 'root'),
    queryFn: () => {
      if (currentFolderId === null) return null
      return getFolderBreadcrumb(currentFolderId)
    },
    enabled: currentFolderId !== null,
  })

  const files: FileItem[] = React.useMemo(() => {
    if (!contents) return []

    const folders = contents.folders
      .filter(folder => !excludeFolderIds.includes(folder.folder_id))
      .map((folder) => ({
        id: folder.folder_id,
        name: folder.folder_name,
        type: 'Folder',
        modified: new Date(folder.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }))

    return folders
  }, [contents, excludeFolderIds])

  const breadcrumbItems = React.useMemo(() => {
    const items = [{ id: 'root', label: 'My Files' }]

    if (breadcrumbData?.breadcrumb) {
      breadcrumbData.breadcrumb.forEach((item) => {
        items.push({
          id: `folder-${item.folder_id}`,
          label: item.folder_name,
        })
      })
    }

    return items
  }, [breadcrumbData])

  const handleBreadcrumbClick = React.useCallback((item: { id?: string; label: string }) => {
    if (disabled || !item.id) return
    if (item.id === 'root') {
      onFolderChange(null)
    } else {
      const folderId = item.id.replace('folder-', '')
      onFolderChange(Number(folderId))
    }
  }, [onFolderChange, disabled])

  const handleItemOpen = React.useCallback((file: FileItem) => {
    if (disabled || file.type !== 'Folder' || file.id == null) return
    onFolderChange(Number(file.id))
  }, [onFolderChange, disabled])

  const handleItemClick = React.useCallback((file: FileItem) => {
    if (disabled || file.type !== 'Folder' || file.id == null) return
    setSelectedFolderName(file.name)
    onSelectFolder(Number(file.id))
  }, [onSelectFolder, disabled])

  const handleBreadcrumbSelect = React.useCallback((item: { id?: string; label: string }) => {
    if (disabled || !item.id) return
    if (item.id === 'root') {
      setSelectedFolderName(null)
      onSelectFolder(null)
    } else {
      const folderId = item.id.replace('folder-', '')
      setSelectedFolderName(item.label)
      onSelectFolder(Number(folderId))
    }
  }, [onSelectFolder, disabled])


  return (
    <div className={clsx('flex flex-col h-full', className)}>
      <div className="min-h-[28px] flex items-center min-w-0 mb-3">
        <Breadcrumb
          items={breadcrumbItems}
          onItemClick={(item) => {
            handleBreadcrumbClick(item)
            handleBreadcrumbSelect(item)
          }}
        />
      </div>

      <div className={clsx('flex-1 min-h-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', disabled && 'opacity-50 pointer-events-none')}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="md" />
          </div>
        ) : (
          <FileList
              files={files}
              viewMode="details"
              className="h-full"
              onItemOpen={handleItemOpen}
              onItemClick={handleItemClick}
              externalSelectionToolbar
              hideToolbar
              hideContextMenu
              folderContextMenuItems={[]}
              fileContextMenuItems={[]}
            />
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Selected
          </label>
          <input
            type="text"
            value={selectedFolderId === null
              ? 'My Files (Root)'
              : selectedFolderName || files.find(f => f.id === selectedFolderId)?.name || 'My Files'}
            disabled
            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            readOnly
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Double click to open folder
        </p>
      </div>
    </div>
  )
}

