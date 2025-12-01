import React, { useState, useEffect, useMemo } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, FolderIcon, DocumentIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useSearchSuggestions } from '@/api/features/search/search.queries'
import { useGlobalSearch } from '@/api/features/search/search.queries'
import Loading from '@/components/Loading/Loading'
import type { SearchFileResult, SearchFolderResult } from '@/api/features/search/search.types'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

function formatFileSize(bytes: number): string {
  const sizeInKB = bytes / 1024
  const sizeInMB = sizeInKB / 1024
  const sizeInGB = sizeInMB / 1024
  if (sizeInGB >= 1) return `${sizeInGB.toFixed(2)} GB`
  if (sizeInMB >= 1) return `${sizeInMB.toFixed(2)} MB`
  return `${sizeInKB.toFixed(2)} KB`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, idx) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={idx} className="bg-yellow-200 dark:bg-yellow-900/50">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function BasicSearchTab({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading, error } = useSearchSuggestions(
    debouncedQuery.trim().length > 0 ? { q: debouncedQuery, limit: 10 } : null
  )

  const suggestions = data?.suggestions ?? []

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
          <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files and folders..."
          className="block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          autoFocus
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loading size="md" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !error && debouncedQuery.trim().length > 0 && suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No results found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try different keywords</p>
        </div>
      )}

      {!isLoading && !error && suggestions.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {suggestions.map((item, index) => {
            const isFolder = item.type === 'folder'
            return (
              <a
                key={`${item.type}-${item.id}`}
                href={isFolder ? `/my-files?folderId=${item.id}` : `/my-files?fileId=${item.id}`}
                className="block px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] animate-in fade-in slide-in-from-top-2"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    {isFolder ? (
                      <FolderIcon className="w-6 h-6 text-blue-500" />
                    ) : (
                      <DocumentIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200">
                      {highlightText(item.name, debouncedQuery)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{item.full_path}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AdvancedSearchTab() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'file' | 'folder' | ''>('')
  const [extension, setExtension] = useState('')
  const [sizeMin, setSizeMin] = useState('')
  const [sizeMax, setSizeMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [showFilters, setShowFilters] = useState(true)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [debouncedExtension, setDebouncedExtension] = useState('')

  // Debounce query and extension with smoother timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedExtension(extension)
    }, 300)
    return () => clearTimeout(timer)
  }, [extension])

  const searchParams = useMemo(
    () => ({
      q: debouncedQuery.trim() || undefined,
      type: type || undefined,
      extension: debouncedExtension.trim() || undefined,
      size_min: sizeMin ? Number(sizeMin) : undefined,
      size_max: sizeMax ? Number(sizeMax) : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      page,
      per_page: perPage,
    }),
    [debouncedQuery, type, debouncedExtension, sizeMin, sizeMax, dateFrom, dateTo, page, perPage]
  )

  const hasAnyFilter = useMemo(() => {
    return !!(
      debouncedQuery.trim() ||
      type ||
      debouncedExtension.trim() ||
      sizeMin ||
      sizeMax ||
      dateFrom ||
      dateTo
    )
  }, [debouncedQuery, type, debouncedExtension, sizeMin, sizeMax, dateFrom, dateTo])

  const { data, isLoading, error } = useGlobalSearch(searchParams, { enabled: hasAnyFilter })

  const results = data?.data ?? []
  const pagination = data?.pagination

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedQuery, type, debouncedExtension, sizeMin, sizeMax, dateFrom, dateTo])

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'file' | 'folder' | '')}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">All</option>
              <option value="file">File</option>
              <option value="folder">Folder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extension</label>
            <input
              type="text"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              placeholder="e.g., pdf, jpg"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size Min (bytes)</label>
            <input
              type="number"
              value={sizeMin}
              onChange={(e) => setSizeMin(e.target.value)}
              placeholder="Min size"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size Max (bytes)</label>
            <input
              type="number"
              value={sizeMax}
              onChange={(e) => setSizeMax(e.target.value)}
              placeholder="Max size"
              min="0"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {showFilters && (
        <div className="flex justify-center pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <ChevronUpIcon className="w-4 h-4 transition-transform duration-200" />
            <span>Hide filters</span>
          </button>
        </div>
      )}

      {!showFilters && (
        <div className="flex justify-center pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" />
            <span>Show filters</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8 animate-in fade-in duration-200">
          <Loading size="md" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200 animate-in fade-in slide-in-from-top-2 duration-200">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !error && hasAnyFilter && results.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 animate-in fade-in duration-200">
          <p className="text-sm">No results found</p>
        </div>
      )}

      {!hasAnyFilter && !isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 animate-in fade-in duration-200">
          <p className="text-sm">Enter search criteria to find files and folders</p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {results.map((item, index) => {
              if (item.type === 'folder') {
                const folder = item as SearchFolderResult
                return (
                  <a
                    key={`folder-${folder.id}`}
                    href={`/my-files?folderId=${folder.id}`}
                    className="block px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <FolderIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5 transition-transform duration-200 hover:scale-110" />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200">{folder.folder_name}</p>
                        <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <p>Type: Folder</p>
                          <p>ID: {folder.id}</p>
                          <p>Owner: {folder.owner.name} ({folder.owner.email})</p>
                          <p>Created: {formatDate(folder.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                )
              } else {
                const file = item as SearchFileResult
                return (
                  <a
                    key={`file-${file.id}`}
                    href={`/my-files?fileId=${file.id}`}
                    className="block px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] animate-in fade-in slide-in-from-left-2"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <DocumentIcon className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5 transition-transform duration-200 hover:scale-110" />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200">{file.display_name}</p>
                        <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <p>Type: File • Size: {formatFileSize(file.file_size)} • Extension: {file.file_extension}</p>
                          <p>MIME Type: {file.mime_type}</p>
                          <p>ID: {file.id}</p>
                          <p>Owner: {file.owner.name} ({file.owner.email})</p>
                          <p>Created: {formatDate(file.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                )
              }
            })}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_items} items)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.current_page <= 1}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                  disabled={pagination.current_page >= pagination.total_pages}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic')
  const [basicQuery, setBasicQuery] = useState('')

  useEffect(() => {
    if (!open) {
      setBasicQuery('')
      setActiveTab('basic')
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`
                  whitespace-nowrap text-base font-medium pb-2 px-1
                  ${activeTab === 'basic'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('advanced')}
                className={`
                  whitespace-nowrap text-base font-medium pb-2 px-1
                  ${activeTab === 'advanced'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                Advanced Search
              </button>
            </nav>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'basic' ? (
              <BasicSearchTab query={basicQuery} setQuery={setBasicQuery} />
            ) : (
              <AdvancedSearchTab />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

