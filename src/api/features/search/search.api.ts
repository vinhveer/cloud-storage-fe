import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { SearchSuccessSchema, SearchSuggestionsEnvelopeSchema } from './search.schemas'
import type { SearchSuccess, SearchSuggestionsData, SearchSuggestionsEnvelope } from './search.types'

const searchSuccessSchema = SearchSuccessSchema
const searchSuggestionsEnvelopeSchema = SearchSuggestionsEnvelopeSchema

export type SearchParams = {
  q?: string
  type?: 'file' | 'folder'
  extension?: string
  size_min?: number
  size_max?: number
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export async function globalSearch(params: SearchParams = {}): Promise<SearchSuccess> {
  const response = await get<unknown>('/api/search', {
    params: {
      q: params.q,
      type: params.type,
      extension: params.extension,
      size_min: params.size_min,
      size_max: params.size_max,
      date_from: params.date_from,
      date_to: params.date_to,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<SearchSuccess>(searchSuccessSchema, response)
  return parsed
}

export type SearchSuggestionsParams = {
  q: string
  type?: 'file' | 'folder' | 'all'
  limit?: number
}

export async function searchSuggestions(params: SearchSuggestionsParams): Promise<SearchSuggestionsData> {
  const response = await get<unknown>('/api/search/suggestions', {
    params: {
      q: params.q,
      type: params.type,
      limit: params.limit,
    },
  })
  const parsed = parseWithZod<SearchSuggestionsEnvelope>(searchSuggestionsEnvelopeSchema, response)
  if (!parsed.success || !parsed.data) {
    throw new Error('Suggestions response is not successful')
  }
  return parsed.data
}



