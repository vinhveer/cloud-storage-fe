import { PlusIcon } from '@heroicons/react/24/outline'
import UploadModal from '@/components/Upload/UploadModal'
import CreateFolderModal from '../CreateFolderModal/CreateFolderModal'
import { useUploadButton } from './hooks/useUploadButton'
import UploadMenu from './components/UploadMenu'
import type { UploadButtonProps } from './types'

export default function UploadButton({ currentFolderId = null }: Readonly<UploadButtonProps>) {
  const {
    uploadMenuOpen,
    setUploadMenuOpen,
    uploadModalOpen,
    setUploadModalOpen,
    createFolderOpen,
    setCreateFolderOpen,
    uploadButtonRef,
    uploadMenuRef,
  } = useUploadButton()

  return (
    <>
      <div className="relative" ref={uploadButtonRef}>
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Create or upload"
          onClick={() => setUploadMenuOpen(prev => !prev)}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        {uploadMenuOpen && (
          <UploadMenu
            menuRef={uploadMenuRef}
            onCreateFolder={() => {
              setUploadMenuOpen(false)
              setCreateFolderOpen(true)
            }}
            onUploadFiles={() => {
              setUploadMenuOpen(false)
              setUploadModalOpen(true)
            }}
          />
        )}
      </div>
      <UploadModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} folderId={currentFolderId} />
      <CreateFolderModal
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        currentFolderId={currentFolderId}
      />
    </>
  )
}

