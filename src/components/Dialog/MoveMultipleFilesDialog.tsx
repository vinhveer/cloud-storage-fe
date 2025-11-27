import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useMoveFile } from '@/api/features/file/file.mutations'
import { useMoveFolder } from '@/api/features/folder/folder.mutations'
import { useFolderTree } from '@/api/features/folder/folder.queries'
import type { FolderTreeNode } from '@/api/features/folder/folder.types'
import type { FileItem } from '@/components/FileList/types'
import { useAlert } from '@/components/Alert/AlertProvider'

export type MoveMultipleFilesDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
    title?: string
    items: FileItem[]
    onSuccess?: () => void
}

type FlattenedFolder = FolderTreeNode & { depth: number }

function flattenFolderTree(nodes: FolderTreeNode[] | undefined, excludeFolderIds: number[], depth = 0): FlattenedFolder[] {
    if (!nodes) return []
    const result: FlattenedFolder[] = []
    for (const node of nodes) {
        if (excludeFolderIds.includes(node.folder_id)) continue
        result.push({ ...node, depth })
        if (node.children && node.children.length > 0) {
            result.push(...flattenFolderTree(node.children, excludeFolderIds, depth + 1))
        }
    }
    return result
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
    const { data: folderTree, isLoading } = useFolderTree()
    const { showAlert } = useAlert()

    const [targetFolderId, setTargetFolderId] = React.useState<number | null>(null)
    const [isMoving, setIsMoving] = React.useState(false)
    const [progress, setProgress] = React.useState({ current: 0, total: 0 })

    // Exclude folders being moved from the tree
    const excludeFolderIds = React.useMemo(() =>
        items.filter(item => (item.type ?? '').toLowerCase() === 'folder').map(item => Number(item.id)),
        [items]
    )

    const folders = React.useMemo(
        () => flattenFolderTree(folderTree?.folders ?? [], excludeFolderIds),
        [folderTree, excludeFolderIds]
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
        >
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Move <strong>{fileCount > 0 ? `${fileCount} file${fileCount > 1 ? 's' : ''}` : ''}</strong>
                    {fileCount > 0 && folderCount > 0 ? ' and ' : ''}
                    <strong>{folderCount > 0 ? `${folderCount} folder${folderCount > 1 ? 's' : ''}` : ''}</strong> to:
                </p>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900/40">
                    {/* Root folder option */}
                    <button
                        type="button"
                        disabled={isMoving}
                        className={
                            'w-full flex items-center px-4 py-2 text-sm transition-colors border-b border-gray-200 dark:border-gray-800 ' +
                            (targetFolderId === null
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800')
                        }
                        onClick={() => setTargetFolderId(null)}
                    >
                        <span className="mr-2 text-gray-400 dark:text-gray-500">🏠</span>
                        <span>My Files (Root)</span>
                    </button>

                    {isLoading && (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            Loading folders...
                        </div>
                    )}

                    {!isLoading && folders.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            No folders available.
                        </div>
                    )}

                    {!isLoading && folders.length > 0 && (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                            {folders.map(folder => (
                                <li key={folder.folder_id}>
                                    <button
                                        type="button"
                                        disabled={isMoving}
                                        className={
                                            'w-full flex items-center px-4 py-2 text-sm transition-colors ' +
                                            (targetFolderId === folder.folder_id
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800')
                                        }
                                        onClick={() => setTargetFolderId(folder.folder_id)}
                                    >
                                        <span className="mr-2 text-gray-400 dark:text-gray-500">📁</span>
                                        <span style={{ paddingLeft: folder.depth * 12 }}>{folder.folder_name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
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
