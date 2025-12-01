import React from 'react'
import type { DialogProps } from '@/components/Dialog/types'
import { useMoveFolder } from '@/api/features/folder/folder.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { FilePickerModal } from '@/components/FilePicker'

export type MoveFolderDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
  title?: string
  folderId: number
  folderName: string
  destinationFolderId?: number | null
  onSuccess?: () => void
}

export default function MoveFolderDialog({
  folderId,
  folderName,
  destinationFolderId,
  onSuccess,
  title = 'Move folder',
  confirmButtonText = 'Move',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<MoveFolderDialogProps>) {
  const moveFolderMutation = useMoveFolder()
  const { showAlert } = useAlert()

  const handleSelectFolder = React.useCallback(async (targetFolderId: number | null) => {
    try {
      await moveFolderMutation.mutateAsync({ folderId, target_folder_id: targetFolderId })
      showAlert({ type: 'success', message: 'Folder moved successfully.' })
      onSuccess?.()
    } catch {
      showAlert({ type: 'error', message: 'Failed to move folder. Please try again.' })
    }
  }, [folderId, moveFolderMutation, onSuccess, showAlert])

  return (
    <FilePickerModal
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      currentFolderId={destinationFolderId ?? null}
      selectedFolderId={destinationFolderId ?? null}
      excludeFolderIds={[folderId]}
      onSelectFolder={handleSelectFolder}
      height="500px"
    />
  )
}
