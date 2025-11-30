import { useStorageLimit } from '@/api/features/storage/storage.queries'

export function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

export function useStorageUsage() {
  const { data: storageLimit, isLoading } = useStorageLimit()

  const storageUsedGB = storageLimit ? bytesToGB(storageLimit.storage_used) : 0
  const storageLimitGB = storageLimit ? bytesToGB(storageLimit.storage_limit) : 0

  return {
    storageLimit,
    storageUsedGB,
    storageLimitGB,
    isLoading,
  }
}

