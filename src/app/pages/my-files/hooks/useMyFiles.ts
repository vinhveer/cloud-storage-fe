import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { FileItem } from '@/components/FileList'
import type { SelectionToolbarAction } from '@/components/FileList/SelectionToolbar'
import type { FilterState } from '@/components/FileList/FilterDropdown'
import { getFolderContents } from '@/api/features/folder/folder.api'
import { getFolderBreadcrumb } from '@/api/features/folder/folder.api'
import { qk } from '@/api/query/keys'
import { useFileDetail, useListFiles } from '@/api/features/file/file.queries'
import { useMyFilesDialogs } from './useMyFilesDialogs'
import { useMyFilesContextMenu } from './useMyFilesContextMenu'
import { filterFiles } from '@/components/FileList/fileListUtils'

export function useMyFiles() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const search = useSearch({ strict: false }) as { folderId?: string; fileId?: string; search?: string; page?: string }
  const currentFolderId = search.folderId ? parseInt(search.folderId, 10) : null
  const fileId = search.fileId ? parseInt(search.fileId, 10) : undefined
  const searchQuery = search.search || ''
  const currentPage = search.page ? parseInt(search.page, 10) : 1
  const [hasSelection, setHasSelection] = useState(false)
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([])
  const actionRef = useRef<((action: SelectionToolbarAction, items: FileItem[]) => void) | null>(null)
  
  // Filter state - khi filter thay đổi sẽ gọi lại API
  const [filterState, setFilterState] = useState<FilterState>({
    fileType: 'all',
    date: 'all',
    size: 'all',
  })

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

  // Determine if we should use API (listFiles) or getFolderContents
  // Use API when: search query exists OR filter is active (not all defaults)
  const hasActiveFilter = filterState.fileType !== 'all' || filterState.date !== 'all' || filterState.size !== 'all'
  const shouldUseApi = searchQuery.trim().length > 0 || hasActiveFilter

  // Reset page to 1 when filter changes
  useEffect(() => {
    if (hasActiveFilter && currentPage !== 1) {
      navigate({
        to: '/my-files',
        search: (prev: Record<string, string | undefined>) => ({
          ...prev,
          folderId: search.folderId,
          search: search.search,
          page: '1',
        }),
      })
    }
  }, [filterState, hasActiveFilter, currentPage, navigate, search.folderId, search.search])
  
  const { data: contents, isLoading: isLoadingContents } = useQuery({
    queryKey: qk.folders.contents(currentFolderId ?? 'root'),
    queryFn: () => {
      if (currentFolderId === null) {
        return getFolderContents(0)
      }
      return getFolderContents(currentFolderId)
    },
    enabled: !shouldUseApi,
  })

  const { data: listFilesData, isLoading: isLoadingListFiles } = useListFiles({
    folder_id: currentFolderId ?? undefined,
    search: searchQuery.trim() || undefined,
    page: currentPage,
    per_page: 20,
  })

  const isLoading = shouldUseApi ? isLoadingListFiles : isLoadingContents

  const { data: breadcrumbData } = useQuery({
    queryKey: qk.folders.breadcrumb(currentFolderId ?? 'root'),
    queryFn: () => getFolderBreadcrumb(currentFolderId!),
    enabled: currentFolderId !== null,
  })

  const rawFiles: FileItem[] = useMemo(() => {
    if (shouldUseApi) {
      if (!listFilesData) return []
      
      return listFilesData.data.map((file) => {
        const sizeInKB = file.file_size / 1024
        const sizeInMB = sizeInKB / 1024
        const formattedSize = sizeInMB >= 1
          ? `${sizeInMB.toFixed(1)} MB`
          : `${sizeInKB.toFixed(0)} KB`

        return {
          id: file.file_id,
          name: file.display_name,
          type: file.file_extension.toUpperCase(),
          modified: file.created_at
            ? new Date(file.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            : 'Never opened',
          size: formattedSize,
        }
      })
    }

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
  }, [contents, listFilesData, shouldUseApi])

  // Apply client-side filtering
  const files: FileItem[] = useMemo(() => {
    // Nếu fileType là 'folder', chỉ lấy folders
    if (filterState.fileType === 'folder') {
      return rawFiles.filter(f => (f.type ?? '').toLowerCase() === 'folder')
    }
    
    // Áp dụng filter cho các trường hợp khác
    return filterFiles(rawFiles, filterState)
  }, [rawFiles, filterState])

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

  const [previewFileId, setPreviewFileId] = useState<number | null>(null)
  const [previewFileName, setPreviewFileName] = useState<string>('')

  const dialogs = useMyFilesDialogs()
  const { enhancedFolderContextMenuItem, enhancedFileContextMenuItem } = useMyFilesContextMenu({
    contextMenuMode: 'default',
    dialogs: {
      setShareFileDialog: dialogs.setShareFileDialog,
      setDeleteFileDialog: dialogs.setDeleteFileDialog,
      setRenameFileDialog: dialogs.setRenameFileDialog,
      setMoveFileDialog: dialogs.setMoveFileDialog,
      setCopyFileDialog: dialogs.setCopyFileDialog,
      setShareFolderDialog: dialogs.setShareFolderDialog,
      setDeleteFolderDialog: dialogs.setDeleteFolderDialog,
      setRenameFolderDialog: dialogs.setRenameFolderDialog,
      setMoveFolderDialog: dialogs.setMoveFolderDialog,
      setCopyFolderDialog: dialogs.setCopyFolderDialog,
      setManageAccessDialog: dialogs.setManageAccessDialog,
      setDetailFile: dialogs.setDetailFile,
      setVersionsFile: dialogs.setVersionsFile,
      setShareModal: dialogs.setShareModal,
    },
  })

  const handleItemOpen = useCallback((file: FileItem) => {
    if (file.type === 'Folder' && file.id != null) {
      navigate({
        to: '/my-files',
        search: { folderId: file.id.toString() }
      })
    } else if (file.id != null && file.type !== 'Folder') {
      setPreviewFileId(Number(file.id))
      setPreviewFileName(file.name)
    }
  }, [navigate])

  const handleClosePreview = useCallback(() => {
    setPreviewFileId(null)
    setPreviewFileName('')
  }, [])

  useEffect(() => {
    const handleFileUploaded = () => {
      queryClient.invalidateQueries({ queryKey: qk.folders.contents(currentFolderId ?? 'root') })
      if (shouldUseApi) {
        queryClient.invalidateQueries({ queryKey: qk.file.list({}) })
      }
    }

    window.addEventListener('file-uploaded', handleFileUploaded)
    return () => window.removeEventListener('file-uploaded', handleFileUploaded)
  }, [queryClient, currentFolderId, shouldUseApi])

  const handleSearchChange = useCallback((query: string) => {
    navigate({
      to: '/my-files',
      search: (prev: Record<string, string | undefined>) => ({
        ...prev,
        folderId: search.folderId,
        search: query || undefined,
        page: query ? '1' : undefined, // Reset to page 1 when searching
      }),
    })
  }, [navigate, search.folderId])

  const handlePageChange = useCallback((page: number) => {
    navigate({
      to: '/my-files',
      search: (prev: Record<string, string | undefined>) => ({
        ...prev,
        folderId: search.folderId,
        search: search.search,
        page: page.toString(),
      }),
    })
  }, [navigate, search.folderId, search.search])

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
    if (items.length === 0) return
    const firstItem = items[0]
    const isFolder = (firstItem.type ?? '').toLowerCase() === 'folder'

    switch (action) {
      case 'share':
        if (items.length === 1 && firstItem.id) {
          dialogs.setShareModal({
            open: true,
            tab: 'create',
            createType: isFolder ? 'folder' : 'file',
            createId: Number(firstItem.id),
            createName: firstItem.name,
          })
        }
        break
      case 'copyLink': {
        if (items.length === 1 && firstItem.id) {
          const type = isFolder ? 'folder' : 'file'
          const link = `${window.location.origin}/share/${type}/${firstItem.id}`
          void navigator.clipboard.writeText(link)
        }
        break
      }
      case 'delete':
        if (items.length > 1) {
          dialogs.setDeleteMultipleDialog({ open: true, items })
        } else if (items.length === 1 && firstItem.id) {
          if (isFolder) {
            dialogs.setDeleteFolderDialog({ open: true, folder: firstItem })
          } else {
            dialogs.setDeleteFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'moveTo':
        if (items.length > 1) {
          dialogs.setMoveMultipleDialog({ open: true, items })
        } else if (items.length === 1 && firstItem.id) {
          if (isFolder) {
            dialogs.setMoveFolderDialog({ open: true, folder: firstItem })
          } else {
            dialogs.setMoveFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'copyTo':
        if (items.length > 1) {
          dialogs.setCopyMultipleDialog({ open: true, items })
        } else if (items.length === 1 && firstItem.id) {
          if (isFolder) {
            dialogs.setCopyFolderDialog({ open: true, folder: firstItem })
          } else {
            dialogs.setCopyFileDialog({ open: true, file: firstItem, destinationFolderId: null, onlyLatest: true })
          }
        }
        break
      case 'rename':
        if (items.length === 1 && firstItem.id) {
          if (isFolder) {
            dialogs.setRenameFolderDialog({ open: true, folder: firstItem })
          } else {
            dialogs.setRenameFileDialog({ open: true, file: firstItem })
          }
        }
        break
      case 'details':
        if (items.length === 1) {
          dialogs.setDetailFile(firstItem)
        }
        break
      default:
        actionRef.current?.(action, items)
        break
    }
  }, [dialogs, actionRef])

  const pagination = shouldUseApi ? listFilesData?.pagination : undefined

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
    previewFileId,
    previewFileName,
    handleClosePreview,
    dialogs,
    folderContextMenuItems: enhancedFolderContextMenuItem,
    fileContextMenuItems: enhancedFileContextMenuItem,
    searchQuery,
    handleSearchChange,
    handlePageChange,
    pagination,
    currentFolderId,
    filterState,
    setFilterState,
  }
}

