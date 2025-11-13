// Chuyển một object bất kỳ thành FormData, hỗ trợ object lồng nhau và mảng.
export function toFormData(record: Record<string, unknown>): FormData {
  const formData = new FormData()

  // Duyệt key-value và append vào FormData
  for (const [key, value] of Object.entries(record)) {
    appendToFormData(formData, key, value)
  }

  return formData
}

// Thêm danh sách file vào FormData theo field name (mặc định 'files[]').
export function appendFiles(formData: FormData, files: File[], fieldName = 'files[]'): void {
  for (const file of files) {
    formData.append(fieldName, file)
  }
}

// Hàm đệ quy, xử lý nhiều kiểu dữ liệu và append vào FormData theo đúng format.
function appendToFormData(formData: FormData, key: string, value: unknown): void {
  if (value === null || value === undefined) {
    return
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString())
    return
  }

  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value)
    return
  }

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      appendToFormData(formData, `${key}[${index}]`, item)
    }
    return
  }

  if (typeof value === 'object') {
    // Duyệt từng key con của object để append dạng key[subKey]
    for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      appendToFormData(formData, `${key}[${nestedKey}]`, nestedValue)
    }
    return
  }

  if (typeof value === 'string') {
    formData.append(key, value)
    return
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    formData.append(key, String(value))
  }
}
