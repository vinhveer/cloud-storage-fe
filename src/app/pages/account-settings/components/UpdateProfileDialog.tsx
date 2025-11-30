import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import type { DialogProps } from '@/components/Dialog/types'
import { useUpdateProfile } from '../hooks/useUpdateProfile'

export type UpdateProfileDialogProps = Omit<DialogProps, 'onConfirm' | 'confirmText' | 'children'> & {
  currentName: string
  currentEmail: string
  onSuccess?: () => void
}

export default function UpdateProfileDialog({
  currentName,
  currentEmail,
  onSuccess,
  title = 'Update Name',
  confirmButtonText = 'Save',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<UpdateProfileDialogProps>) {
  const { name, setName, handleUpdate } = useUpdateProfile({ currentEmail })

  React.useEffect(() => {
    setName(currentName)
  }, [currentName, setName])

  const handleConfirm = React.useCallback(async () => {
    const success = await handleUpdate()
    if (success) {
      onSuccess?.()
    }
  }, [handleUpdate, onSuccess])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
    >
      <FormGroup label="Full name">
        <FormInput
          id="update-profile-name-input"
          autoFocus
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormGroup>
    </Dialog>
  )
}

