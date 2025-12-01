import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import { useFileVersions } from '@/api/features/file-version/file-version.queries'
import { useDeleteFileVersion } from '@/api/features/file/file.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Dialog from '@/components/Dialog/Dialog'
import Loading from '@/components/Loading/Loading'
import { useQueryClient } from '@tanstack/react-query'

interface FileVersionsOffcanvasProps {
  fileId: number | null
  fileName?: string
  open: boolean
  onClose: () => void
}

function formatFileSize(bytes: number): string {
  const sizeInKB = bytes / 1024
  const sizeInMB = sizeInKB / 1024
  if (sizeInMB >= 1) return `${sizeInMB.toFixed(2)} MB`
  return `${sizeInKB.toFixed(2)} KB`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function FileVersionsOffcanvas({ fileId, fileName, open, onClose }: FileVersionsOffcanvasProps) {
  const { data, isLoading, error } = useFileVersions({ fileId: fileId ?? 0 })
  const deleteMutation = useDeleteFileVersion()
  const queryClient = useQueryClient()
  const { showAlert } = useAlert()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; versionId: number | null }>({
    open: false,
    versionId: null,
  })

  const handleDelete = async () => {
    if (!deleteDialog.versionId || !fileId) return

    try {
      await deleteMutation.mutateAsync({ fileId, versionId: deleteDialog.versionId })
      showAlert({ type: 'success', heading: 'Success', message: 'Version deleted successfully.' })
      setDeleteDialog({ open: false, versionId: null })
      void queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
    } catch (error: any) {
      showAlert({ type: 'error', heading: 'Delete Failed', message: error.message || 'Failed to delete version.' })
    }
  }

  if (!fileId) return null

  return (
    <>
      <Offcanvas
        id="file-versions-offcanvas"
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose()
        }}
        width="25"
        alignment="right"
        title={fileName || 'File Versions'}
        closeButton={{ position: 'right' }}
      >
        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loading size="md" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
              Error loading versions: {error.message}
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Versions ({data?.pagination.total_items ?? 0})
              </div>
              {data && data.data.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No versions available</p>
              ) : (
                <div className="space-y-2">
                  {data?.data.map((version) => (
                    <div
                      key={version.version_id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Version {version.version_number}
                          </span>
                          {version.action && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">({version.action})</span>
                          )}
                        </div>
                        {version.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">{version.notes}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(version.file_size)}</span>
                          <span>•</span>
                          <span>{formatDate(version.created_at)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeleteDialog({ open: true, versionId: version.version_id })}
                        className="ml-2 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                        title="Delete version"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Offcanvas>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, versionId: null })}
        title="Delete Version"
        confirmText="Are you sure you want to delete this version? This action cannot be undone."
        confirmButtonText="Delete"
        confirmType="danger"
        onConfirm={handleDelete}
      />
    </>
  )
}

