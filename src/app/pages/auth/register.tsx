import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormInput/FormInput'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useRegister, useResendVerificationEmail } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'

export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [resendMessage, setResendMessage] = React.useState<string | null>(null)
  const registerMutation = useRegister()
  const resendVerificationMutation = useResendVerificationEmail()

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
    setSuccessMessage(null)
    setResendMessage(null)

    try {
      const response = await registerMutation.mutateAsync({
        name,
        email,
        password,
        passwordConfirmation: confirmPassword,
      })
      setSuccessMessage(response.message || 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.')
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setErrorMessage(applicationError.message || 'Đăng ký thất bại, vui lòng thử lại.')
    }
  }

  async function handleResendVerification() {
    if (!email || resendVerificationMutation.isPending) {
      return
    }

    setResendMessage(null)

    try {
      const response = await resendVerificationMutation.mutateAsync({ email })
      setResendMessage(response.message || 'Đã gửi lại email xác thực, vui lòng kiểm tra hộp thư.')
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setResendMessage(applicationError.message || 'Gửi lại email xác thực thất bại, vui lòng thử lại.')
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
        {successMessage && (
          <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-100">
            <p className="mb-2">
              {successMessage}
            </p>
            <p className="mb-2">
              Nếu bạn chưa nhận được email, hãy kiểm tra hộp thư rác hoặc nhấn nút bên dưới để gửi lại liên kết xác thực.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResendVerification}
                isLoading={resendVerificationMutation.isPending}
                loadingText="Đang gửi lại..."
                disabled={!email}
              >
                Gửi lại email xác thực
              </Button>
              {resendMessage && (
                <span className="text-xs">
                  {resendMessage}
                </span>
              )}
            </div>
          </div>
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



