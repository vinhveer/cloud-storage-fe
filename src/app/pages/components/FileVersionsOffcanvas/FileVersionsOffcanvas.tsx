import { XMarkIcon } from '@heroicons/react/24/outline'
import Dialog from '@/components/Dialog/Dialog'
import Loading from '@/components/Loading/Loading'
import Pagination from '@/app/pages/my-files/components/Pagination'
import clsx from 'clsx'
import { useFileVersionsManager } from './hooks/useFileVersions'
import { useUploadVersion } from './hooks/useUploadVersion'
import { useUploadMenu } from './hooks/useUploadMenu'
import VersionListItem from './components/VersionListItem'
import UploadVersionForm from './components/UploadVersionForm'
import VersionDetailPanel from './components/VersionDetailPanel'
import UploadMenuButton from './components/UploadMenuButton'

interface FileVersionsOffcanvasProps {
  fileId: number | null
  fileName?: string
  open: boolean
  onClose: () => void
}

export default function FileVersionsOffcanvas({
  fileId,
  fileName,
  open,
  onClose,
}: FileVersionsOffcanvasProps) {
  const versionsManager = useFileVersionsManager(fileId)
  const uploadVersion = useUploadVersion(fileId)
  const uploadMenu = useUploadMenu()

  if (!fileId) return null

  const latestVersionNumber = versionsManager.data?.data[0]?.version_number ?? 0

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
            {versionsManager.isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" />
              </div>
            )}

            {versionsManager.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
                Error loading versions: {versionsManager.error.message}
              </div>
            )}

            {!versionsManager.isLoading && !versionsManager.error && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {versionsManager.data?.pagination.total_items ?? 0} version{versionsManager.data?.pagination.total_items !== 1 ? 's' : ''}
                  </div>
                  <UploadMenuButton
                    uploadMenuOpen={uploadMenu.uploadMenuOpen}
                    uploadButtonRef={uploadMenu.uploadButtonRef}
                    uploadMenuRef={uploadMenu.uploadMenuRef}
                    onToggleMenu={() => uploadMenu.setUploadMenuOpen(prev => !prev)}
                    onUploadClick={() => {
                      uploadMenu.setUploadMenuOpen(false)
                      uploadVersion.setShowUploadForm(true)
                    }}
                  />
                </div>

                {uploadVersion.showUploadForm && (
                  <UploadVersionForm
                    uploadAction={uploadVersion.uploadAction}
                    uploadNotes={uploadVersion.uploadNotes}
                    uploadFile={uploadVersion.uploadFile}
                    uploadProgress={uploadVersion.uploadProgress}
                    fileInputRef={uploadVersion.fileInputRef}
                    onActionChange={uploadVersion.setUploadAction}
                    onNotesChange={uploadVersion.setUploadNotes}
                    onFileChange={uploadVersion.handleFileChange}
                    onUpload={uploadVersion.handleUpload}
                    onCancel={uploadVersion.resetUploadForm}
                  />
                )}

                {versionsManager.data && versionsManager.data.data.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No versions available</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Upload a new version to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versionsManager.data?.data.map((version) => {
                      const isLatest = version.version_number === latestVersionNumber
                      return (
                        <VersionListItem
                          key={version.version_id}
                          version={version}
                          isLatest={isLatest}
                          isSelected={versionsManager.showDetail && versionsManager.selectedVersionId === version.version_id}
                          onViewDetail={() => versionsManager.openDetail(version.version_id)}
                          onDownload={() => versionsManager.handleDownload(version.version_id, version.version_number, fileName)}
                          onRestore={() => versionsManager.setRestoreDialog({ open: true, versionId: version.version_id })}
                          onDelete={() => versionsManager.setDeleteDialog({ open: true, versionId: version.version_id })}
                        />
                      )
                    })}
                  </div>
                )}

                {versionsManager.data && versionsManager.data.pagination.total_pages > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                      currentPage={versionsManager.data.pagination.current_page}
                      totalPages={versionsManager.data.pagination.total_pages}
                      totalItems={versionsManager.data.pagination.total_items}
                      onPageChange={versionsManager.setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <VersionDetailPanel
        open={versionsManager.showDetail}
        versionDetail={versionsManager.versionDetail}
        isLoading={versionsManager.isLoadingDetail}
        onClose={versionsManager.closeDetail}
      />

      <Dialog
        open={versionsManager.restoreDialog.open}
        onOpenChange={(open) => versionsManager.setRestoreDialog({ open, versionId: null })}
        title="Restore Version"
        confirmText="Are you sure you want to restore this version? This will create a new version from the selected version and make it the current version."
        confirmButtonText={versionsManager.restoreMutation.isPending ? 'Restoring...' : 'Restore'}
        cancelButtonText="Cancel"
        confirmType="primary"
        onConfirm={versionsManager.handleRestore}
        onCancel={() => versionsManager.setRestoreDialog({ open: false, versionId: null })}
        buttonLayout="auto"
      />

      <Dialog
        open={versionsManager.deleteDialog.open}
        onOpenChange={(open) => versionsManager.setDeleteDialog({ open, versionId: null })}
        title="Delete Version"
        confirmText="Are you sure you want to delete this version? This action cannot be undone."
        confirmButtonText={versionsManager.deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelButtonText="Cancel"
        confirmType="danger"
        onConfirm={versionsManager.handleDelete}
        onCancel={() => versionsManager.setDeleteDialog({ open: false, versionId: null })}
        buttonLayout="auto"
      />
    </>
  )
}
