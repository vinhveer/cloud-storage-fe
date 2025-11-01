import type { ReactNode } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Loading from '@/components/Loading/Loading'
import { useSearch } from '@/components/Navbar/Search/useSearch'

export type SearchResult = {
  id: string
  url: string
  title: string
  description?: string
  icon?: ReactNode
}

export type SearchProps = {
  onSearch?: (query: string) => Promise<SearchResult[]>
  placeholder?: string
  className?: string
}

export default function Search({ onSearch, placeholder = 'Search...', className }: SearchProps) {
  const { query, setQuery, isLoading, results, open, setOpen, containerRef } = useSearch<SearchResult>({ onSearch })

  const showDropdown = open && (isLoading || results.length > 0 || query.length > 0)

  return (
    <div className={className} ref={containerRef}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
          <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white transition-colors"
          aria-label="Search"
        />

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 max-h-96 overflow-y-auto z-50">
            {results.map((r: SearchResult) => (
              <a key={r.id} href={r.url} className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-center">
                  <div className="mr-3 text-gray-400 dark:text-gray-500">
                    {r.icon ?? <MagnifyingGlassIcon className="w-4 h-4" aria-hidden="true" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.title}</p>
                    {r.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.description}</p>}
                  </div>
                </div>
              </a>
            ))}

            {!isLoading && query && results.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="w-5 h-5 mx-auto mb-2 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                <p className="text-sm">No results found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Try different keywords</p>
              </div>
            )}

            {isLoading && (
              <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <Loading className="mr-2" size="sm" />
                <span className="text-sm">Searching...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


