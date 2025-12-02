import React from 'react'
import type { DialogProps } from '@/components/Dialog/types'
import { useCopyFile } from '@/api/features/file/file.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { FilePickerModal } from '@/components/FilePicker'

export type CopyFileDialogProps = Omit<DialogProps, 'onConfirm' | 'children'> & {
  fileId: number
  destinationFolderId?: number | null
  onlyLatest?: boolean
  onSuccess?: () => void
}

export default function CopyFileDialog({
  fileId,
  destinationFolderId,
  onlyLatest = true,
  onSuccess,
  title = 'Copy file',
  confirmButtonText = 'Copy',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<CopyFileDialogProps>) {
  const copyFileMutation = useCopyFile()
  const { showAlert } = useAlert()

  const handleSelectFolder = React.useCallback(async (folderId: number | null) => {
    try {
      await copyFileMutation.mutateAsync({ fileId, destinationFolderId: folderId, onlyLatest })
      showAlert({ type: 'success', message: 'File copied successfully.' })
      onSuccess?.()
    } catch {
      showAlert({ type: 'error', message: 'Failed to copy file. Please try again.' })
    }
  }, [copyFileMutation, fileId, onSuccess, onlyLatest, showAlert])

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
