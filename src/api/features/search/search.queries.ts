import { useQuery } from '@tanstack/react-query'
import { globalSearch, searchSuggestions, type SearchParams, type SearchSuggestionsParams } from './search.api'
import type { SearchSuccess, SearchSuggestionsData } from './search.types'
import type { AppError } from '../../core/error'

export function useGlobalSearch(params: SearchParams, options?: { enabled?: boolean }) {
  return useQuery<SearchSuccess, AppError>({
    queryKey: ['global-search', params],
    queryFn: () => globalSearch(params),
    enabled: options?.enabled !== false,
  })
}

export function useSearchSuggestions(params: SearchSuggestionsParams | null) {
  return useQuery<SearchSuggestionsData, AppError>({
    queryKey: ['search-suggestions', params],
    enabled: !!params && params.q.trim().length > 0,
    queryFn: () => {
      if (!params || !params.q.trim()) {
        throw new Error('q is required')
      }
      return searchSuggestions(params)
    },
  })
}


