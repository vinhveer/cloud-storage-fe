import { MDXProvider } from '@mdx-js/react'
import React from 'react'

const mdxMap = import.meta.glob<{ default: React.ComponentType }>('/src/components/**/docs.mdx', { eager: true })

function normalizeSegment(segment: string) {
  return segment.toLowerCase().replaceAll(/[^a-z0-9]/g, '')
}

function pathToSlug(path: string) {
  // e.g. /src/components/FormGroup/FormInput/docs.mdx -> formgroup/forminput
  const parts = path.split('/').map((p) => p.trim()).filter(Boolean)
  const compIdx = parts.indexOf('components')
  const after = compIdx >= 0 ? parts.slice(compIdx + 1) : []
  const noFile = after.slice(0, -1)
  return noFile.map((p) => p.toLowerCase()).join('/')
}

function findDocBySlug(slug: string) {
  const requested = slug.split('/').map((s) => s.trim()).filter(Boolean)
  const requestedNorm = requested.map(normalizeSegment)

  // prefer exact end-with match by normalized segments
  const entries = Object.entries(mdxMap)
  const scored = entries.map(([p, mod]) => {
    const parts = pathToSlug(p).split('/').filter(Boolean)
    const partsNorm = parts.map(normalizeSegment)
    let isSuffixMatch = false
    if (requestedNorm.length <= partsNorm.length) {
      const tail = partsNorm.slice(partsNorm.length - requestedNorm.length)
      isSuffixMatch = tail.every((seg, i) => seg === requestedNorm[i])
    }
    const score = isSuffixMatch ? requestedNorm.length : 0
    return { p, mod, score, parts, partsNorm }
  })
  scored.sort((a, b) => b.score - a.score)
  const best = scored.find((e) => e.score > 0)
  return best ?? null
}

export function MDXContent({ slug }: Readonly<{ slug: string }>) {
  const best = findDocBySlug(slug)

  if (!best) {
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        <h2 className="text-lg font-bold">Doc not found for: {slug}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Available docs:</p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
          {Object.keys(mdxMap).map((k) => <li key={k}>{k}</li>)}
        </ul>
      </div>
    )
  }

  const Doc = (best.mod as { default: React.ComponentType }).default

  // If the slug points to a parent folder (e.g., formgroup) and there are children
  // expose quick links to child docs underneath.
  const parentSlug = best.parts.slice(0, -1).join('/')
  const requestedSlug = slug.split('/').filter(Boolean).join('/').toLowerCase()
  const currentSlug = best.parts.join('/').toLowerCase()
  const isParent = requestedSlug === parentSlug.toLowerCase()

  const childLinks = Object.keys(mdxMap)
    .filter((p) => {
      const s = pathToSlug(p).toLowerCase()
      return s.startsWith(`${requestedSlug}/`)
    })
    .map((p) => pathToSlug(p))
    .sort((a, b) => a.localeCompare(b))

  return (
    <MDXProvider>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-h1:font-bold prose-h1:text-3xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md p-4">
        <Doc />
        {isParent && childLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Sub-sections</h3>
            <ul>
              {childLinks.map((s) => (
                <li key={s}>
                  <a className="text-blue-600 hover:underline" href={`/samples/${s}`}>{s.split('/').at(-1)}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!isParent && requestedSlug !== currentSlug && (
          <p className="mt-6 text-sm text-gray-500">Showing closest match for <code>{currentSlug}</code>.</p>
        )}
      </div>
    </MDXProvider>
  )
}