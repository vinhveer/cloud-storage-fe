export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationMeta {
  totalItems: number
  totalPages: number
  page: number
  limit: number
}

export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}

export type SortOrder = 'asc' | 'desc'

export interface SortParam {
  field: string
  order: SortOrder
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  sort?: SortParam | SortParam[]
  filters?: Record<string, unknown>
}

export interface ApiErrorPayload {
  message?: string
  statusCode?: number
  code?: string
  details?: unknown
}