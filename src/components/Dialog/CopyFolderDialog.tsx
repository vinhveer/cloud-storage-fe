import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useCopyFolder } from '@/api/features/folder/folder.mutations'
import { useFolderTree } from '@/api/features/folder/folder.queries'
import type { FolderTreeNode } from '@/api/features/folder/folder.types'
import { useAlert } from '@/components/Alert/AlertProvider'

export type CopyFolderDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
    title?: string
    folderId: number
    folderName: string
    /** Optional initial destination folder id */
    destinationFolderId?: number | null
    onSuccess?: () => void
}

type FlattenedFolder = FolderTreeNode & { depth: number }

function flattenFolderTree(nodes: FolderTreeNode[] | undefined, excludeFolderId: number, depth = 0): FlattenedFolder[] {
    if (!nodes) return []
    const result: FlattenedFolder[] = []
    for (const node of nodes) {
        // Exclude the folder being copied (can't copy into itself)
        if (node.folder_id === excludeFolderId) continue
        result.push({ ...node, depth })
        if (node.children && node.children.length > 0) {
            result.push(...flattenFolderTree(node.children, excludeFolderId, depth + 1))
        }
    }
    return result
}

export default function CopyFolderDialog({
    folderId,
    folderName,
    destinationFolderId,
    onSuccess,
    title = 'Copy folder',
    confirmButtonText = 'Copy',
    cancelButtonText = 'Cancel',
    confirmType = 'primary',
    ...dialogProps
}: Readonly<CopyFolderDialogProps>) {
    const copyFolderMutation = useCopyFolder()
    const { data: folderTree, isLoading } = useFolderTree()
    const { showAlert } = useAlert()

    const [targetFolderId, setTargetFolderId] = React.useState<number | null>(destinationFolderId ?? null)

    const folders = React.useMemo(
        () => flattenFolderTree(folderTree?.folders ?? [], folderId),
        [folderTree, folderId]
    )

    const handleConfirm = React.useCallback(async () => {
        try {
            await copyFolderMutation.mutateAsync({ folderId, target_folder_id: targetFolderId })
            showAlert({ type: 'success', message: 'Folder copied successfully.' })
            onSuccess?.()
        } catch {
            showAlert({ type: 'error', message: 'Failed to copy folder. Please try again.' })
        }
    }, [copyFolderMutation, folderId, onSuccess, targetFolderId, showAlert])

    const isCopyDisabled = copyFolderMutation.isPending

    return (
        <Dialog
            {...dialogProps}
            title={title}
            confirmButtonText={confirmButtonText}
            cancelButtonText={cancelButtonText}
            confirmType={confirmType}
            onConfirm={isCopyDisabled ? undefined : handleConfirm}
        >
            <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Choose a destination folder to copy "<strong>{folderName}</strong>".
                </p>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900/40">
                    {/* Root folder option */}
                    <button
                        type="button"
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
                            No other folders available.
                        </div>
                    )}

                    {!isLoading && folders.length > 0 && (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                            {folders.map(folder => (
                                <li key={folder.folder_id}>
                                    <button
                                        type="button"
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

                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select a location to copy the folder.
                </p>
            </div>
        </Dialog>
    )
}
