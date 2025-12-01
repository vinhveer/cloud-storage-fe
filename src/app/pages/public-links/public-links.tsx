import { useRef, useState } from 'react'
import { PlusIcon, InformationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import ContextMenu from '@/components/FileList/ContextMenu'
import Dialog from '@/components/Dialog/Dialog'
import type { MenuItem } from '@/components/FileList'
import { usePublicLinksPage } from './hooks/usePublicLinks'
import PublicLinksTable from './components/PublicLinksTable'
import PublicLinkDetailOffcanvas from './components/PublicLinkDetailOffcanvas'
import UpdatePublicLinkDialog from './components/UpdatePublicLinkDialog'
import CreatePublicLinkModal from './components/CreatePublicLinkModal'
import Pagination from '@/app/pages/my-files/components/Pagination'
import { Button } from '@/components/Button/Button'
import type { PublicLinkItem } from './types'

export default function PublicLinksPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    setCurrentPage,
    selectedLinkId,
    setSelectedLinkId,
    detailOpen,
    setDetailOpen,
    updateDialogOpen,
    setUpdateDialogOpen,
    revokeDialogOpen,
    setRevokeDialogOpen,
    createModalOpen,
    setCreateModalOpen,
    items,
    isLoading,
    pagination,
    handleRevoke,
  } = usePublicLinksPage()

  const [contextMenu, setContextMenu] = useState<{
    item: PublicLinkItem
    x: number
    y: number
  } | null>(null)

  const selectedItem = items.find((item) => item.public_link_id === selectedLinkId)

  const getMenuItems = (item: PublicLinkItem): MenuItem[] => [
    {
      label: 'Details',
      icon: InformationCircleIcon,
      action: () => {
        setSelectedLinkId(item.public_link_id)
        setDetailOpen(true)
      },
    },
    {
      label: 'Update',
      icon: PencilIcon,
      action: () => {
        setSelectedLinkId(item.public_link_id)
        setUpdateDialogOpen(true)
      },
    },
    {
      label: 'Revoke',
      icon: TrashIcon,
      variant: 'danger',
      action: () => {
        setSelectedLinkId(item.public_link_id)
        setRevokeDialogOpen(true)
      },
    },
  ]

  const handleMoreClick = (e: React.MouseEvent, item: PublicLinkItem) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({ item, x: rect.right, y: rect.bottom })
  }

  const handleItemClick = (item: PublicLinkItem) => {
    setSelectedLinkId(item.public_link_id)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Public Links</h2>
        <Button variant="primary" size="md" onClick={() => setCreateModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Public Link
        </Button>
      </div>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <div>
            {items.length} {items.length === 1 ? 'link' : 'links'}
          </div>
        </div>

        <PublicLinksTable
          items={items}
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onMoreClick={handleMoreClick}
        />
      </section>

      {pagination && pagination.total_pages > 1 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total_items}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          file={contextMenu.item as unknown as { id: string | number; name: string }}
          x={contextMenu.x}
          y={contextMenu.y}
          containerRect={containerRef.current?.getBoundingClientRect()}
          menuItems={getMenuItems(contextMenu.item)}
          onClose={() => setContextMenu(null)}
        />
      )}

      <PublicLinkDetailOffcanvas
        open={detailOpen}
        onOpenChange={setDetailOpen}
        token={selectedItem?.token ?? null}
      />

      {selectedItem && (
        <UpdatePublicLinkDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          title="Update Public Link"
          publicLinkId={selectedItem.public_link_id}
          currentPermission={selectedItem.permission}
          currentExpiredAt={selectedItem.expired_at}
          onSuccess={() => {
            setUpdateDialogOpen(false)
            setSelectedLinkId(null)
          }}
        />
      )}

      <Dialog
        title="Revoke Public Link"
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        confirmText={`Are you sure you want to revoke this public link? It will no longer be accessible.`}
        confirmButtonText="Revoke"
        cancelButtonText="Cancel"
        confirmType="danger"
        onConfirm={() => {
          if (selectedLinkId) {
            handleRevoke(selectedLinkId)
          }
        }}
        onCancel={() => setRevokeDialogOpen(false)}
        buttonLayout="auto"
      />

      <CreatePublicLinkModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false)
        }}
      />
    </div>
  )
}

