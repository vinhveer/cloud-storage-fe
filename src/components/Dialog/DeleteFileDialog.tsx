import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useDeleteFile } from '@/api/features/file/file.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'

export type DeleteFileDialogProps = Omit<DialogProps, 'onConfirm'> & {
  fileId: number
  onSuccess?: () => void
}

export default function DeleteFileDialog({ fileId, onSuccess, title = 'Delete file', confirmButtonText = 'Delete', cancelButtonText = 'Cancel', confirmType = 'danger', ...dialogProps }: Readonly<DeleteFileDialogProps>) {
  const deleteFileMutation = useDeleteFile()
  const { showAlert } = useAlert()
  const queryClient = useQueryClient()

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteFileMutation.mutateAsync(fileId)
      showAlert({ type: 'success', message: 'File deleted successfully.' })
      queryClient.invalidateQueries({ queryKey: ['trash'], exact: false })
      onSuccess?.()
    } catch {
      showAlert({ type: 'error', message: 'Failed to delete file. Please try again.' })
    }
  }, [deleteFileMutation, fileId, onSuccess, queryClient, showAlert])

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
