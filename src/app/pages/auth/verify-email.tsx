import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'
import { Button } from '@/components/Button/Button'
import { useResendVerificationEmail } from '@/api/features/auth/auth.mutations'
import { AppError } from '@/api/core/error'

export default function VerifyEmailPage() {
  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const resendVerificationMutation = useResendVerificationEmail()

  React.useEffect(() => {
    if (globalThis.window === undefined) {
      return
    }

    const params = new URLSearchParams(globalThis.window.location.search)
    const emailFromQuery = params.get('email')
    const emailFromStorage = (() => {
      try {
        return globalThis.window.sessionStorage.getItem('cloud-storage.lastLoginEmail')
      } catch {
        return null
      }
    })()

    if (emailFromQuery) {
      // eslint-disable-next-line no-console
      console.log('[VERIFY_EMAIL] found email in query', emailFromQuery)
      setEmail(emailFromQuery)
    } else if (emailFromStorage) {
      // eslint-disable-next-line no-console
      console.log('[VERIFY_EMAIL] found email in sessionStorage', emailFromStorage)
      setEmail(emailFromStorage)
    } else {
      // eslint-disable-next-line no-console
      console.log('[VERIFY_EMAIL] no email in query or storage', globalThis.window.location.search)
    }
  }, [])

  const hasAutoResentRef = React.useRef(false)

  React.useEffect(() => {
    if (!email || hasAutoResentRef.current) {
      return
    }

    hasAutoResentRef.current = true
    // eslint-disable-next-line no-console
    console.log('[VERIFY_EMAIL] auto resend once with email', email)
    // Gọi tự động gửi lại email xác thực một lần khi vào trang nếu đã có email
    void handleResend()
  }, [email])

  async function handleResend() {
    if (!email || resendVerificationMutation.isPending) {
      return
    }

    // eslint-disable-next-line no-console
    console.log('[VERIFY_EMAIL] handleResend called with email', email)

    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await resendVerificationMutation.mutateAsync({ email })
      setMessage(response.message || 'Đã gửi lại email xác thực, vui lòng kiểm tra hộp thư.')
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setErrorMessage(applicationError.message || 'Gửi lại email xác thực thất bại, vui lòng thử lại.')
    }
  }

  return (
    <FormCard
      title="Xác thực email"
      subtitle="Hoàn tất bước xác thực tài khoản để tiếp tục sử dụng dịch vụ"
      footer={(
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Đã xác thực xong?{' '}
          <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">Quay lại đăng nhập</Link>
        </p>
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Chúng tôi đã gửi một email chứa liên kết xác thực đến địa chỉ email của bạn.
          Vui lòng kiểm tra hộp thư đến (hoặc mục Spam) và nhấn vào liên kết trong email để kích hoạt tài khoản.
        </p>

        {message && (
          <output className="block text-sm text-green-600 dark:text-green-400">
            {message}
          </output>
        )}

        {errorMessage && (
          <p className="text-sm text-red-500" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="space-y-2">
          <label
            htmlFor="verify-email-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="verify-email-input"
            type="email"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            placeholder="you@example.com"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={handleResend}
            variant="primary"
            size="lg"
            isLoading={resendVerificationMutation.isPending}
            loadingText="Đang gửi lại..."
            disabled={!email}
          >
            Gửi lại email xác thực
          </Button>
        </div>
      </div>
    </FormCard>
  )
}


