import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useLogin } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'
import { useAlert } from '@/components/Alert'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showForgotPassword, setShowForgotPassword] = React.useState(false)
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const { showAlert } = useAlert()

  const deviceName = 'web-client'

  async function handleLogin() {
    if (loginMutation.isPending) {
      return
    }

    try {
      await loginMutation.mutateAsync({
        email,
        password,
        deviceName,
      })
      navigate({ to: '/app' })
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      if (applicationError.code === 'EMAIL_NOT_VERIFIED') {
        if (globalThis.window) {
          try {
            globalThis.window.sessionStorage.setItem('cloud-storage.lastLoginEmail', email)
          } catch {
            // ignore storage errors
          }
        }
        navigate({
          to: '/auth/verify-email',
        })
      } else {
        setShowForgotPassword(true)
        showAlert({
          type: 'error',
          heading: 'Login Failed',
          message: applicationError.message || 'Login failed, please try again.',
          icon: false,
          duration: 0
        })
      }
    }
  }

  return (
    <FormCard
      title="Login"
      subtitle="Welcome back"
      footer={(
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</Link>
          </p>
          {showForgotPassword && (
            <Link to="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        <FormGroup label="Email">
          <FormInput
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Password">
          <div className="relative">
            <FormInput
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </FormGroup>

        <div className="pt-2">
          <Button
            onClick={handleLogin}
            variant="primary"
            size="lg"
            isLoading={loginMutation.isPending}
            loadingText="Logging in..."
            disabled={!email || !password}
          >
            Login
          </Button>
        </div>
      </div>
    </FormCard>
  )
}



