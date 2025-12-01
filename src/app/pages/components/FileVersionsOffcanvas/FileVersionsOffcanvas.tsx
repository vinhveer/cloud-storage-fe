import { useState, useCallback, useRef, useEffect } from 'react'
import {
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  PlusIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'
import { useFileVersions, useFileVersionDetail } from '@/api/features/file-version/file-version.queries'
import {
  useRestoreFileVersion,
} from '@/api/features/file-version/file-version.mutations'
import { downloadFileVersion } from '@/api/features/file-version/file-version.api'
import { useDeleteFileVersion } from '@/api/features/file/file.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import Dialog from '@/components/Dialog/Dialog'
import Loading from '@/components/Loading/Loading'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/Button/Button'
import Pagination from '@/app/pages/my-files/components/Pagination'
import clsx from 'clsx'

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

function formatDateTime(dateString: string): string {
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

export default function FileVersionsOffcanvas({
  fileId,
  fileName,
  open,
  onClose,
}: FileVersionsOffcanvasProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; versionId: number | null }>({
    open: false,
    versionId: null,
  })
  const [restoreDialog, setRestoreDialog] = useState<{ open: boolean; versionId: number | null }>({
    open: false,
    versionId: null,
  })
  const [uploadAction, setUploadAction] = useState('update')
  const [uploadNotes, setUploadNotes] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadButtonRef = useRef<HTMLDivElement | null>(null)
  const uploadMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!uploadMenuOpen) return
      if (
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(e.target as Node) &&
        uploadButtonRef.current &&
        !uploadButtonRef.current.contains(e.target as Node)
      ) {
        setUploadMenuOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUploadMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [uploadMenuOpen])

  const perPage = 10
  const queryClient = useQueryClient()
  const { showAlert } = useAlert()

  const { data, isLoading, error } = useFileVersions({
    fileId: fileId ?? 0,
    page: currentPage,
    perPage,
  })

  const { data: versionDetail, isLoading: isLoadingDetail } = useFileVersionDetail({
    fileId: fileId ?? 0,
    versionId: selectedVersionId ?? 0,
  })

  const restoreMutation = useRestoreFileVersion()
  const deleteMutation = useDeleteFileVersion()

  const handleUpload = useCallback(async () => {
    if (!fileId || !uploadFile) return

    setUploadProgress(0)

    try {
      const { toFormData } = await import('@/api/core/upload')
      const { upload } = await import('@/api/core/fetcher')

      const formData = toFormData({
        action: uploadAction,
        notes: uploadNotes || undefined,
        file: uploadFile,
      })

      await upload(`/api/files/${fileId}/versions`, formData, {
        onProgress: (percent) => {
          setUploadProgress(percent)
        },
      })

      setUploadProgress(100)
      showAlert({ type: 'success', message: 'Version uploaded successfully.' })
      queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
      setShowUploadForm(false)
      setUploadFile(null)
      setUploadAction('update')
      setUploadNotes('')
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        message: error.message || 'Failed to upload version. Please try again.',
      })
      setUploadProgress(0)
    }
  }, [fileId, uploadFile, uploadAction, uploadNotes, showAlert, queryClient])

  const handleRestore = useCallback(async () => {
    if (!restoreDialog.versionId || !fileId) return

    try {
      await restoreMutation.mutateAsync(
        { fileId, versionId: restoreDialog.versionId },
        {
          onSuccess: () => {
            showAlert({ type: 'success', message: 'Version restored successfully.' })
            queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
            queryClient.invalidateQueries({ queryKey: ['file-detail', fileId] })
            setRestoreDialog({ open: false, versionId: null })
          },
          onError: (error: any) => {
            showAlert({
              type: 'error',
              message: error.message || 'Failed to restore version. Please try again.',
            })
          },
        }
      )
    } catch (error: any) {
      showAlert({ type: 'error', message: error.message || 'Failed to restore version.' })
    }
  }, [restoreDialog.versionId, fileId, restoreMutation, showAlert, queryClient])

  const handleDelete = useCallback(async () => {
    if (!deleteDialog.versionId || !fileId) return

    try {
      await deleteMutation.mutateAsync(
        { fileId, versionId: deleteDialog.versionId },
        {
          onSuccess: () => {
            showAlert({ type: 'success', message: 'Version deleted successfully.' })
            queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
            setDeleteDialog({ open: false, versionId: null })
          },
          onError: (error: any) => {
            showAlert({
              type: 'error',
              message: error.message || 'Failed to delete version. Please try again.',
            })
          },
        }
      )
    } catch (error: any) {
      showAlert({ type: 'error', message: error.message || 'Failed to delete version.' })
    }
  }, [deleteDialog.versionId, fileId, deleteMutation, showAlert, queryClient])

  const handleDownload = useCallback(
    async (versionId: number, versionNumber: number) => {
      if (!fileId) return

      try {
        const blob = await downloadFileVersion(fileId, versionId)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const fileExtension = fileName?.split('.').pop() || 'file'
        a.download = `${fileName?.replace(/\.[^/.]+$/, '') || 'file'}_v${versionNumber}.${fileExtension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showAlert({ type: 'success', message: 'Version downloaded successfully.' })
      } catch (error: any) {
        showAlert({ type: 'error', message: error.message || 'Failed to download version.' })
      }
    },
    [fileId, fileName, showAlert]
  )

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }, [])

  if (!fileId) return null

  const latestVersionNumber = data?.data[0]?.version_number ?? 0

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-50 overflow-hidden transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          className={clsx(
            'absolute right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 flex flex-col',
            open ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Version History
              </h2>
              {fileName && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{fileName}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
                Error loading versions: {error.message}
              </div>
            )}

            {!isLoading && !error && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data?.pagination.total_items ?? 0} version{data?.pagination.total_items !== 1 ? 's' : ''}
                  </div>
                  <div className="relative" ref={uploadButtonRef}>
                    <button
                      type="button"
                      className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                      aria-label="Upload new version"
                      onClick={() => setUploadMenuOpen(prev => !prev)}
                    >
                      <PlusIcon className="w-6 h-6" />
                    </button>
                    {uploadMenuOpen && (
                      <div
                        ref={uploadMenuRef}
                        className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50"
                      >
                        <button
                          onClick={() => {
                            setUploadMenuOpen(false)
                            setShowUploadForm(true)
                          }}
                          className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                        >
                          <ArrowUpTrayIcon className="w-5 h-5 flex-shrink-0" />
                          <span>Upload New Version</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {showUploadForm && (
                  <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                      Upload New Version
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Action
                        </label>
                        <select
                          value={uploadAction}
                          onChange={(e) => setUploadAction(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="update">Update</option>
                          <option value="upload">Upload</option>
                          <option value="revision">Revision</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={uploadNotes}
                          onChange={(e) => setUploadNotes(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add notes about this version..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          File
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {uploadFile && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                          </p>
                        )}
                      </div>

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleUpload}
                          disabled={!uploadFile || (uploadProgress > 0 && uploadProgress < 100)}
                        >
                          {uploadProgress > 0 && uploadProgress < 100 ? (
                            <>
                              <Loading size="sm" className="mr-2" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Version'
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setShowUploadForm(false)
                            setUploadFile(null)
                            setUploadAction('update')
                            setUploadNotes('')
                            setUploadProgress(0)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {data && data.data.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No versions available</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Upload a new version to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data?.data.map((version) => {
                      const isLatest = version.version_number === latestVersionNumber
                      return (
                        <div
                          key={version.version_id}
                          className={clsx(
                            'p-4 rounded-lg border transition-colors',
                            isLatest
                              ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                            showDetail && selectedVersionId === version.version_id
                              ? 'ring-2 ring-blue-500'
                              : ''
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Version {version.version_number}
                                </span>
                                {isLatest && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                    Latest
                                  </span>
                                )}
                                {version.action && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({version.action})
                                  </span>
                                )}
                              </div>
                              {version.notes && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 break-words">
                                  {version.notes}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>{formatFileSize(version.file_size)}</span>
                                <span>•</span>
                                <span>{formatDateTime(version.created_at)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedVersionId(version.version_id)
                                  setShowDetail(true)
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="View details"
                              >
                                <InformationCircleIcon className="w-5 h-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownload(version.version_id, version.version_number)}
                                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Download version"
                              >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                              </button>
                              {!isLatest && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRestoreDialog({ open: true, versionId: version.version_id })
                                  }
                                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title="Restore version"
                                >
                                  <ArrowPathIcon className="w-5 h-5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setDeleteDialog({ open: true, versionId: version.version_id })}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Delete version"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {data && data.pagination.total_pages > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                      currentPage={data.pagination.current_page}
                      totalPages={data.pagination.total_pages}
                      totalItems={data.pagination.total_items}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showDetail && selectedVersionId && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetail(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Version Detail
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowDetail(false)
                  setSelectedVersionId(null)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <Loading size="lg" />
                </div>
              ) : versionDetail ? (
                <div className="space-y-4">
                  <section>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Version Information
                    </h4>
                    <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Version Number</dt>
                        <dd className="text-right font-medium">{versionDetail.version_number}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Action</dt>
                        <dd className="text-right font-medium capitalize">{versionDetail.action}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">File Size</dt>
                        <dd className="text-right font-medium">{formatFileSize(versionDetail.file_size)}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">File Extension</dt>
                        <dd className="text-right font-medium">{versionDetail.file_extension}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">MIME Type</dt>
                        <dd className="text-right font-medium">{versionDetail.mime_type}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Created At</dt>
                        <dd className="text-right font-medium">
                          {formatDateTime(versionDetail.created_at)}
                        </dd>
                      </div>
                      {versionDetail.notes && (
                        <div className="flex flex-col gap-2">
                          <dt className="text-gray-500 dark:text-gray-400">Notes</dt>
                          <dd className="text-sm text-gray-700 dark:text-gray-200 break-words">
                            {versionDetail.notes}
                          </dd>
                        </div>
                      )}
                      {versionDetail.uploaded_by && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-gray-500 dark:text-gray-400">Uploaded By</dt>
                          <dd className="text-right font-medium">{versionDetail.uploaded_by.name}</dd>
                        </div>
                      )}
                    </dl>
                  </section>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No details available</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={restoreDialog.open}
        onOpenChange={(open) => setRestoreDialog({ open, versionId: null })}
        title="Restore Version"
        confirmText="Are you sure you want to restore this version? This will create a new version from the selected version and make it the current version."
        confirmButtonText={restoreMutation.isPending ? 'Restoring...' : 'Restore'}
        cancelButtonText="Cancel"
        confirmType="primary"
        onConfirm={handleRestore}
        onCancel={() => setRestoreDialog({ open: false, versionId: null })}
        buttonLayout="auto"
      />

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, versionId: null })}
        title="Delete Version"
        confirmText="Are you sure you want to delete this version? This action cannot be undone."
        confirmButtonText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelButtonText="Cancel"
        confirmType="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, versionId: null })}
        buttonLayout="auto"
      />
    </>
  )
}
