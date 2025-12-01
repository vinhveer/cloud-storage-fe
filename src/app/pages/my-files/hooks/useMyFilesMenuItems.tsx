import {
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  LinkIcon,
  UserGroupIcon,
  ArrowUturnRightIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import type { MenuItem, FileItem } from '@/components/FileList/types'
import { useDeleteFolder, useUpdateFolder } from '@/api/features/folder/folder.mutations'
import { useDeleteFile, useUpdateFile } from '@/api/features/file/file.mutations'

export function useMyFilesMenuItems() {
  // Folder hooks
  const deleteFolderMutation = useDeleteFolder()
  const updateFolderMutation = useUpdateFolder()

  // File hooks
  const deleteFileMutation = useDeleteFile()
  const updateFileMutation = useUpdateFile()

  const folderContextMenuItem: MenuItem[] = [
    { label: 'Share', icon: ShareIcon, action: (item: FileItem) => { console.log('Share folder', item) } },
    { label: 'Copy link', icon: LinkIcon, action: (item: FileItem) => { console.log('Copy link', item) } },
    { label: 'Manage access', icon: UserGroupIcon, action: (item: FileItem) => { console.log('Manage access', item) } },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: 'danger',
      action: (item: FileItem) => { if (item.id) deleteFolderMutation.mutate(Number(item.id)) },
    },
    {
      label: 'Rename',
      icon: PencilIcon,
      action: (item: FileItem) => {
        const newName = prompt('Enter new folder name:', item.name)
        if (newName && item.id) updateFolderMutation.mutate({ folderId: Number(item.id), folder_name: newName })
      },
    },
    { label: 'Move to', icon: ArrowUturnRightIcon, action: (item: FileItem) => { console.log('Move to', item) } },
    { label: 'Copy to', icon: DocumentDuplicateIcon, action: (item: FileItem) => { console.log('Copy to', item) } },
    { label: 'Details', icon: InformationCircleIcon, action: (item: FileItem) => { console.log('Details', item) } },
  ]

  const folderToolbarItem: MenuItem[] = [
    {
      label: 'Rename',
      icon: PencilIcon,
      action: (item: FileItem) => {
        const newName = prompt('Enter new folder name:', item.name)
        if (newName && item.id) updateFolderMutation.mutate({ folderId: Number(item.id), folder_name: newName })
      },
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: 'danger',
      action: (item: FileItem) => { if (item.id) deleteFolderMutation.mutate(Number(item.id)) },
    },
  ]

  const fileContextMenuItem: MenuItem[] = [
    { label: 'Share', icon: ShareIcon, action: (item: FileItem) => { console.log('Share file', item) } },
    { label: 'Copy link', icon: LinkIcon, action: (item: FileItem) => { console.log('Copy link', item) } },
    { label: 'Manage access', icon: UserGroupIcon, action: (item: FileItem) => { console.log('Manage access', item) } },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: 'danger',
      action: (item: FileItem) => { if (item.id) deleteFileMutation.mutate(Number(item.id)) },
    },
    { label: 'Download', icon: ArrowDownTrayIcon, action: (item: FileItem) => { console.log('Download', item) } },
    {
      label: 'Rename',
      icon: PencilIcon,
      action: (item: FileItem) => {
        const newName = prompt('Enter new file name:', item.name)
        if (newName && item.id) updateFileMutation.mutate({ fileId: Number(item.id), displayName: newName })
      },
    },
    { label: 'Move to', icon: ArrowUturnRightIcon, action: (item: FileItem) => { console.log('Move to', item) } },
    { label: 'Copy to', icon: DocumentDuplicateIcon, action: (item: FileItem) => { console.log('Copy to', item) } },
    { label: 'Details', icon: InformationCircleIcon, action: (item: FileItem) => { console.log('Details', item) } },
    { label: 'Versions', icon: ClockIcon, action: (item: FileItem) => { console.log('Versions', item) } },
  ]

  const fileToolbarItem: MenuItem[] = [
    { label: 'Download', icon: ArrowDownTrayIcon, action: (item: FileItem) => { console.log('Download', item) } },
    {
      label: 'Rename',
      icon: PencilIcon,
      action: (item: FileItem) => {
        const newName = prompt('Enter new file name:', item.name)
        if (newName && item.id) updateFileMutation.mutate({ fileId: Number(item.id), displayName: newName })
      },
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      variant: 'danger',
      action: (item: FileItem) => { if (item.id) deleteFileMutation.mutate(Number(item.id)) },
    },
  ]

  return { folderContextMenuItem, folderToolbarItem, fileContextMenuItem, fileToolbarItem }
}