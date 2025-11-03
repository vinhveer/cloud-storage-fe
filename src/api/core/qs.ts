type QueryValue = string | number | boolean | Date | null | undefined
type QueryRecord = Record<string, QueryValue | QueryValue[]>

function isNil(value: QueryValue): value is null | undefined {
  return value === null || value === undefined
}

function serializeValue(value: QueryValue): string {
  if (value instanceof Date) {
    return value.toISOString()
  }
  return String(value)
}

export function buildQuery(params: QueryRecord): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, rawValue]) => {
    if (Array.isArray(rawValue)) {
      rawValue.forEach(item => {
        if (isNil(item) || item === '') {
          return
        }
        searchParams.append(key, serializeValue(item))
      })
      return
    }

    if (isNil(rawValue) || rawValue === '') {
      return
    }

    searchParams.append(key, serializeValue(rawValue))
  })

  return searchParams.toString()
}

export function paginate(page: number, limit: number): { page: number; limit: number } {
  return { page, limit }
}

export function mergeUrl(baseUrl: string, params: QueryRecord): string {
  const query = buildQuery(params)
  if (!query) {
    return baseUrl
  }

  const hasQuery = baseUrl.includes('?')
  const separator = hasQuery ? '&' : '?'
  return `${baseUrl}${separator}${query}`
}


