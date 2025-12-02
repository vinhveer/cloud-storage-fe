import { useParams } from '@tanstack/react-router'
import { usePublicLinkPreview } from '@/api/features/public-link/public-link.queries'
import PublicLinkPreview from './components/PublicLinkPreview'
import Loading from '@/components/Loading/Loading'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useEffect, useState } from 'react'

export default function PublicLinkPage() {
  const { token } = useParams({ from: '/public/$token' })
  const { data, isLoading, error } = usePublicLinkPreview(token)
  const { showAlert } = useAlert()
  const [previewOpen, setPreviewOpen] = useState(true)

  useEffect(() => {
    if (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load public link. The link may be invalid, expired, or revoked.'
      showAlert({ type: 'error', message: errorMessage })
    }
  }, [error, showAlert])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Link Not Available
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error instanceof Error
              ? error.message
              : 'This public link may be invalid, expired, or revoked.'}
          </p>
        </div>
      </div>
    )
  }

  if (data.shareable_type === 'file' && data.file) {
    return (
      <PublicLinkPreview
        data={data}
        token={token}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Unsupported Content Type
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This public link type is not supported yet.
        </p>
      </div>
    </div>
  )
}

