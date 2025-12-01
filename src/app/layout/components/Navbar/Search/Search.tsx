import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import SearchModal from './SearchModal'
import type { SearchProps } from './types'

export default function Search({ placeholder = 'Search...', className }: Readonly<SearchProps>) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key === 'k' || e.key === 'K'
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault()
        setOpen(true)
      }
    }
    globalThis.addEventListener('keydown', onKey as unknown as EventListener)
    return () => globalThis.removeEventListener('keydown', onKey as unknown as EventListener)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${className} flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 transition-colors`}
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        <span className="hidden md:inline">{placeholder}</span>
        <span className="hidden lg:inline text-xs text-gray-400 dark:text-gray-500 ml-auto">Ctrl+K</span>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}


