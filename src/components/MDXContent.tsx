import { MDXProvider } from '@mdx-js/react'
import React from 'react'

const mdxMap = import.meta.glob<{ default: React.ComponentType }>('/src/components/**/docs.mdx', { eager: true })

export function MDXContent({ slug }: { slug: string }) {
  console.log('[MDXContent] slug:', slug)
  console.log('[MDXContent] mdxMap keys:', Object.keys(mdxMap))

  const entry = Object.entries(mdxMap).find(([p]) =>
    p.toLowerCase().includes(`/src/components/${slug.toLowerCase()}/docs.mdx`)
  )

  if (!entry) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">Doc not found for: {slug}</h2>
        <p className="text-sm text-gray-600 mt-2">Available docs:</p>
        <ul className="list-disc pl-6">
          {Object.keys(mdxMap).map(k => <li key={k}>{k}</li>)}
        </ul>
      </div>
    )
  }

  const Doc = entry[1].default
  return (
    <MDXProvider>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-h1:font-bold prose-h1:text-3xl">
        <Doc />
      </div>
    </MDXProvider>
  )
}


