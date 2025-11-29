import FileList from '@/components/FileList'
import SelectionToolbar from '@/components/FileList/SelectionToolbar'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import { useMyFiles } from '@/hooks/useMyFiles'

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
  } = useMyFiles()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="min-h-[28px] flex items-center">
        {hasSelection ? (
          <SelectionToolbar
            selectedItems={selectedItems}
            selectedCount={selectedItems.length}
            onAction={handleToolbarAction}
            onDeselectAll={handleDeselectAll}
          />
        ) : (
          <Breadcrumb
            items={breadcrumbItems}
            onItemClick={handleBreadcrumbClick}
          />
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
        />
      </section>
    </div>
  )
}