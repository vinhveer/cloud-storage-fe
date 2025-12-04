import { useParams } from '@tanstack/react-router'
import { usePublicLinkDetail } from '@/api/features/public-link/public-link.queries'
import PublicLinkView from './components/PublicLinkView'
import Loading from '@/components/Loading/Loading'
import { 
  ExclamationTriangleIcon, 
  LinkSlashIcon, 
  ClockIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline'

type ErrorType = 'not_found' | 'expired' | 'revoked' | 'forbidden' | 'unknown'

function getErrorType(error: unknown): ErrorType {
  if (error && typeof error === 'object') {
    // Check for status code
    if ('status' in error) {
      const status = error.status as number
      if (status === 404) return 'not_found'
      if (status === 403) return 'forbidden'
      if (status === 410) return 'revoked' // Gone
    }
    // Check for error message
    if ('message' in error && typeof error.message === 'string') {
      const msg = error.message.toLowerCase()
      if (msg.includes('expired')) return 'expired'
      if (msg.includes('revoked')) return 'revoked'
      if (msg.includes('not found')) return 'not_found'
    }
  }
  return 'unknown'
}

function getErrorContent(errorType: ErrorType) {
  switch (errorType) {
    case 'not_found':
      return {
        icon: LinkSlashIcon,
        title: 'Link Not Found',
        message: 'This public link does not exist. It may have been deleted or the URL is incorrect.',
        iconColor: 'text-gray-400',
      }
    case 'expired':
      return {
        icon: ClockIcon,
        title: 'Link Expired',
        message: 'This public link has expired. Contact the owner to request a new link.',
        iconColor: 'text-yellow-500',
      }
    case 'revoked':
      return {
        icon: NoSymbolIcon,
        title: 'Link Revoked',
        message: 'This public link has been revoked by the owner and is no longer accessible.',
        iconColor: 'text-red-500',
      }
    case 'forbidden':
      return {
        icon: ExclamationTriangleIcon,
        title: 'Access Denied',
        message: 'You do not have permission to access this link.',
        iconColor: 'text-orange-500',
      }
    default:
      return {
        icon: ExclamationTriangleIcon,
        title: 'Link Not Available',
        message: 'This public link is not available. It may be invalid, expired, or revoked.',
        iconColor: 'text-gray-400',
      }
  }
}

export default function PublicLinkPage() {
  const params = useParams({ strict: false })
  const token = params.token as string
  const { data, isLoading, error } = usePublicLinkDetail(token)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading shared content...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    const errorType = getErrorType(error)
    const { icon: Icon, title, message, iconColor } = getErrorContent(errorType)

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {message}
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Go to homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <PublicLinkView data={data} token={token} />
}

