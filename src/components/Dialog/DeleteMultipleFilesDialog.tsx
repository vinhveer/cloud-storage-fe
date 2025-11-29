import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useDeleteFile } from '@/api/features/file/file.mutations'
import { useDeleteFolder } from '@/api/features/folder/folder.mutations'
import type { FileItem } from '@/components/FileList/types'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'

export type DeleteMultipleFilesDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
    title?: string
    items: FileItem[]
    onSuccess?: () => void
}

export default function DeleteMultipleFilesDialog({
    items,
    onSuccess,
    title = 'Delete items',
    confirmButtonText = 'Delete',
    cancelButtonText = 'Cancel',
    confirmType = 'danger',
    ...dialogProps
}: Readonly<DeleteMultipleFilesDialogProps>) {
    const deleteFileMutation = useDeleteFile()
    const deleteFolderMutation = useDeleteFolder()
    const { showAlert } = useAlert()
    const queryClient = useQueryClient()

    const [isDeleting, setIsDeleting] = React.useState(false)
    const [progress, setProgress] = React.useState({ current: 0, total: 0 })

    const fileCount = items.filter(item => (item.type ?? '').toLowerCase() !== 'folder').length
    const folderCount = items.filter(item => (item.type ?? '').toLowerCase() === 'folder').length

    const handleConfirm = React.useCallback(async () => {
        setIsDeleting(true)
        setProgress({ current: 0, total: items.length })

        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const isFolder = (item.type ?? '').toLowerCase() === 'folder'

            try {
                if (isFolder) {
                    await deleteFolderMutation.mutateAsync(Number(item.id))
                } else {
                    await deleteFileMutation.mutateAsync(Number(item.id))
                }
                successCount++
            } catch {
                errorCount++
            }

            setProgress({ current: i + 1, total: items.length })
        }

        setIsDeleting(false)

        queryClient.invalidateQueries({ queryKey: ['trash'], exact: false })

        if (errorCount === 0) {
            showAlert({ type: 'success', message: `Deleted ${successCount} item${successCount > 1 ? 's' : ''} successfully.` })
        } else if (successCount === 0) {
            showAlert({ type: 'error', message: `Failed to delete ${errorCount} item${errorCount > 1 ? 's' : ''}.` })
        } else {
            showAlert({ type: 'warning', message: `Deleted ${successCount} item${successCount > 1 ? 's' : ''} successfully, ${errorCount} failed.` })
        }

        onSuccess?.()
    }, [deleteFileMutation, deleteFolderMutation, items, onSuccess, queryClient, showAlert])

    return (
        <Dialog
            {...dialogProps}
            title={title}
            confirmButtonText={isDeleting ? `Deleting ${progress.current}/${progress.total}...` : confirmButtonText}
            cancelButtonText={cancelButtonText}
            confirmType={confirmType}
            onConfirm={isDeleting ? undefined : handleConfirm}
        >
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete{' '}
                    <strong>{fileCount > 0 ? `${fileCount} file${fileCount > 1 ? 's' : ''}` : ''}</strong>
                    {fileCount > 0 && folderCount > 0 ? ' and ' : ''}
                    <strong>{folderCount > 0 ? `${folderCount} folder${folderCount > 1 ? 's' : ''}` : ''}</strong>?
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                    This action cannot be undone. Items will be moved to trash.
                </p>

                {isDeleting && (
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Deleting {progress.current} of {progress.total} items...
                        </p>
                    </div>
                )}
            </div>
        </Dialog>
    )
}
