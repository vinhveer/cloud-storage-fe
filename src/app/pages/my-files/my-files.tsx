import FileList from '@/components/FileList'
import SelectionToolbar from '@/components/FileList/SelectionToolbar'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import { useMyFiles } from './hooks/useMyFiles'
import Loading from '@/components/Loading/Loading'
import FilePreviewModal from '@/app/pages/components/FilePreviewModal'
import MyFilesDialogs from './components/MyFilesDialogs'
import MyFilesToolbar from './components/MyFilesToolbar'
import Pagination from './components/Pagination'

export default function MyFilesPage() {
  const {
    files,
    isLoading,
    breadcrumbItems,
    hasSelection,
    selectedItems,
    actionRef,
    handleItemOpen,
    handleBreadcrumbClick,
    handleSelectionChange,
    handleDeselectAll,
    handleToolbarAction,
    previewFileId,
    previewFileName,
    handleClosePreview,
    dialogs,
    folderContextMenuItems,
    fileContextMenuItems,
    searchQuery,
    handleSearchChange,
    handlePageChange,
    pagination,
    currentFolderId,
    filterState,
    setFilterState,
  } = useMyFiles()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-3 sm:gap-4">
      <div className="min-h-[28px] flex items-center min-w-0 gap-3">
        {hasSelection ? (
          <SelectionToolbar
            selectedItems={selectedItems}
            selectedCount={selectedItems.length}
            onAction={handleToolbarAction}
            onDeselectAll={handleDeselectAll}
          />
        ) : (
          <>
            <Breadcrumb
              items={breadcrumbItems}
              onItemClick={handleBreadcrumbClick}
              className="flex-1 min-w-0"
            />
            <MyFilesToolbar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              currentFolderId={currentFolderId}
            />
          </>
        )}
      </div>

      <section className="flex-1 min-h-0 flex flex-col">
        <FileList
          files={files}
          viewMode="details"
          className="flex-1 min-h-0"
          onItemOpen={handleItemOpen}
          onSelectionChange={handleSelectionChange}
          externalSelectionToolbar
          actionRef={actionRef}
          folderContextMenuItems={folderContextMenuItems}
          fileContextMenuItems={fileContextMenuItems}
          filterState={filterState}
          onFilterChange={setFilterState}
        />
        {pagination && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total_items}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>

      <FilePreviewModal
        fileId={previewFileId}
        fileName={previewFileName}
        open={previewFileId !== null}
        onClose={handleClosePreview}
      />

      <MyFilesDialogs
        {...dialogs}
        onDeselectAll={handleDeselectAll}
      />
    </div>
  )
}

