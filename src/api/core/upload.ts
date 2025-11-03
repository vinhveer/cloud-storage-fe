export function toFormData(record: Record<string, unknown>): FormData {
  const formData = new FormData()

  Object.entries(record).forEach(([key, value]) => {
    appendToFormData(formData, key, value)
  })

  return formData
}

export function appendFiles(formData: FormData, files: File[], fieldName = 'files[]'): void {
  files.forEach(file => {
    formData.append(fieldName, file)
  })
}

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
    value.forEach((item, index) => {
      appendToFormData(formData, `${key}[${index}]`, item)
    })
    return
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
      appendToFormData(formData, `${key}[${nestedKey}]`, nestedValue)
    })
    return
  }

  formData.append(key, String(value))
}


