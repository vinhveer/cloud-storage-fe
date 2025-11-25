import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useDeleteFile } from '@/api/features/file/file.mutations'

export type DeleteFileDialogProps = Omit<DialogProps, 'onConfirm'> & {
  fileId: number
  onSuccess?: () => void
}

export default function DeleteFileDialog({ fileId, onSuccess, title = 'Delete file', confirmButtonText = 'Delete', cancelButtonText = 'Cancel', confirmType = 'danger', ...dialogProps }: Readonly<DeleteFileDialogProps>) {
  const deleteFileMutation = useDeleteFile()

  const handleConfirm = React.useCallback(async () => {
    await deleteFileMutation.mutateAsync(fileId)
    onSuccess?.()
  }, [deleteFileMutation, fileId, onSuccess])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
    />
  )
}
