 
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ArrowUpTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/Button/Button'
import Loading from '@/components/Loading/Loading'
import AccountDropdown from '@/components/Navbar/AccountDropdown/AccountDropdown'
import { useNavbarSearch } from '@/hooks/components/Navbar/useNavbarSearch'

export type NavbarSearchResult = {
  id: string
  url: string
  title: string
  description?: string
  icon?: ReactNode
}

export type NavbarProps = {
  title?: string
  onSearch?: (query: string) => Promise<NavbarSearchResult[]>
  searchPlaceholder?: string
  className?: string
}

export default function Navbar({
  title = 'CloudStorage',
  onSearch,
  searchPlaceholder = 'Search everything...',
  className,
}: NavbarProps) {
  const { query, setQuery, isLoading, results, open, setOpen, containerRef } = useNavbarSearch<NavbarSearchResult>({ onSearch })

  const showDropdown = open && (isLoading || results.length > 0 || query.length > 0)

  return (
    <nav className={clsx('bg-white border-b border-gray-200 px-4 py-2', className)}>
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8" ref={containerRef}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
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
              placeholder={searchPlaceholder}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              aria-label="Search"
            />

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {/* Results */}
                {results.map((r) => (
                  <a key={r.id} href={r.url} className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="mr-3 text-gray-400">
                        {r.icon ?? <MagnifyingGlassIcon className="w-4 h-4" aria-hidden="true" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                        {r.description && <p className="text-xs text-gray-500 truncate">{r.description}</p>}
                      </div>
                    </div>
                  </a>
                ))}

                {/* No results */}
                {!isLoading && query && results.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <MagnifyingGlassIcon className="w-5 h-5 mx-auto mb-2 text-gray-300" aria-hidden="true" />
                    <p className="text-sm">No results found</p>
                    <p className="text-xs text-gray-400">Try different keywords</p>
                  </div>
                )}

                {/* Loading */}
                {isLoading && (
                  <div className="px-4 py-3 text-center text-gray-500 flex items-center justify-center">
                    <Loading className="mr-2" size="sm" />
                    <span className="text-sm">Searching...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Account */}
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowUpTrayIcon className="w-4 h-4" />}
            aria-label="Upload"
          />
          <AccountDropdown />
        </div>
      </div>
    </nav>
  )
}


