import { z } from 'zod'
import {
  SearchFileResultSchema,
  SearchFolderResultSchema,
  SearchOwnerSchema,
  SearchPaginationSchema,
  SearchResultItemSchema,
  SearchSuccessSchema,
  SearchSuggestionItemSchema,
  SearchSuggestionsDataSchema,
  SearchSuggestionsEnvelopeSchema,
} from './search.schemas'

export type SearchOwner = z.infer<typeof SearchOwnerSchema>
export type SearchFolderResult = z.infer<typeof SearchFolderResultSchema>
export type SearchFileResult = z.infer<typeof SearchFileResultSchema>
export type SearchResultItem = z.infer<typeof SearchResultItemSchema>
export type SearchPagination = z.infer<typeof SearchPaginationSchema>
export type SearchSuccess = z.infer<typeof SearchSuccessSchema>

export type SearchSuggestionItem = z.infer<typeof SearchSuggestionItemSchema>
export type SearchSuggestionsData = z.infer<typeof SearchSuggestionsDataSchema>
export type SearchSuggestionsEnvelope = z.infer<typeof SearchSuggestionsEnvelopeSchema>

