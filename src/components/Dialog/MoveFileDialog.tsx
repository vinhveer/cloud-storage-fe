import React from 'react'
import type { DialogProps } from '@/components/Dialog/types'
import { useMoveFile } from '@/api/features/file/file.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { FilePickerModal } from '@/components/FilePicker'

export type MoveFileDialogProps = Omit<DialogProps, 'onConfirm' | 'children'> & {
  fileId: number
  destinationFolderId?: number
  onSuccess?: () => void
}

export default function MoveFileDialog({
  fileId,
  destinationFolderId,
  onSuccess,
  title = 'Move file',
  confirmButtonText = 'Move',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<MoveFileDialogProps>) {
  const moveFileMutation = useMoveFile()
  const { showAlert } = useAlert()

  const handleSelectFolder = React.useCallback(async (folderId: number | null) => {
    try {
      await moveFileMutation.mutateAsync({ fileId, destinationFolderId: folderId ?? undefined })
      showAlert({ type: 'success', message: 'File moved successfully.' })
      onSuccess?.()
    } catch {
      showAlert({ type: 'error', message: 'Failed to move file. Please try again.' })
    }
  }, [fileId, moveFileMutation, onSuccess, showAlert])

  return (
    <FilePickerModal
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      currentFolderId={destinationFolderId ?? null}
      selectedFolderId={destinationFolderId ?? null}
      onSelectFolder={handleSelectFolder}
      height="500px"
    />
  )
}
