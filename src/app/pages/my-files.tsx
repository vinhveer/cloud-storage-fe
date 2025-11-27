import { useCallback, useMemo, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'

import FileList from '@/components/FileList'
import type { FileItem } from '@/components/FileList'
import SelectionToolbar, { type SelectionToolbarAction } from '@/components/FileList/SelectionToolbar'

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import { getFolderContents } from '@/api/features/folder/folder.api'
import { getFolderBreadcrumb } from '@/api/features/folder/folder.api'
import { qk } from '@/api/query/keys'

export default function MyFilesPage() {
  const navigate = useNavigate()

  const search = useSearch({ strict: false }) as { folderId?: string }
  const currentFolderId = search.folderId ? parseInt(search.folderId, 10) : null
  const [hasSelection, setHasSelection] = useState(false)
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([])
  const actionRef = useRef<((action: SelectionToolbarAction, items: FileItem[]) => void) | null>(null)

  // Fetch folder contents
  const { data: contents, isLoading } = useQuery({
    queryKey: qk.folders.contents(currentFolderId ?? 'root'),
    queryFn: () => {
      if (currentFolderId === null) {
        // Root folder - fetch folders and files without folder_id
        return getFolderContents(0) // Using 0 or null for root
      }

      return getFolderContents(currentFolderId)
    },
  })

  // Fetch breadcrumb if not at root
  const { data: breadcrumbData } = useQuery({
    queryKey: qk.folders.breadcrumb(currentFolderId ?? 'root'),
    queryFn: () => getFolderBreadcrumb(currentFolderId!),
    enabled: currentFolderId !== null,
  })

  // Transform API data to FileItem format
  const files: FileItem[] = useMemo(() => {
    if (!contents) return []

    const folders = contents.folders.map((folder) => ({
      id: folder.folder_id,
      name: folder.folder_name,
      type: 'Folder',
      modified: new Date(folder.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }))

    const files = contents.files.map((file) => {
      // Format file size
      const sizeInKB = file.file_size / 1024
      const sizeInMB = sizeInKB / 1024
      const formattedSize = sizeInMB >= 1
        ? `${sizeInMB.toFixed(1)} MB`
        : `${sizeInKB.toFixed(0)} KB`

      return {
        id: file.file_id,
        name: file.display_name,
        type: file.file_extension.toUpperCase(),
        modified: file.last_opened_at
          ? new Date(file.last_opened_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          : 'Never opened',
        size: formattedSize,
      }
    })

    return [...folders, ...files]
  }, [contents])

  // Build breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items = [{ id: 'my-files-root', label: 'My Files' }]

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

  const handleItemOpen = (file: FileItem) => {
    if (file.type === 'Folder' && file.id) {
      navigate({
        to: '/my-files',
        search: { folderId: file.id.toString() }
      })
    }
  }

  const handleBreadcrumbClick = (item: { id?: string; label: string }) => {
    if (!item.id) return
    if (item.id === 'my-files-root') {
      navigate({ to: '/my-files' })
    } else {
      const folderId = item.id.replace('folder-', '')
      navigate({
        to: '/my-files',
        search: { folderId }
      })
    }
  }

  const handleSelectionChange = useCallback((selected: FileItem[]) => {
    setSelectedItems(selected)
    setHasSelection(selected.length > 0)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="min-h-[28px] flex items-center">
        {hasSelection ? (
          <SelectionToolbar
            selectedItems={selectedItems}
            selectedCount={selectedItems.length}
            onAction={(action, items) => {
              actionRef.current?.(action, items)
            }}
            onDeselectAll={() => {
              // Clear both parent state and FileList's internal selection
              actionRef.current?.('deselectAll', [])
              setSelectedItems([])
              setHasSelection(false)
            }}
          />
        ) : (
          <Breadcrumb className="mb-6"
            items={breadcrumbItems}
            onItemClick={handleBreadcrumbClick}
          />
        )}
      </header>

      <section className="flex-1 min-h-0 flex flex-col">
        <FileList
          files={files}
          viewMode="details"
          className="flex-1 min-h-0"
          onItemOpen={handleItemOpen}
          onSelectionChange={handleSelectionChange}
          externalSelectionToolbar
          actionRef={actionRef}
        />

      </section>

    </div>
  )
}