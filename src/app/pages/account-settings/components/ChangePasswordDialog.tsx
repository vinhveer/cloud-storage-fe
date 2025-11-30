import React from 'react'
import Dialog from '@/components/Dialog/Dialog'
import FormGroup from '@/components/FormGroup/FormGroup'
import PasswordInput from '@/app/pages/auth/components/PasswordInput'
import type { DialogProps } from '@/components/Dialog/types'
import { useChangePassword } from '../hooks/useChangePassword'

export type ChangePasswordDialogProps = Omit<DialogProps, 'onConfirm' | 'confirmText' | 'children'> & {
  onSuccess?: () => void
}

export default function ChangePasswordDialog({
  onSuccess,
  title = 'Change Password',
  confirmButtonText = 'Change Password',
  cancelButtonText = 'Cancel',
  confirmType = 'primary',
  ...dialogProps
}: Readonly<ChangePasswordDialogProps>) {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleChangePassword,
    reset,
  } = useChangePassword()

  const handleConfirm = React.useCallback(async () => {
    const success = await handleChangePassword()
    if (success) {
      onSuccess?.()
    }
  }, [handleChangePassword, onSuccess])

  const handleCancel = React.useCallback(() => {
    reset()
    dialogProps.onCancel?.()
  }, [reset, dialogProps])

  return (
    <Dialog
      {...dialogProps}
      title={title}
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      confirmType={confirmType}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="space-y-4">
        <FormGroup label="Current password">
          <PasswordInput
            id="change-password-current-input"
            autoFocus
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="New password">
          <PasswordInput
            id="change-password-new-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Confirm new password">
          <PasswordInput
            id="change-password-confirm-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Password must be 8-16 characters, contain at least one letter, one number, and one special character.
        </p>
      </div>
    </Dialog>
  )
}

