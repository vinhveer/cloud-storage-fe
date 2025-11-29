import FileCard from '@/components/FileCard/FileCard'
import type { IconName } from '@/components/FileCard/types'
import { useRecentFiles } from '@/api/features/file/file.queries'
import StorageUsage from '@/components/StorageUsage/StorageUsage'
import { useStorageLimit, useStorageBreakdown } from '@/api/features/storage/storage.queries'

function pickIconFromFileName(name: string): IconName {
  const lower = name.toLowerCase()
  if (lower.endsWith('.doc') || lower.endsWith('.docx')) return 'file-word'
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return 'file-excel'
  if (lower.endsWith('.pdf')) return 'file-pdf'
  if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(lower)) return 'file-image'
  return 'file'
}

function formatLastOpened(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

export default function HomePage() {
  const { data, isLoading } = useRecentFiles(8)
  const recentFiles = data?.data ?? []

  const { data: storageLimit, isLoading: isLoadingLimit } = useStorageLimit()
  const { data: storageBreakdown } = useStorageBreakdown({})

  const storageUsedGB = storageLimit ? bytesToGB(storageLimit.storage_used) : 0
  const storageLimitGB = storageLimit ? bytesToGB(storageLimit.storage_limit) : 0

  return (
    <div className="space-y-6">

      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Home</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A quick overview of your storage usage and recently opened files.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Storage Usage</h3>
        {isLoadingLimit ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading storage information...</p>
        ) : storageLimit ? (
          <StorageUsage used={storageUsedGB} total={storageLimitGB} />
        ) : null}
      </section>

      {storageBreakdown && storageBreakdown.breakdown.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Storage Breakdown</h3>
          <div className="space-y-2">
            {storageBreakdown.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{item.type}</span>
                <span className="font-medium">{bytesToGB(item.total_size).toFixed(2)} GB ({item.count} files)</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent files & folders</h3>
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading recent files...</p>
        ) : recentFiles.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No files have been opened recently.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {recentFiles.map((file) => (
              <div key={file.file_id}>
                <FileCard
                  icon={pickIconFromFileName(file.display_name)}
                  title={file.display_name}
                  subtitle={`Last opened ${formatLastOpened(file.last_opened_at)}`}
                  detailsHref={`/my-files?fileId=${file.file_id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}



