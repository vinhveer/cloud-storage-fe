import FileList from '@/components/FileList'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import { Button } from '@/components/Button/Button'
import Dialog from '@/components/Dialog/Dialog'
import Loading from '@/components/Loading/Loading'
import { TrashIcon, ArrowDownTrayIcon, InformationCircleIcon, ArrowUturnRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTrashPage } from './hooks/useTrashPage'

export default function TrashPage() {
  const {
    files,
    selectedItems,
    setSelectedItems,
    selectionActionRef,
    search,
    setSearch,
    debouncedSearch,
    currentFolderId,
    breadcrumbItems,
    pagination,
    foldersPagination,
    filesPagination,
    isLoading,
    error,
    emptyTrashDialog,
    setEmptyTrashDialog,
    deleteDialog,
    setDeleteDialog,
    setPage,
    setFolderPage,
    setFilePage,
    handleEmptyTrash,
    handleRestore,
    handleDeletePermanently,
    handleItemOpen,
    handleBreadcrumbClick,
  } = useTrashPage()

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="space-y-1">
        {selectedItems.length === 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trash</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Recently deleted files. After 30 days, they will be permanently removed from your account.
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRestore(selectedItems)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUturnRightIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Restore</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteDialog({ open: true, items: selectedItems })}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Delete permanently</span>
              </button>
              <button
                type="button"
                onClick={() => selectionActionRef.current?.('download', selectedItems)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                type="button"
                onClick={() => selectionActionRef.current?.('details', selectedItems)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <InformationCircleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {selectedItems.length} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedItems([])}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </header>

      {currentFolderId !== null && (
        <div className="min-h-[28px] flex items-center min-w-0">
          <Breadcrumb items={breadcrumbItems} onItemClick={handleBreadcrumbClick} />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
            <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trash..."
            className="block w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          Error: {error.message || 'Failed to load trash items.'}
        </div>
      )}

      {!isLoading && !error && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TrashIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {currentFolderId === null ? 'Trash is empty' : 'Folder is empty'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {debouncedSearch.trim() ? 'No items found matching your search.' : 'No deleted items found.'}
          </p>
        </div>
      )}

      {!isLoading && !error && files.length > 0 && (
        <>
          <section className="flex-1 min-h-0 flex flex-col">
            <FileList
              files={files}
              viewMode="details"
              tilesAlignLeft={true}
              className="flex-1 min-h-0"
              externalSelectionToolbar={true}
              onSelectionChange={setSelectedItems}
              onItemOpen={handleItemOpen}
              actionRef={selectionActionRef}
              folderContextMenuItems={[]}
              fileContextMenuItems={[]}
              toolbarRight={
                <>
                  <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {currentFolderId === null
                      ? (pagination ? `${pagination.total_items} items` : `${files.length} items`)
                      : `${files.length} items`}
                  </span>
                  {currentFolderId === null && (
                    <Button
                      variant="danger"
                      size="md"
                      icon={<TrashIcon className="w-5 h-5 text-current" aria-hidden="true" />}
                      value="Empty Trash"
                      className="inline-flex items-center gap-2"
                      aria-label="Empty Trash"
                      onClick={() => setEmptyTrashDialog(true)}
                      disabled={isLoading}
                    />
                  )}
                </>
              }
            />
          </section>

          {currentFolderId === null && pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_items} items)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.current_page <= 1 || isLoading}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                  disabled={pagination.current_page >= pagination.total_pages || isLoading}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentFolderId !== null && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {foldersPagination && foldersPagination.total_pages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Folders: Page {foldersPagination.current_page} of {foldersPagination.total_pages} ({foldersPagination.total_items} folders)
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFolderPage((p) => Math.max(1, p - 1))}
                      disabled={foldersPagination.current_page <= 1 || isLoading}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setFolderPage((p) => Math.min(foldersPagination.total_pages, p + 1))}
                      disabled={foldersPagination.current_page >= foldersPagination.total_pages || isLoading}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {filesPagination && filesPagination.total_pages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Files: Page {filesPagination.current_page} of {filesPagination.total_pages} ({filesPagination.total_items} files)
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFilePage((p) => Math.max(1, p - 1))}
                      disabled={filesPagination.current_page <= 1 || isLoading}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilePage((p) => Math.min(filesPagination.total_pages, p + 1))}
                      disabled={filesPagination.current_page >= filesPagination.total_pages || isLoading}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <Dialog
        open={emptyTrashDialog}
        onOpenChange={setEmptyTrashDialog}
        title="Empty Trash"
        confirmText="Are you sure you want to permanently delete all items in Trash? This action cannot be undone."
        confirmButtonText="Empty Trash"
        cancelButtonText="Cancel"
        confirmType="danger"
        onConfirm={handleEmptyTrash}
      />

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, items: [] })}
        title="Delete Permanently"
        confirmText={
          deleteDialog.items.length === 1
            ? `Are you sure you want to permanently delete "${deleteDialog.items[0]?.name}"? This action cannot be undone.`
            : `Are you sure you want to permanently delete ${deleteDialog.items.length} items? This action cannot be undone.`
        }
        confirmButtonText="Delete Permanently"
        cancelButtonText="Cancel"
        confirmType="danger"
        onConfirm={() => handleDeletePermanently(deleteDialog.items)}
      />
    </div>
  )
}

