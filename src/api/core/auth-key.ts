const ACCESS_TOKEN_STORAGE_KEY = 'cloud-storage.accessToken'
const REFRESH_TOKEN_STORAGE_KEY = 'cloud-storage.refreshToken'

function readFromStorage(key: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeToStorage(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(key, value)
}

function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.removeItem(key)
}

export function getAccessToken(): string | null {
  return readFromStorage(ACCESS_TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string): void {
  writeToStorage(ACCESS_TOKEN_STORAGE_KEY, token)
}

export function getRefreshToken(): string | null {
  return readFromStorage(REFRESH_TOKEN_STORAGE_KEY)
}

export function setRefreshToken(token: string): void {
  writeToStorage(REFRESH_TOKEN_STORAGE_KEY, token)
}

export function clearTokens(): void {
  removeFromStorage(ACCESS_TOKEN_STORAGE_KEY)
  removeFromStorage(REFRESH_TOKEN_STORAGE_KEY)
}


