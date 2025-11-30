import { useCallback, useEffect, useRef, useState } from 'react'

export type UseSearchOptions<T> = {
  onSearch?: (query: string) => Promise<T[]>
  debounceMs?: number
}

export function useSearch<T>({ onSearch, debounceMs = 250 }: UseSearchOptions<T>) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<T[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canSearch = typeof onSearch === 'function'

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [close])

  const runSearch = useCallback(async (q: string) => {
    if (!canSearch) return
    setIsLoading(true)
    try {
      const searchFn = onSearch
      if (!searchFn) return
      const data = await searchFn(q)
      setResults(Array.isArray(data) ? data : [])
    } finally {
      setIsLoading(false)
    }
  }, [canSearch, onSearch])

  useEffect(() => {
    if (!canSearch) return
    if (!query) {
      setResults([])
      return
    }
    const t = setTimeout(() => runSearch(query), debounceMs)
    return () => clearTimeout(t)
  }, [query, canSearch, runSearch, debounceMs])

  return {
    query,
    setQuery,
    isLoading,
    results,
    open,
    setOpen,
    containerRef,
  }
}


