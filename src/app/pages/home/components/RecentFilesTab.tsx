import { useState } from 'react'
import FileCard from '@/components/FileCard/FileCard'
import type { IconName } from '@/components/FileCard/types'
import { useRecentFiles } from '../hooks/useRecentFiles'
import Loading from '@/components/Loading/Loading'
import FileDetailPanel from '@/app/pages/components/FileDetailPanel'
import type { FileItem } from '@/components/FileList/types'
import { useFileDetail } from '@/api/features/file/file.queries'

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


export default function RecentFilesTab() {
  const { recentFiles, isLoading } = useRecentFiles(8)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
  const { data: fileDetail } = useFileDetail(selectedFileId ?? undefined)

  const handleDetailsClick = (fileId: number) => {
    setSelectedFileId(fileId)
  }

  const handleCloseModal = () => {
    setSelectedFileId(null)
  }

  const fileItem: FileItem | null = fileDetail
    ? {
        id: fileDetail.file_id,
        name: fileDetail.display_name,
        type: fileDetail.file_extension.toUpperCase(),
      }
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading size="lg" />
      </div>
    )
  }

  if (recentFiles.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No files have been opened recently.</p>
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {recentFiles.map((file) => (
          <div key={file.file_id}>
            <FileCard
              icon={pickIconFromFileName(file.display_name)}
              title={file.display_name}
              subtitle={`Last opened ${formatLastOpened(file.last_opened_at)}`}
              detailsHref="#"
              onDetailsClick={() => handleDetailsClick(file.file_id)}
            />
          </div>
        ))}
      </div>

      <FileDetailPanel
        file={fileItem}
        fileDetail={fileDetail ?? null}
        open={selectedFileId !== null}
        onClose={handleCloseModal}
      />
    </>
  )
}

