import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import FilePicker from './FilePicker'

export type FilePickerModalProps = Omit<DialogProps, 'onConfirm' | 'children'> & {
  currentFolderId?: number | null
  selectedFolderId?: number | null
  excludeFolderIds?: number[]
  onSelectFolder: (folderId: number | null) => void
  height?: string
}

export default function FilePickerModal({
  currentFolderId: initialFolderId = null,
  selectedFolderId: initialSelectedId = null,
  excludeFolderIds = [],
  onSelectFolder,
  height = '70vh',
  title = 'Select Folder',
  confirmButtonText = 'Select',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<FilePickerModalProps>) {
  const [currentFolderId, setCurrentFolderId] = React.useState<number | null>(initialFolderId)
  const [selectedFolderId, setSelectedFolderId] = React.useState<number | null>(initialSelectedId)

  const handleConfirm = React.useCallback(() => {
    onSelectFolder(selectedFolderId)
  }, [onSelectFolder, selectedFolderId])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
      className="[&>div>div]:max-w-[80%] [&>div>div]:w-[80%]"
      buttonLayout="auto"
    >
      <div style={{ height }}>
        <FilePicker
          currentFolderId={currentFolderId}
          onFolderChange={setCurrentFolderId}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          excludeFolderIds={excludeFolderIds}
          className="h-full"
        />
      </div>
    </Dialog>
  )
}

