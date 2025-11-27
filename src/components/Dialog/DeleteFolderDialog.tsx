import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useDeleteFolder } from '@/api/features/folder/folder.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'

export type DeleteFolderDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
  folderId: number
  folderName: string
  title?: string
  onSuccess?: () => void
}

export default function DeleteFolderDialog({ folderId, folderName, onSuccess, title = 'Delete folder', confirmButtonText = 'Delete', cancelButtonText = 'Cancel', confirmType = 'danger', ...dialogProps }: Readonly<DeleteFolderDialogProps>) {
  const deleteFolderMutation = useDeleteFolder()
  const { showAlert } = useAlert()

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteFolderMutation.mutateAsync(folderId)
      showAlert({ type: 'success', message: 'Folder deleted successfully.' })
      onSuccess?.()
    } catch {
      showAlert({ type: 'error', message: 'Failed to delete folder. Please try again.' })
    }
  }, [deleteFolderMutation, folderId, onSuccess, showAlert])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
    >
      <p className="text-sm text-gray-700 dark:text-gray-200">
        Are you sure you want to delete folder "{folderName}"?
      </p>
    </Dialog>
  )
}
