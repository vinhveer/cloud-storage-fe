import { useRecentFiles as useRecentFilesQuery } from '@/api/features/file/file.queries'

export function useRecentFiles(limit = 8) {
  const { data, isLoading } = useRecentFilesQuery(limit)
  const recentFiles = data?.data ?? []

  return {
    recentFiles,
    isLoading,
  }
}

