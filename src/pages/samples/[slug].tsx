import { useParams, Link } from '@tanstack/react-router'
import { MDXContent } from '@/components/MDXContent'

export default function SampleDynamicPage() {
  const params = useParams({ strict: false }) as unknown as { slug?: string }
  const slug = params?.slug ?? ''
  const title = slug
    .split('-')
    .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')

  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/samples" className="hover:underline">Samples</Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-medium">{title || 'Detail'}</li>
        </ol>
      </nav>
      <MDXContent slug={slug} />
    </div>
  )
}


