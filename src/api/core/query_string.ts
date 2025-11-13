type QueryValue = string | number | boolean | Date | null | undefined
type QueryRecord = Record<string, QueryValue | QueryValue[]>

/**
 * Kiểm tra giá trị có phải null hoặc undefined hay không.
 */
function isNil(value: QueryValue): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Chuyển giá trị thành string để đưa vào query string.
 * Nếu là Date thì convert sang ISO.
 */
function serializeValue(value: QueryValue): string {
  if (value instanceof Date) {
    return value.toISOString()
  }
  return String(value)
}

/**
 * Xây dựng query string từ object params.
 * Bỏ qua giá trị null, undefined và chuỗi rỗng.
 * Hỗ trợ giá trị mảng bằng cách append nhiều lần.
 */
export function buildQuery(params: QueryRecord): string {
  const searchParams = new URLSearchParams()

  // Dùng for...of thay vì forEach theo gợi ý lint
  for (const [key, rawValue] of Object.entries(params)) {

    // Trường hợp value là mảng
    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        if (isNil(item) || item === '') {
          continue
        }
        searchParams.append(key, serializeValue(item))
      }
      continue
    }

    // Trường hợp value là giá trị đơn
    if (isNil(rawValue) || rawValue === '') {
      continue
    }

    searchParams.append(key, serializeValue(rawValue))
  }

  return searchParams.toString()
}

/**
 * Hàm tiện ích để truyền paging.
 */
export function paginate(page: number, limit: number): { page: number; limit: number } {
  return { page, limit }
}

/**
 * Gộp URL và query string.  
 * Nếu base URL đã có query thì dùng dấu "&", nếu không thì dùng dấu "?".
 */
export function mergeUrl(baseUrl: string, params: QueryRecord): string {
  const query = buildQuery(params)

  if (!query) {
    return baseUrl
  }

  const hasQuery = baseUrl.includes('?')
  const separator = hasQuery ? '&' : '?'
  return `${baseUrl}${separator}${query}`
}
