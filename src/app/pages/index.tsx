import FileCard from '@/components/FileCard/FileCard'
import type { IconName } from '@/components/FileCard/types'
import { useRecentFiles } from '@/api/features/file/file.queries'

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

export default function HomePage() {
  const { data, isLoading } = useRecentFiles(8)
  const recentFiles = data?.data ?? []

  return (
    <div className="space-y-6">

      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Home</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan nhanh về dung lượng và các tệp gần đây.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent files & folders</h3>
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải file gần đây...</p>
        ) : recentFiles.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có file nào được mở gần đây.</p>
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



