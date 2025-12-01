import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { FileItem } from '@/components/FileList'
import type { SelectionToolbarAction } from '@/components/FileList/SelectionToolbar'
import { useAlert } from '@/components/Alert'
import { useEmptyTrash, useRestoreTrashItem, useDeleteTrashItem } from '@/api/features/trash/trash.mutations'
import { useTrash, useTrashFolderContents } from '@/api/features/trash/trash.queries'
import type { ListTrashParams, GetTrashFolderContentsParams } from '@/api/features/trash/trash.api'

export function useTrashPage() {
  const { showAlert } = useAlert()
  const emptyTrashMutation = useEmptyTrash()
  const restoreTrashItemMutation = useRestoreTrashItem()
  const deleteTrashItemMutation = useDeleteTrashItem()
  const queryClient = useQueryClient()

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [folderStack, setFolderStack] = useState<Array<{ id: number; name: string }>>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [folderPage, setFolderPage] = useState(1)
  const [filePage, setFilePage] = useState(1)
  const [perPage] = useState(20)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
      setFolderPage(1)
      setFilePage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const listParams = useMemo<ListTrashParams>(
    () => ({
      search: debouncedSearch.trim() || undefined,
      page,
      per_page: perPage,
    }),
    [debouncedSearch, page, perPage],
  )

  const folderContentsParams = useMemo<GetTrashFolderContentsParams>(
    () => ({
      search: debouncedSearch.trim() || undefined,
      page: Math.max(folderPage, filePage),
      per_page: perPage,
    }),
    [debouncedSearch, folderPage, filePage, perPage],
  )

  const trashQuery = useTrash(listParams)
  const folderContentsQuery = useTrashFolderContents(currentFolderId ?? undefined, folderContentsParams)

  const files = useMemo<FileItem[]>(() => {
    if (currentFolderId === null) {
      if (!trashQuery.data) return []
      return trashQuery.data.items.map(item => ({
        id: item.id,
        name: item.title,
        type: item.type === 'folder' ? 'Folder' : 'File',
        modified: item.deleted_at,
        size: item.file_size != null ? `${item.file_size} B` : undefined,
      }))
    }

    if (!folderContentsQuery.data) return []

    const folders = folderContentsQuery.data.folders.map(folder => ({
      id: folder.folder_id,
      name: folder.folder_name,
      type: 'Folder' as const,
      modified: folder.deleted_at,
    }))

    const files = folderContentsQuery.data.files.map(file => {
      const sizeInKB = file.file_size / 1024
      const sizeInMB = sizeInKB / 1024
      const formattedSize = sizeInMB >= 1
        ? `${sizeInMB.toFixed(1)} MB`
        : `${sizeInKB.toFixed(0)} KB`

      return {
        id: file.file_id,
        name: file.display_name,
        type: file.file_extension.toUpperCase(),
        modified: file.deleted_at,
        size: formattedSize,
      }
    })

    return [...folders, ...files]
  }, [currentFolderId, trashQuery.data, folderContentsQuery.data])

  const [selectedItems, setSelectedItems] = useState<FileItem[]>([])
  const selectionActionRef = useRef<((action: SelectionToolbarAction, items: FileItem[]) => void) | null>(null)
  const [emptyTrashDialog, setEmptyTrashDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; items: FileItem[] }>({ open: false, items: [] })

  const pagination = currentFolderId === null ? trashQuery.data?.pagination : null
  const foldersPagination = currentFolderId !== null ? folderContentsQuery.data?.folders_pagination : null
  const filesPagination = currentFolderId !== null ? folderContentsQuery.data?.files_pagination : null

  const isLoading = (currentFolderId === null ? trashQuery.isLoading : folderContentsQuery.isLoading) ||
    emptyTrashMutation.isPending || restoreTrashItemMutation.isPending || deleteTrashItemMutation.isPending

  const handleEmptyTrash = async () => {
    try {
      const result = await emptyTrashMutation.mutateAsync(undefined)
      showAlert({
        type: 'success',
        heading: 'Trash emptied',
        message: `Successfully deleted ${result.deleted_count.files} files and ${result.deleted_count.folders} folders permanently.`,
        duration: 4000,
      })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      queryClient.invalidateQueries({ queryKey: ['trash-folder-contents'] })
      setEmptyTrashDialog(false)
      setCurrentFolderId(null)
      setFolderStack([])
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Empty Trash failed',
        message: error.message || 'Could not empty Trash. Please try again later.',
        duration: 4000,
      })
    }
  }

  const handleRestore = useCallback(async (items: FileItem[]) => {
    const restorePromises = items.map(item => {
      if (!item.id) return Promise.resolve()
      const id = Number(item.id)
      if (Number.isNaN(id)) return Promise.resolve()
      const type: 'file' | 'folder' = (item.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
      return restoreTrashItemMutation.mutateAsync({ id, type })
    })

    try {
      await Promise.all(restorePromises)
      const count = items.length
      showAlert({
        type: 'success',
        heading: 'Restored',
        message: `Successfully restored ${count} item${count > 1 ? 's' : ''}.`,
        duration: 4000,
      })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      queryClient.invalidateQueries({ queryKey: ['trash-folder-contents'] })
      setSelectedItems([])
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Restore failed',
        message: error.message || 'Failed to restore items. Please try again.',
        duration: 4000,
      })
    }
  }, [restoreTrashItemMutation, showAlert, queryClient])

  const handleDeletePermanently = useCallback(async (items: FileItem[]) => {
    const deletePromises = items.map(item => {
      if (!item.id) return Promise.resolve()
      const id = Number(item.id)
      if (Number.isNaN(id)) return Promise.resolve()
      const type: 'file' | 'folder' = (item.type ?? '').toLowerCase() === 'folder' ? 'folder' : 'file'
      return deleteTrashItemMutation.mutateAsync({ id, type })
    })

    try {
      await Promise.all(deletePromises)
      const count = items.length
      showAlert({
        type: 'success',
        heading: 'Deleted permanently',
        message: `Successfully deleted ${count} item${count > 1 ? 's' : ''} permanently.`,
        duration: 4000,
      })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      queryClient.invalidateQueries({ queryKey: ['trash-folder-contents'] })
      setSelectedItems([])
      setDeleteDialog({ open: false, items: [] })
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Delete failed',
        message: error.message || 'Failed to delete items. Please try again.',
        duration: 4000,
      })
    }
  }, [deleteTrashItemMutation, showAlert, queryClient])

  const handleItemOpen = useCallback((file: FileItem) => {
    if (file.type === 'Folder' && file.id != null) {
      const folderId = Number(file.id)
      if (!Number.isNaN(folderId)) {
        setFolderStack(prev => [...prev, { id: folderId, name: file.name }])
        setCurrentFolderId(folderId)
        setFolderPage(1)
        setFilePage(1)
        setSelectedItems([])
      }
    }
  }, [])

  const handleBreadcrumbClick = useCallback((_item: { id?: string; label: string }, index: number) => {
    if (index === 0) {
      setCurrentFolderId(null)
      setFolderStack([])
      setSelectedItems([])
    } else {
      const targetIndex = index - 1
      const newStack = folderStack.slice(0, targetIndex + 1)
      setFolderStack(newStack)
      if (newStack.length > 0) {
        setCurrentFolderId(newStack[newStack.length - 1].id)
      } else {
        setCurrentFolderId(null)
      }
      setSelectedItems([])
    }
  }, [folderStack])

  const breadcrumbItems = useMemo(() => {
    const items = [{ id: 'trash-root', label: 'Trash' }]
    folderStack.forEach(folder => {
      items.push({ id: `folder-${folder.id}`, label: folder.name })
    })
    return items
  }, [folderStack])

  useEffect(() => {
    if (selectionActionRef.current) {
      const originalHandler = selectionActionRef.current
      selectionActionRef.current = (action: SelectionToolbarAction, items: FileItem[]) => {
        if (action === 'restore') {
          handleRestore(items)
        } else if (action === 'delete') {
          setDeleteDialog({ open: true, items })
        } else if (originalHandler) {
          originalHandler(action, items)
        }
      }
    }
  }, [handleRestore])

  const error = currentFolderId === null ? trashQuery.error : folderContentsQuery.error

  return {
    files,
    selectedItems,
    setSelectedItems,
    selectionActionRef,
    search,
    setSearch,
    debouncedSearch,
    currentFolderId,
    breadcrumbItems,
    pagination,
    foldersPagination,
    filesPagination,
    isLoading,
    error,
    emptyTrashDialog,
    setEmptyTrashDialog,
    deleteDialog,
    setDeleteDialog,
    page,
    setPage,
    folderPage,
    setFolderPage,
    filePage,
    setFilePage,
    handleEmptyTrash,
    handleRestore,
    handleDeletePermanently,
    handleItemOpen,
    handleBreadcrumbClick,
  }
}

