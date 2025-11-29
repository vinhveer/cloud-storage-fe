import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { FileItem } from '@/components/FileList'
import type { SelectionToolbarAction } from '@/components/FileList/SelectionToolbar'
import { getFolderContents } from '@/api/features/folder/folder.api'
import { getFolderBreadcrumb } from '@/api/features/folder/folder.api'
import { getFilePreview } from '@/api/features/file/file.api'
import { qk } from '@/api/query/keys'
import { useFileDetail } from '@/api/features/file/file.queries'

export function useMyFiles() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const search = useSearch({ strict: false }) as { folderId?: string; fileId?: string }
  const currentFolderId = search.folderId ? parseInt(search.folderId, 10) : null
  const fileId = search.fileId ? parseInt(search.fileId, 10) : undefined
  const [hasSelection, setHasSelection] = useState(false)
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([])
  const actionRef = useRef<((action: SelectionToolbarAction, items: FileItem[]) => void) | null>(null)

  const { data: fileDetail } = useFileDetail(fileId)
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (!search.fileId) return
    if (hasRedirectedRef.current) return
    if (!fileDetail) return

    const targetFolderId = fileDetail.folder_id

    if (targetFolderId == null) {
      hasRedirectedRef.current = true
      return
    }

    if (currentFolderId === targetFolderId) {
      hasRedirectedRef.current = true
      return
    }

    hasRedirectedRef.current = true
    navigate({
      to: '/my-files',
      search: { folderId: targetFolderId.toString() },
    })
  }, [search.fileId, fileDetail, currentFolderId, navigate])

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
    queryFn: () => getFolderBreadcrumb(currentFolderId!),
    enabled: currentFolderId !== null,
  })

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

  const handleItemOpen = useCallback(async (file: FileItem) => {
    if (file.type === 'Folder' && file.id != null) {
      navigate({
        to: '/my-files',
        search: { folderId: file.id.toString() }
      })
    } else if (file.id != null && file.type !== 'Folder') {
      try {
        const preview = await getFilePreview(Number(file.id))
        if (preview.preview_url) {
          window.open(preview.preview_url, '_blank')
        }
      } catch (error) {
        console.error('Failed to get file preview:', error)
      }
    }
  }, [navigate])

  useEffect(() => {
    const handleFileUploaded = () => {
      queryClient.invalidateQueries({ queryKey: qk.folders.contents(currentFolderId ?? 'root') })
    }

    window.addEventListener('file-uploaded', handleFileUploaded)
    return () => window.removeEventListener('file-uploaded', handleFileUploaded)
  }, [queryClient, currentFolderId])

  const handleBreadcrumbClick = useCallback((item: { id?: string; label: string }) => {
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
  }, [navigate])

  const handleSelectionChange = useCallback((selected: FileItem[]) => {
    setSelectedItems(selected)
    setHasSelection(selected.length > 0)
  }, [])

  const handleDeselectAll = useCallback(() => {
    actionRef.current?.('deselectAll', [])
    setSelectedItems([])
    setHasSelection(false)
  }, [])

  const handleToolbarAction = useCallback((action: SelectionToolbarAction, items: FileItem[]) => {
    actionRef.current?.(action, items)
  }, [])

  return {
    files,
    isLoading,
    breadcrumbItems,
    hasSelection,
    selectedItems,
    actionRef,
    handleItemOpen,
    handleBreadcrumbClick,
    handleSelectionChange,
    handleDeselectAll,
    handleToolbarAction,
  }
}

