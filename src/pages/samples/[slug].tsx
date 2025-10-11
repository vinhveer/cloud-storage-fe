import { useParams } from '@tanstack/react-router'
import { MDXContent } from '@/components/MDXContent'

export default function SampleDynamicPage() {
  const params = useParams({ strict: false }) as unknown as { slug?: string }
  const slug = params?.slug ?? ''
  return <MDXContent slug={slug} />
}


