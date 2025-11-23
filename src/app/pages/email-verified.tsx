import React from 'react'
import { Link } from '@tanstack/react-router'
import FormCard from '@/components/FormCard/FormCard'

export default function EmailVerifiedPage() {
  const [status, setStatus] = React.useState<'success' | 'error' | null>(null)
  const [reason, setReason] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (globalThis.window === undefined) {
      return
    }

    const params = new URLSearchParams(globalThis.window.location.search)
    const rawStatus = params.get('status')
    const rawReason = params.get('reason')

    if (rawStatus === 'success' || rawStatus === 'error') {
      setStatus(rawStatus)
    } else {
      setStatus('success')
    }

    if (rawReason) {
      setReason(rawReason)
    }
  }, [])

  const isSuccess = status !== 'error'

  return (
    <FormCard
      title={isSuccess ? 'Xác thực email thành công' : 'Xác thực email thất bại'}
      subtitle={isSuccess ? 'Tài khoản của bạn đã được xác thực.' : 'Không thể xác thực email của bạn.'}
      footer={(
        <Link to="/auth/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Đăng nhập
        </Link>
      )}
    >
      <div className="space-y-3">
        {isSuccess
          ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Email của bạn đã được xác thực thành công. Vui lòng đăng nhập để tiếp tục.
            </p>
          )
          : (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Liên kết xác thực có thể đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email xác thực từ màn hình đăng nhập.
            </p>
          )}
        {reason && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Chi tiết: {reason}
          </p>
        )}
      </div>
    </FormCard>
  )
}


