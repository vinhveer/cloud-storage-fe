import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useResetPassword } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'
import { ResetPasswordRequestSchema } from '@/api/features/auth/auth.schemas'

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [token, setToken] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')

  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()
  const { showAlert } = useAlert()

  React.useEffect(() => {
    if (globalThis.window === undefined) {
      return
    }

    const params = new URLSearchParams(globalThis.window.location.search)
    const emailFromQuery = params.get('email')
    const tokenFromQuery = params.get('token')

    if (emailFromQuery) {
      setEmail(emailFromQuery)
    }
    if (tokenFromQuery) {
      setToken(tokenFromQuery)
    }
  }, [])

  function validatePassword() {
    try {
      ResetPasswordRequestSchema.parse({
        email,
        token,
        password,
        passwordConfirmation,
      })
      return true
    } catch (error) {
      return false
    }
  }

  function getPasswordErrors() {
    try {
      ResetPasswordRequestSchema.parse({
        email,
        token,
        password,
        passwordConfirmation,
      })
      return []
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> }
        return zodError.errors.map(err => err.message)
      }
      return []
    }
  }

  async function handleSubmit() {
    if (!email || !token) {
      showAlert({
        type: 'error',
        heading: 'Invalid Reset Link',
        message: 'Invalid reset link. Please request a new password reset email.',
        duration: 5000
      })
      return
    }

    if (!validatePassword()) {
      const errors = getPasswordErrors()
      showAlert({
        type: 'error',
        heading: 'Validation Error',
        message: errors.join('\n') || 'Please check your password requirements.',
        duration: 5000
      })
      return
    }

    try {
      const response = await resetPasswordMutation.mutateAsync({
        email,
        token,
        password,
        passwordConfirmation,
      })
      showAlert({
        type: 'success',
        heading: 'Password Reset Successful',
        message: response.message || 'Your password has been reset successfully. Please login with your new password.',
        duration: 5000
      })
      setPassword('')
      setPasswordConfirmation('')
      setTimeout(() => {
        navigate({ to: '/auth/login' })
      }, 1500)
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      showAlert({
        type: 'error',
        heading: 'Reset Failed',
        message: applicationError.message || 'Failed to reset password. Please try again or request a new link.',
        duration: 5000
      })
    }
  }

  const isSubmitting = resetPasswordMutation.isPending

  return (
    <FormCard
      title="Reset Password"
      subtitle="Enter your new password"
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Password must be 8-16 characters, contain at least one letter, one number, and one special character.
        </p>

        <form
          className="space-y-4"
          onSubmit={event => {
            event.preventDefault()
            void handleSubmit()
          }}
        >
          <FormGroup label="Email">
            <FormInput
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              disabled
            />
          </FormGroup>

          <FormGroup label="New Password">
            <FormInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Confirm Password">
            <FormInput
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={event => setPasswordConfirmation(event.target.value)}
              required
            />
          </FormGroup>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Resetting..."
              disabled={!email || !password || !passwordConfirmation || !token}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </FormCard>
  )
}
