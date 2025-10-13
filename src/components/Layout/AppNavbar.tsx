import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

type NavbarSearchResult = {
  id: string | number
  title: string
  description?: string
  url: string
  icon?: string
}

type AppNavbarProps = {
  title?: string
  onSearch?: (query: string) => Promise<NavbarSearchResult[]>
  initialResults?: NavbarSearchResult[]
  actions?: React.ReactNode
  accountSlot?: React.ReactNode
}

const defaultResults: NavbarSearchResult[] = []

export function AppNavbar({
  title = 'CloudStorage',
  onSearch,
  initialResults,
  actions,
  accountSlot,
}: AppNavbarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NavbarSearchResult[]>(
    () => initialResults ?? defaultResults,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!onSearch) {
      return undefined
    }

    if (!query.trim()) {
      setResults(defaultResults)
      setIsLoading(false)
      return undefined
    }

    let isActive = true
    setIsLoading(true)

    onSearch(query.trim())
      .then((nextResults) => {
        if (!isActive) return
        setResults(nextResults)
        setDropdownOpen(true)
      })
      .catch(() => {
        if (!isActive) return
        setResults(defaultResults)
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [onSearch, query])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target as Node)) return
      setDropdownOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const hasResults = results.length > 0
  const shouldShowDropdown = useMemo(
    () => isDropdownOpen && (isLoading || hasResults || !!query.trim()),
    [isDropdownOpen, isLoading, hasResults, query],
  )

  const renderActions = actions ?? (
    <a
      href="#upload"
      className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <i className="fas fa-upload mr-2" aria-hidden="true" />
      Upload
    </a>
  )

  const renderAccountSlot = accountSlot ?? (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 ring-1 ring-gray-200"
      aria-label="Account menu"
    >
      JD
    </button>
  )

  return (
    <nav className="not-prose border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="mx-8 flex-1" ref={containerRef}>
          <div className="relative">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                setDropdownOpen(true)
              }}
              placeholder="Search everything..."
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm placeholder-gray-500 transition-colors focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {shouldShowDropdown && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {isLoading && (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    <i className="fas fa-spinner fa-spin text-gray-400" aria-hidden="true" />
                    <span className="ml-2">Searching...</span>
                  </div>
                )}

                {!isLoading && hasResults && (
                  <div className="divide-y divide-gray-100">
                    {results.map((result) => (
                      <a
                        key={result.id}
                        href={result.url}
                        className="block px-4 py-3 transition hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {result.icon && (
                            <i
                              className={clsx(result.icon, 'text-gray-400')}
                              aria-hidden="true"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{result.title}</p>
                            {result.description && (
                              <p className="text-xs text-gray-500">{result.description}</p>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {!isLoading && !hasResults && query.trim() && (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    <i className="fas fa-search text-lg text-gray-300" aria-hidden="true" />
                    <p className="mt-2 text-sm">No results found</p>
                    <p className="text-xs text-gray-400">Try different keywords</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {renderActions}
          {renderAccountSlot}
        </div>
      </div>
    </nav>
  )
}

export type { AppNavbarProps, NavbarSearchResult }
