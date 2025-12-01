import React from 'react'
import type { DialogProps } from '@/components/Dialog/types'
import { useCopyFolder } from '@/api/features/folder/folder.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { FilePickerModal } from '@/components/FilePicker'

export type CopyFolderDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
  title?: string
  folderId: number
  folderName: string
  destinationFolderId?: number | null
  onSuccess?: () => void
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
  const { showAlert } = useAlert()

  const handleSelectFolder = React.useCallback(async (targetFolderId: number | null) => {
    try {
      await copyFolderMutation.mutateAsync({ folderId, target_folder_id: targetFolderId })
      showAlert({ type: 'success', message: 'Folder copied successfully.' })
      onSuccess?.()
    } catch {
      showAlert({ type: 'error', message: 'Failed to copy folder. Please try again.' })
    }
  }, [copyFolderMutation, folderId, onSuccess, showAlert])

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
