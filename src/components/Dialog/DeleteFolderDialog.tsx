import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useDeleteFolder } from '@/api/features/folder/folder.mutations'

export type DeleteFolderDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
  folderId: number
  folderName: string
  title?: string
}

export default function DeleteFolderDialog({
  folderId,
  folderName,
  title = 'Delete folder',
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
  confirmType = 'danger',
  ...dialogProps
}: Readonly<DeleteFolderDialogProps>) {
  const deleteFolderMutation = useDeleteFolder()

  const handleConfirm = async () => {
    await deleteFolderMutation.mutateAsync(folderId)
    dialogProps.onOpenChange?.(false)
  }

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
