import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import FormGroup from '@/components/FormGroup/FormGroup'
import FormInput from '@/components/FormGroup/FormInput/FormInput'
import { Button } from '@/components/Button/Button'
import { useResetPassword } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [token, setToken] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()

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

  function passwordsMatch() {
    return password === passwordConfirmation
  }

  async function handleSubmit() {
    if (!email || !token) {
      setErrorMessage('Liên kết đặt lại mật khẩu không hợp lệ. Vui lòng thử gửi lại email đặt lại mật khẩu.')
      return
    }

    if (!passwordsMatch()) {
      setErrorMessage('Mật khẩu xác nhận không khớp.')
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await resetPasswordMutation.mutateAsync({
        email,
        token,
        password,
        passwordConfirmation,
      })
      setSuccessMessage(response.message || 'Mật khẩu của bạn đã được đặt lại thành công.')
      setPassword('')
      setPasswordConfirmation('')
      setTimeout(() => {
        navigate({ to: '/auth/login' })
      }, 1500)
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setErrorMessage(applicationError.message || 'Đặt lại mật khẩu thất bại, vui lòng thử lại.')
    }
  }

  const isSubmitting = resetPasswordMutation.isPending

  return (
    <FormCard
      title="Đặt lại mật khẩu"
      subtitle="Nhập mật khẩu mới cho tài khoản của bạn"
    >
      <div className="space-y-4">
        {errorMessage && (
          <p className="text-sm text-red-500" role="alert">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 dark:text-green-400" role="status">{successMessage}</p>
        )}

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
            />
          </FormGroup>

          <FormGroup label="Mật khẩu mới">
            <FormInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Nhập lại mật khẩu mới">
            <FormInput
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={event => setPasswordConfirmation(event.target.value)}
              required
            />
          </FormGroup>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Nếu bạn không tự yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và không chia sẻ liên kết cho bất kỳ ai.
          </p>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Đang xử lý..."
              disabled={!email || !password || !passwordConfirmation}
            >
              Đặt lại mật khẩu
            </Button>
          </div>
        </form>

        <div className="pt-2 text-center">
          <Link to="/auth/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </FormCard>
  )
}


