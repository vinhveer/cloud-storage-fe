import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useUpdateFolder } from '@/api/features/folder/folder.mutations'

export type RenameFolderDialogProps = Omit<DialogProps, 'onConfirm' | 'children' | 'title'> & {
  folderId: number
  currentName: string
  title?: string
}

export default function RenameFolderDialog({
  folderId,
  currentName,
  title = 'Rename folder',
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<RenameFolderDialogProps>) {
  const [name, setName] = React.useState(currentName)
  const updateFolderMutation = useUpdateFolder()

  React.useEffect(() => {
    setName(currentName)
  }, [currentName])

  const handleConfirm = async () => {
    const trimmed = name.trim()
    if (!trimmed) return

    await updateFolderMutation.mutateAsync({
      folderId,
      folder_name: trimmed,
    })
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
      <div className="space-y-3">
        <label className="block text-sm text-gray-700 dark:text-gray-200">
          Folder name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
          autoFocus
        />
      </div>
    </Dialog>
  )
}
