import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useRegister } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'

export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const deviceName = 'web-client'

  function passwordsMatch() {
    return password === confirmPassword
  }

  async function handleRegister() {
    if (registerMutation.isPending) {
      return
    }

    if (!passwordsMatch()) {
      setErrorMessage('Mật khẩu xác nhận không khớp.')
      return
    }

    setErrorMessage(null)

    try {
      await registerMutation.mutateAsync({
        name,
        email,
        password,
        passwordConfirmation: confirmPassword,
        deviceName,
      })
      navigate({ to: '/app' })
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setErrorMessage(applicationError.message || 'Đăng ký thất bại, vui lòng thử lại.')
    }
  }

  return (
    <FormCard
      title="Đăng ký"
      subtitle="Tạo tài khoản mới"
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Đăng nhập</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        {errorMessage && (
          <p className="text-sm text-red-500" role="alert">{errorMessage}</p>
        )}
        <FormGroup label="Họ tên">
          <FormInput
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>

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

        <FormGroup label="Nhập lại mật khẩu">
          <FormInput
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>

        <div className="pt-2">
          <Button
            onClick={handleRegister}
            variant="primary"
            size="lg"
            isLoading={registerMutation.isPending}
            loadingText="Đang đăng ký..."
            disabled={!name || !email || !password || !confirmPassword}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </FormCard>
  )
}



