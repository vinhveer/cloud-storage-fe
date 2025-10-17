import { useParams, Link } from '@tanstack/react-router'
import { MDXContent } from '@/components/MDXContent'

export default function SampleDynamicPage() {
  const params = useParams({ strict: false }) as unknown as { slug?: string; parent?: string; child?: string }
  const slug = (params.child ? `${params.parent}/${params.child}` : (params.slug ?? '')).trim()
  const title = slug
    .split('-')
    .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:underline text-blue-600 dark:text-blue-400">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/samples" className="hover:underline text-blue-600 dark:text-blue-400">Samples</Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 dark:text-gray-300 font-medium">{title || 'Detail'}</li>
        </ol>
      </nav>
      <MDXContent slug={slug} />
    </div>
  )
}


