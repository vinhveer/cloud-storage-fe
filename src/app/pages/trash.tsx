import FileList from '@/components/FileList'
import { Button } from '@/components/Button/Button'
import type { FileItem } from '@/components/FileList'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useAlert } from '@/components/Alert'

const trashItems: FileItem[] = [
  {
    id: 'old-hr',
    name: 'Hồ sơ nhân sự (cũ)',
    type: 'Folder',
    modified: 'Deleted Oct 10, 2024',
    itemsCount: 12,
  },
  {
    id: 'old-plan',
    name: 'Kế hoạch quý 3.xlsx',
    type: 'Excel',
    modified: 'Deleted Sep 21, 2024',
    size: '540 KB',
  },
  {
    id: 'meeting-notes',
    name: 'Meeting-notes.docx',
    type: 'Word',
    modified: 'Deleted Sep 12, 2024',
    size: '48 KB',
  },
  {
    id: 'design-v1',
    name: 'Design-v1.png',
    type: 'Image',
    modified: 'Deleted Aug 30, 2024',
    size: '3.2 MB',
  },
  {
    id: 'contract',
    name: 'Contract-2023.pdf',
    type: 'PDF',
    modified: 'Deleted Aug 02, 2024',
    size: '1.1 MB',
  },
]

export default function TrashPage() {
  const { showAlert } = useAlert()

  const handleEmptyTrash = () => {
    // TODO: implement API call
    showAlert({
      type: 'warning',
      heading: 'Empty Trash',
      message: 'This feature is not yet implemented. Coming soon!',
      duration: 4000
    })
  }
  return (
    <div className="h-full flex flex-col gap-6">

      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Trash</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Các tệp đã xóa gần đây. Sau 30 ngày, chúng sẽ bị xóa vĩnh viễn khỏi tài khoản của bạn.
        </p>
      </header>

      <section className="flex-1 min-h-0 flex flex-col">
        <FileList
          files={trashItems}
          viewMode="details"
          tilesAlignLeft={true}
          className="flex-1 min-h-0"
          toolbarRight={
            <>
              <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400 mr-2">
                {trashItems.length} items
              </span>
              <Button
                variant="danger"
                size="md"
                icon={<TrashIcon className="w-5 h-5 text-current" aria-hidden="true" />}
                value="Empty Trash"
                className="inline-flex items-center gap-2"
                aria-label="Empty Trash"
                onClick={handleEmptyTrash}
              />
            </>
          }
        />
      </section>
    </div>
  )
}


