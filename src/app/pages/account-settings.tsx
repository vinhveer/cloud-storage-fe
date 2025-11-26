import React from 'react'
import { useQuery } from '@tanstack/react-query'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useAlert } from '@/components/Alert'
import { getProfile } from '@/api/features/auth/auth.api'
import { useChangePassword, useUpdateProfile } from '@/api/features/auth/auth.mutations'
import { qk } from '@/api/query/keys'
import { AppError } from '@/api/core/error'

export default function AccountSettingsPage() {
  const { showAlert } = useAlert()


  // Fetch current user profile
  const { data: user } = useQuery({
    queryKey: qk.auth.profile(),
    queryFn: getProfile,
  })

  // Mutations
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()

  // Form state
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  // Password state
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    let profileUpdated = false
    let passwordChanged = false

    // 1. Update Profile if changed
    if (user && (name !== user.name || email !== user.email)) {
      try {
        await updateProfileMutation.mutateAsync({ name, email })
        profileUpdated = true
      } catch (unknownError) {
        const applicationError = unknownError as AppError
        let errorMessage = applicationError.message || 'Failed to update profile.'

        // Extract validation errors if available
        if (applicationError.details && typeof applicationError.details === 'object') {
          const details = applicationError.details as Record<string, unknown>
          const validationMessages: string[] = []

          // Iterate through all fields in details
          Object.values(details).forEach((messages) => {
            if (Array.isArray(messages)) {
              // If messages is an array, add each message
              messages.forEach(msg => {
                if (typeof msg === 'string') {
                  validationMessages.push(msg)
                }
              })
            } else if (typeof messages === 'string') {
              // If messages is a string, add it directly
              validationMessages.push(messages)
            }
          })

          if (validationMessages.length > 0) {
            errorMessage = validationMessages.join('\n')
          }
        }

        showAlert({
          type: 'error',
          heading: 'Profile Update Failed',
          message: errorMessage,
          duration: 7000
        })
        return // Stop if profile update fails
      }
    }

    // 2. Change Password if provided
    if (newPassword) {
      if (!currentPassword) {
        showAlert({
          type: 'error',
          message: 'Please enter your current password to change it.',
          duration: 5000
        })
        return
      }

      if (newPassword !== confirmPassword) {
        showAlert({
          type: 'error',
          message: 'New password confirmation does not match.',
          duration: 5000
        })
        return
      }

      try {
        await changePasswordMutation.mutateAsync({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        })
        passwordChanged = true
        // Clear password fields on success
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } catch (unknownError) {
        const applicationError = unknownError as AppError
        let errorMessage = applicationError.message || 'Failed to change password.'

        // Extract validation errors if available
        if (applicationError.details && typeof applicationError.details === 'object') {
          const details = applicationError.details as Record<string, unknown>
          const validationMessages: string[] = []

          // Iterate through all fields in details
          Object.values(details).forEach((messages) => {
            if (Array.isArray(messages)) {
              // If messages is an array, add each message
              messages.forEach(msg => {
                if (typeof msg === 'string') {
                  validationMessages.push(msg)
                }
              })
            } else if (typeof messages === 'string') {
              // If messages is a string, add it directly
              validationMessages.push(messages)
            }
          })

          if (validationMessages.length > 0) {
            errorMessage = validationMessages.join('\n')
          }
        }

        showAlert({
          type: 'error',
          heading: 'Password Change Failed',
          message: errorMessage,
          duration: 7000
        })
        return
      }
    }

    // Success Message
    if (profileUpdated || passwordChanged) {
      showAlert({
        type: 'success',
        heading: 'Settings Saved',
        message: 'Your account settings have been updated successfully.',
        duration: 5000
      })
    } else if (!newPassword) {
      // No changes made
      showAlert({
        type: 'info',
        message: 'No changes were made.',
        duration: 3000
      })
    }
  }

  const isLoading = updateProfileMutation.isPending || changePasswordMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <header className="top-0 z-10 bg-white dark:bg-[#0D1117] pt-1 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your profile information and security preferences.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>

        <FormGroup label="Full name">
          <FormInput
            name="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Email address" help="Used for login and important notifications.">
          <FormInput
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled
          />
        </FormGroup>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Password</h2>

        <FormGroup label="Current password">
          <FormInput
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="New password">
          <FormInput
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Confirm new password">
          <FormInput
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
      </section>

      <div className="sticky bottom-0 z-10 flex justify-start gap-3 py-4 mt-8 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <Button type="submit" variant="primary" isLoading={isLoading} loadingText="Saving...">
          Save changes
        </Button>
        <Button type="button" variant="secondary" onClick={() => {
          // Reset form to user data
          if (user) {
            setName(user.name)
            setEmail(user.email)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
          }
        }}>
          Cancel
        </Button>
      </div>
    </form>
  )
}


