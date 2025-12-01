import React from 'react'
import { ArrowUturnRightIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from '@tanstack/react-query'
import { useMyFilesMenuItems } from './useMyFilesMenuItems'
import { useDownloadFile } from '@/api/features/file/file.mutations'
import { useRestoreTrashItem, useDeleteTrashItem } from '@/api/features/trash/trash.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import type { FileItem } from '@/components/FileList/types'

interface UseFileListContextMenuProps {
  contextMenuMode?: 'default' | 'trash'
  dialogs: {
    setShareFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null }>>
    setDeleteFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null }>>
    setRenameFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null }>>
    setMoveFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null; destinationFolderId?: number }>>
    setCopyFileDialog: React.Dispatch<React.SetStateAction<{ open: boolean; file: FileItem | null; destinationFolderId?: number | null; onlyLatest?: boolean }>>
    setShareFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
    setDeleteFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
    setRenameFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
    setMoveFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
    setCopyFolderDialog: React.Dispatch<React.SetStateAction<{ open: boolean; folder: FileItem | null }>>
    setManageAccessDialog: React.Dispatch<React.SetStateAction<{ open: boolean; item: FileItem | null; type: 'file' | 'folder' }>>
    setDetailFile: React.Dispatch<React.SetStateAction<FileItem | null>>
    setVersionsFile: React.Dispatch<React.SetStateAction<FileItem | null>>
    setShareModal: React.Dispatch<React.SetStateAction<{ open: boolean; tab?: 'create' | 'detail'; shareId?: number; createType?: 'file' | 'folder'; createId?: number; createName?: string }>>
  }
}

export function useMyFilesContextMenu({ contextMenuMode = 'default', dialogs }: UseFileListContextMenuProps) {
  const { folderContextMenuItem, fileContextMenuItem } = useMyFilesMenuItems()
  const isTrashContextMenu = contextMenuMode === 'trash'
  const downloadFileMutation = useDownloadFile()
  const restoreTrashItemMutation = useRestoreTrashItem()
  const deleteTrashItemMutation = useDeleteTrashItem()
  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

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
              dialogs.setShareModal({
                open: true,
                tab: 'create',
                createType: 'folder',
                createId: Number(folder.id),
                createName: folder.name,
              })
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
              dialogs.setDeleteFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Rename') {
          return {
            ...item,
            action: (folder: FileItem) => {
              dialogs.setRenameFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Move to') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              dialogs.setMoveFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Copy to') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              dialogs.setCopyFolderDialog({ open: true, folder })
            },
          }
        }
        if (item.label === 'Manage access') {
          return {
            ...item,
            action: (folder: FileItem) => {
              if (!folder.id) return
              dialogs.setManageAccessDialog({ open: true, item: folder, type: 'folder' })
            },
          }
        }
        if (item.label === 'Details') {
          return {
            ...item,
            action: (folder: FileItem) => {
              dialogs.setDetailFile(folder)
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
      dialogs,
      queryClient,
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
              dialogs.setShareModal({
                open: true,
                tab: 'create',
                createType: 'file',
                createId: Number(file.id),
                createName: file.name,
              })
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
              dialogs.setDeleteFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Rename') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              dialogs.setRenameFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Move to') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              dialogs.setMoveFileDialog({ open: true, file })
            },
          }
        }
        if (item.label === 'Copy to') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (!file.id) return
              dialogs.setCopyFileDialog({ open: true, file, destinationFolderId: null, onlyLatest: true })
            },
          }
        }
        if (item.label === 'Details') {
          return {
            ...item,
            action: (file: FileItem) => {
              dialogs.setDetailFile(file)
            },
          }
        }
        if (item.label === 'Versions') {
          return {
            ...item,
            action: (file: FileItem) => {
              if (file.type?.toLowerCase() !== 'folder' && file.id) {
                dialogs.setVersionsFile(file)
              }
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
              dialogs.setManageAccessDialog({ open: true, item: file, type: 'file' })
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
      dialogs,
      queryClient,
    ]
  )

  return {
    enhancedFolderContextMenuItem,
    enhancedFileContextMenuItem,
  }
}

