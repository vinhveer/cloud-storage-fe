const ACCESS_TOKEN_STORAGE_KEY = 'cloud-storage.accessToken'
const REFRESH_TOKEN_STORAGE_KEY = 'cloud-storage.refreshToken'

/**
 * Đọc giá trị từ localStorage theo key.
 * Hàm có kiểm tra môi trường để tránh lỗi khi chạy server-side.
 */
function readFromStorage(key: string): string | null {
  if (globalThis.window === undefined || !globalThis.localStorage) {
    return null
  }
  try {
    return globalThis.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Ghi giá trị lên localStorage.
 * Nếu không có window hoặc localStorage thì bỏ qua.
 */
function writeToStorage(key: string, value: string): void {
  if (globalThis.window === undefined || !globalThis.localStorage) {
    return
  }
  globalThis.localStorage.setItem(key, value)
}

/**
 * Xoá một key khỏi localStorage.
 */
function removeFromStorage(key: string): void {
  if (globalThis.window === undefined || !globalThis.localStorage) {
    return
  }
  globalThis.localStorage.removeItem(key)
}

/**
 * Lấy access token từ localStorage.
 */
export function getAccessToken(): string | null {
  return readFromStorage(ACCESS_TOKEN_STORAGE_KEY)
}

/**
 * Ghi access token vào localStorage.
 */
export function setAccessToken(token: string): void {
  writeToStorage(ACCESS_TOKEN_STORAGE_KEY, token)
}

/**
 * Lấy refresh token từ localStorage.
 */
export function getRefreshToken(): string | null {
  return readFromStorage(REFRESH_TOKEN_STORAGE_KEY)
}

/**
 * Ghi refresh token vào localStorage.
 */
export function setRefreshToken(token: string): void {
  writeToStorage(REFRESH_TOKEN_STORAGE_KEY, token)
}

/**
 * Xoá cả access token và refresh token khỏi localStorage.
 */
export function clearTokens(): void {
  removeFromStorage(ACCESS_TOKEN_STORAGE_KEY)
  removeFromStorage(REFRESH_TOKEN_STORAGE_KEY)
}