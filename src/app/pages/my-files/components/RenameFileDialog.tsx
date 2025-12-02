import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import type { DialogProps } from '@/components/Dialog/types'
import { useUpdateFile } from '@/api/features/file/file.mutations'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'

export type RenameFileDialogProps = Omit<DialogProps, 'onConfirm' | 'confirmText' | 'title' | 'children'> & {
  fileId: number
  currentName: string
  onSuccess?: () => void
  title?: string
}

export default function RenameFileDialog({ fileId, currentName, onSuccess, title = 'Rename', confirmButtonText = 'OK', cancelButtonText = 'Cancel', confirmType = 'primary', ...dialogProps }: Readonly<RenameFileDialogProps>) {
  const updateFileMutation = useUpdateFile()
  const dotIndex = React.useMemo(() => currentName.lastIndexOf('.'), [currentName])
  const baseName = React.useMemo(
    () => (dotIndex > 0 ? currentName.slice(0, dotIndex) : currentName),
    [currentName, dotIndex]
  )
  const extension = React.useMemo(
    () => (dotIndex > 0 ? currentName.slice(dotIndex) : ''),
    [currentName, dotIndex]
  )

  const [name, setName] = React.useState(baseName)

  const handleConfirm = React.useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const nextName = `${trimmed}${extension}`
    await updateFileMutation.mutateAsync({ fileId, displayName: nextName })
    onSuccess?.()
  }, [extension, fileId, name, onSuccess, updateFileMutation])

  React.useEffect(() => {
    const el = document.getElementById('rename-file-input') as HTMLInputElement | null
    if (!el) return
    const baseLength = baseName.length
    requestAnimationFrame(() => {
      el.setSelectionRange(0, baseLength)
    })
  }, [baseName])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
    >
      <FormGroup>
        <FormInput
          id="rename-file-input"
          autoFocus
          value={`${name}${extension}`}
          onChange={e => {
            const value = e.target.value
            const idx = value.lastIndexOf('.')
            const nextBase = idx > 0 ? value.slice(0, idx) : value
            setName(nextBase)
          }}
        />
      </FormGroup>
    </Dialog>
  )
}
