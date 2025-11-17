import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useLogin } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const deviceName = 'web-client'

  async function handleLogin() {
    if (loginMutation.isPending) {
      return
    }

    setErrorMessage(null)

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
        setErrorMessage(applicationError.message || 'Đăng nhập thất bại, vui lòng thử lại.')
      }
    }
  }

  return (
    <FormCard
      title="Đăng nhập"
      subtitle="Chào mừng trở lại"
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="text-blue-600 dark:text-blue-400 hover:underline">Đăng ký</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        {errorMessage && (
          <p className="text-sm text-red-500" role="alert">{errorMessage}</p>
        )}
        <FormGroup label="Email">
          <FormInput
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Mật khẩu">
          <FormInput
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <div className="pt-2">
          <Button
            onClick={handleLogin}
            variant="primary"
            size="lg"
            isLoading={loginMutation.isPending}
            loadingText="Đang đăng nhập..."
            disabled={!email || !password}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </FormCard>
  )
}



