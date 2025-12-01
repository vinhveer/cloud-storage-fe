import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useMoveFile } from '@/api/features/file/file.mutations'
import { useMoveFolder } from '@/api/features/folder/folder.mutations'
import type { FileItem } from '@/components/FileList/types'
import { useAlert } from '@/components/Alert/AlertProvider'
import FilePicker from '@/components/FilePicker/FilePicker'

export type MoveMultipleFilesDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
    title?: string
    items: FileItem[]
    onSuccess?: () => void
}

export default function MoveMultipleFilesDialog({
    items,
    onSuccess,
    title = 'Move items',
    confirmButtonText = 'Move',
    cancelButtonText = 'Cancel',
    confirmType = 'primary',
    ...dialogProps
}: Readonly<MoveMultipleFilesDialogProps>) {
    const moveFileMutation = useMoveFile()
    const moveFolderMutation = useMoveFolder()
    const { showAlert } = useAlert()

    const [currentFolderId, setCurrentFolderId] = React.useState<number | null>(null)
    const [targetFolderId, setTargetFolderId] = React.useState<number | null>(null)
    const [isMoving, setIsMoving] = React.useState(false)
    const [progress, setProgress] = React.useState({ current: 0, total: 0 })

    // Exclude folders being moved from the tree
    const excludeFolderIds = React.useMemo(() =>
        items.filter(item => (item.type ?? '').toLowerCase() === 'folder').map(item => Number(item.id)),
        [items]
    )

    const fileCount = items.filter(item => (item.type ?? '').toLowerCase() !== 'folder').length
    const folderCount = items.filter(item => (item.type ?? '').toLowerCase() === 'folder').length

    const handleConfirm = React.useCallback(async () => {
        setIsMoving(true)
        setProgress({ current: 0, total: items.length })

        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const isFolder = (item.type ?? '').toLowerCase() === 'folder'

            try {
                if (isFolder) {
                    await moveFolderMutation.mutateAsync({
                        folderId: Number(item.id),
                        target_folder_id: targetFolderId,
                    })
                } else {
                    await moveFileMutation.mutateAsync({
                        fileId: Number(item.id),
                        destinationFolderId: targetFolderId ?? undefined,
                    })
                }
                successCount++
            } catch {
                errorCount++
            }

            setProgress({ current: i + 1, total: items.length })
        }

        setIsMoving(false)

        if (errorCount === 0) {
            showAlert({ type: 'success', message: `Moved ${successCount} item${successCount > 1 ? 's' : ''} successfully.` })
        } else {
            showAlert({ type: 'warning', message: `Moved ${successCount} item${successCount > 1 ? 's' : ''} successfully, ${errorCount} failed.` })
        }

        onSuccess?.()
    }, [items, targetFolderId, moveFileMutation, moveFolderMutation, onSuccess, showAlert])

    return (
        <Dialog
            {...dialogProps}
            title={title}
            confirmButtonText={isMoving ? `Moving ${progress.current}/${progress.total}...` : confirmButtonText}
            cancelButtonText={cancelButtonText}
            confirmType={confirmType}
            onConfirm={isMoving ? undefined : handleConfirm}
            buttonLayout="auto"
            className="[&>div>div]:max-w-[80%] [&>div>div]:w-[80%]"
        >
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Move <strong>{fileCount > 0 ? `${fileCount} file${fileCount > 1 ? 's' : ''}` : ''}</strong>
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
                        disabled={isMoving}
                    />
                </div>

                {isMoving && (
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
