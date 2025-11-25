import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useCopyFile } from '@/api/features/file/file.mutations'

export type CopyFileDialogProps = Omit<DialogProps, 'onConfirm'> & {
  fileId: number
  destinationFolderId?: number | null
  onlyLatest?: boolean
  onSuccess?: () => void
}

export default function CopyFileDialog({ fileId, destinationFolderId, onlyLatest = true, onSuccess, title = 'Copy file', confirmButtonText = 'Copy', cancelButtonText = 'Cancel', confirmType = 'primary', ...dialogProps }: Readonly<CopyFileDialogProps>) {
  const copyFileMutation = useCopyFile()

  const handleConfirm = React.useCallback(async () => {
    await copyFileMutation.mutateAsync({ fileId, destinationFolderId: destinationFolderId ?? null, onlyLatest })
    onSuccess?.()
  }, [copyFileMutation, destinationFolderId, fileId, onSuccess, onlyLatest])

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
