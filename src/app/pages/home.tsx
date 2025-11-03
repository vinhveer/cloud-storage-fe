import { Link } from '@tanstack/react-router'
import { Button } from '@/components/Button/Button'

export default function PublicHomePage() {
  return (
    <div className="min-h-dvh flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cloud Storage</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">Lưu trữ, chia sẻ và quản lý tệp của bạn một cách đơn giản.</p>

          <div className="mt-8 flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="primary" size="lg">Đăng nhập</Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="secondary" size="lg">Đăng ký</Button>
            </Link>
          </div>
      </div>
    </div>
  )
}



