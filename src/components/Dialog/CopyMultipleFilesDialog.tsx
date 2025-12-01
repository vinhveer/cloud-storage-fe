import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useCopyFile } from '@/api/features/file/file.mutations'
import { useCopyFolder } from '@/api/features/folder/folder.mutations'
import type { FileItem } from '@/components/FileList/types'
import { useAlert } from '@/components/Alert/AlertProvider'
import FilePicker from '@/components/FilePicker/FilePicker'

export type CopyMultipleFilesDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
    title?: string
    items: FileItem[]
    onSuccess?: () => void
}

export default function CopyMultipleFilesDialog({
    items,
    onSuccess,
    title = 'Copy items',
    confirmButtonText = 'Copy',
    cancelButtonText = 'Cancel',
    confirmType = 'primary',
    ...dialogProps
}: Readonly<CopyMultipleFilesDialogProps>) {
    const copyFileMutation = useCopyFile()
    const copyFolderMutation = useCopyFolder()
    const { showAlert } = useAlert()

    const [currentFolderId, setCurrentFolderId] = React.useState<number | null>(null)
    const [targetFolderId, setTargetFolderId] = React.useState<number | null>(null)
    const [isCopying, setIsCopying] = React.useState(false)
    const [progress, setProgress] = React.useState({ current: 0, total: 0 })

    // Exclude folders being copied from being their own destination
    const excludeFolderIds = React.useMemo(() =>
        items.filter(item => (item.type ?? '').toLowerCase() === 'folder').map(item => Number(item.id)),
        [items]
    )

    const fileCount = items.filter(item => (item.type ?? '').toLowerCase() !== 'folder').length
    const folderCount = items.filter(item => (item.type ?? '').toLowerCase() === 'folder').length

    const handleConfirm = React.useCallback(async () => {
        setIsCopying(true)
        setProgress({ current: 0, total: items.length })

        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const isFolder = (item.type ?? '').toLowerCase() === 'folder'

            try {
                if (isFolder) {
                    await copyFolderMutation.mutateAsync({
                        folderId: Number(item.id),
                        target_folder_id: targetFolderId,
                    })
                } else {
                    await copyFileMutation.mutateAsync({
                        fileId: Number(item.id),
                        destinationFolderId: targetFolderId,
                        onlyLatest: true,
                    })
                }
                successCount++
            } catch {
                errorCount++
            }

            setProgress({ current: i + 1, total: items.length })
        }

        setIsCopying(false)

        if (errorCount === 0) {
            showAlert({ type: 'success', message: `Copied ${successCount} item${successCount > 1 ? 's' : ''} successfully.` })
        } else {
            showAlert({ type: 'warning', message: `Copied ${successCount} item${successCount > 1 ? 's' : ''} successfully, ${errorCount} failed.` })
        }

        onSuccess?.()
    }, [items, targetFolderId, copyFileMutation, copyFolderMutation, onSuccess, showAlert])

    return (
        <Dialog
            {...dialogProps}
            title={title}
            confirmButtonText={isCopying ? `Copying ${progress.current}/${progress.total}...` : confirmButtonText}
            cancelButtonText={cancelButtonText}
            confirmType={confirmType}
            onConfirm={isCopying ? undefined : handleConfirm}
            buttonLayout="auto"
            className="[&>div>div]:max-w-[80%] [&>div>div]:w-[80%]"
        >
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Copy <strong>{fileCount > 0 ? `${fileCount} file${fileCount > 1 ? 's' : ''}` : ''}</strong>
                    {fileCount > 0 && folderCount > 0 ? ' and ' : ''}
                    <strong>{folderCount > 0 ? `${folderCount} folder${folderCount > 1 ? 's' : ''}` : ''}</strong> to:
                </p>

                <div style={{ height: '400px' }}>
                    <FilePicker
                        currentFolderId={currentFolderId}
                        onFolderChange={setCurrentFolderId}
                        selectedFolderId={targetFolderId}
                        onSelectFolder={setTargetFolderId}
                        excludeFolderIds={excludeFolderIds}
                        className="h-full"
                        disabled={isCopying}
                    />
                </div>

                {isCopying && (
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Processing {progress.current} of {progress.total} items...
                        </p>
                    </div>
                )}
            </div>
        </Dialog>
    )
}
