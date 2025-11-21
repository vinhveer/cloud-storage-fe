import { z } from 'zod'

export const SearchOwnerSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  email: z.string(),
})

export const SearchFolderResultSchema = z.object({
  type: z.literal('folder'),
  id: z.number(),
  folder_name: z.string(),
  owner: SearchOwnerSchema,
  created_at: z.string(),
})

export const SearchFileResultSchema = z.object({
  type: z.literal('file'),
  id: z.number(),
  display_name: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  file_extension: z.string(),
  owner: SearchOwnerSchema,
  created_at: z.string(),
})

export const SearchResultItemSchema = z.discriminatedUnion('type', [
  SearchFolderResultSchema,
  SearchFileResultSchema,
])

export const SearchPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const SearchSuccessSchema = z.object({
  data: z.array(SearchResultItemSchema),
  pagination: SearchPaginationSchema,
})

export const SearchSuggestionItemSchema = z.object({
  type: z.enum(['file', 'folder']),
  id: z.number(),
  name: z.string(),
  full_path: z.string(),
})

export const SearchSuggestionsDataSchema = z.object({
  suggestions: z.array(SearchSuggestionItemSchema),
})

export const SearchSuggestionsEnvelopeSchema = z.object({
  success: z.boolean(),
  data: SearchSuggestionsDataSchema.nullable(),
  error: z
    .object({
      message: z.string(),
      code: z.string(),
      errors: z.unknown().nullable(),
    })
    .nullable(),
  meta: z.unknown().nullable(),
})
