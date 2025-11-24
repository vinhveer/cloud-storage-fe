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
} from '@heroicons/react/24/outline'
import { useDeleteFolder, useUpdateFolder } from '@/api/features/folder/folder.mutations'
import { useDeleteFile, useUpdateFile } from '@/api/features/file/file.mutations'
import type { MenuItem } from './types'

export const useMenuItems = () => {
    // Folder Mutations
    const deleteFolderMutation = useDeleteFolder()
    const updateFolderMutation = useUpdateFolder()

    // File Mutations
    const deleteFileMutation = useDeleteFile()
    const updateFileMutation = useUpdateFile()

    // --- Folder Actions ---
    const folderContextMenuItem: MenuItem[] = [
        {
            label: 'Share',
            icon: ShareIcon,
            action: (item) => {
                console.log('Share folder', item)
                // TODO: Implement share functionality
            },
        },
        {
            label: 'Copy link',
            icon: LinkIcon,
            action: (item) => {
                console.log('Copy link', item)
                // TODO: Implement copy link functionality
            },
        },
        {
            label: 'Manage access',
            icon: UserGroupIcon,
            action: (item) => {
                console.log('Manage access', item)
                // TODO: Implement manage access functionality
            },
        },
        {
            label: 'Delete',
            icon: TrashIcon,
            variant: 'danger',
            action: (item) => {
                if (confirm(`Are you sure you want to delete folder "${item.name}"?`) && item.id) {
                    deleteFolderMutation.mutate(Number(item.id))
                }
            },
        },
        {
            label: 'Rename',
            icon: PencilIcon,
            action: (item) => {
                const newName = prompt('Enter new folder name:', item.name)
                if (newName && item.id) {
                    updateFolderMutation.mutate({
                        folderId: Number(item.id),
                        folder_name: newName
                    })
                }
            },
        },
        {
            label: 'Move to',
            icon: ArrowUturnRightIcon,
            action: (item) => {
                console.log('Move to', item)
                // TODO: Implement move to functionality
            },
        },
        {
            label: 'Copy to',
            icon: DocumentDuplicateIcon,
            action: (item) => {
                console.log('Copy to', item)
                // TODO: Implement copy to functionality
            },
        },
        {
            label: 'Details',
            icon: InformationCircleIcon,
            action: (item) => {
                console.log('Show details', item)
                // TODO: Implement details panel
            },
        },
    ]

    const folderToolbarItem: MenuItem[] = [
        {
            label: 'Rename',
            icon: PencilIcon,
            action: (item) => {
                const newName = prompt('Enter new folder name:', item.name)
                if (newName && item.id) {
                    updateFolderMutation.mutate({
                        folderId: Number(item.id),
                        folder_name: newName
                    })
                }
            },
        },
        {
            label: 'Delete',
            icon: TrashIcon,
            variant: 'danger',
            action: (item) => {
                if (confirm(`Are you sure you want to delete folder "${item.name}"?`) && item.id) {
                    deleteFolderMutation.mutate(Number(item.id))
                }
            },
        },
    ]

    // --- File Actions ---
    const fileContextMenuItem: MenuItem[] = [
        {
            label: 'Share',
            icon: ShareIcon,
            action: (item) => {
                console.log('Share file', item)
                // TODO: Implement share functionality
            },
        },
        {
            label: 'Copy link',
            icon: LinkIcon,
            action: (item) => {
                console.log('Copy link', item)
                // TODO: Implement copy link functionality
            },
        },
        {
            label: 'Manage access',
            icon: UserGroupIcon,
            action: (item) => {
                console.log('Manage access', item)
                // TODO: Implement manage access functionality
            },
        },
        {
            label: 'Delete',
            icon: TrashIcon,
            variant: 'danger',
            action: (item) => {
                if (confirm(`Are you sure you want to delete file "${item.name}"?`) && item.id) {
                    deleteFileMutation.mutate(Number(item.id))
                }
            },
        },
        {
            label: 'Download',
            icon: ArrowDownTrayIcon,
            action: (item) => {
                console.log('Download file', item)
                // TODO: Implement download functionality
            },
        },
        {
            label: 'Rename',
            icon: PencilIcon,
            action: (item) => {
                const newName = prompt('Enter new file name:', item.name)
                if (newName && item.id) {
                    updateFileMutation.mutate({
                        fileId: Number(item.id),
                        displayName: newName
                    })
                }
            },
        },
        {
            label: 'Move to',
            icon: ArrowUturnRightIcon,
            action: (item) => {
                console.log('Move to', item)
                // TODO: Implement move to functionality
            },
        },
        {
            label: 'Copy to',
            icon: DocumentDuplicateIcon,
            action: (item) => {
                console.log('Copy to', item)
                // TODO: Implement copy to functionality
            },
        },
        {
            label: 'Details',
            icon: InformationCircleIcon,
            action: (item) => {
                console.log('Show details', item)
                // TODO: Implement details panel
            },
        },
    ]

    const fileToolbarItem: MenuItem[] = [
        {
            label: 'Download',
            icon: ArrowDownTrayIcon,
            action: (item) => console.log('Download file', item),
        },
        {
            label: 'Rename',
            icon: PencilIcon,
            action: (item) => {
                const newName = prompt('Enter new file name:', item.name)
                if (newName && item.id) {
                    updateFileMutation.mutate({
                        fileId: Number(item.id),
                        displayName: newName
                    })
                }
            },
        },
        {
            label: 'Delete',
            icon: TrashIcon,
            variant: 'danger',
            action: (item) => {
                if (confirm(`Are you sure you want to delete file "${item.name}"?`) && item.id) {
                    deleteFileMutation.mutate(Number(item.id))
                }
            },
        },
    ]

    // --- Mixed Actions (Both Files and Folders) ---
    const mixedToolbarItem: MenuItem[] = [
        {
            label: 'Delete',
            icon: TrashIcon,
            variant: 'danger',
            action: (item) => {
                // This action will be called for each item in the selection
                if (item.type === 'Folder' && item.id) {
                    deleteFolderMutation.mutate(Number(item.id))
                } else if (item.id) {
                    deleteFileMutation.mutate(Number(item.id))
                }
            },
        },
    ]

    return {
        folderContextMenuItem,
        folderToolbarItem,
        fileContextMenuItem,
        fileToolbarItem,
        mixedToolbarItem,
    }
}