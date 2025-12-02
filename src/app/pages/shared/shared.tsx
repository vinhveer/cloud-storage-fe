import React, { useRef } from 'react'
import Subnav from '@/components/Subnav/Subnav'
import type { SubnavItem } from '@/components/Subnav/Subnav'
import ContextMenu from '@/components/FileList/ContextMenu'
import Dialog from '@/components/Dialog/Dialog'
import { UserGroupIcon, InformationCircleIcon, TrashIcon, MinusIcon } from '@heroicons/react/24/outline'
import type { MenuItem } from '@/components/FileList'
import { useShared } from './hooks/useShared'
import SharedTable from './components/SharedTable'
import ShareDetailsOffcanvas from './components/ShareDetailsOffcanvas'
import ManageAccessOffcanvas from './components/ManageAccessOffcanvas'
import type { SharedItem } from './types'

const subnavItems: SubnavItem[] = [
  { id: 'with', label: 'With you' },
  { id: 'by', label: 'By you' },
]

export default function SharedPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    detailsOpen,
    setDetailsOpen,
    manageAccessOpen,
    setManageAccessOpen,
    removeShareDialogOpen,
    setRemoveShareDialogOpen,
    shareDetail,
    isLoadingDetail,
    items,
    isLoading,
    handleRemoveUser,
    handleDeleteShare,
    removeShareUserMutation,
  } = useShared()

  const [contextMenu, setContextMenu] = React.useState<{
    item: SharedItem
    x: number
    y: number
  } | null>(null)

  const getByYouMenuItems = (item: SharedItem): MenuItem[] => [
    {
      label: 'Manage access',
      icon: UserGroupIcon,
      action: () => {
        setSelectedItem(item)
        setManageAccessOpen(true)
      },
    },
    {
      label: 'Details',
      icon: InformationCircleIcon,
      action: () => {
        setSelectedItem(item)
        setDetailsOpen(true)
      },
    },
    {
      label: 'Remove',
      icon: TrashIcon,
      variant: 'danger',
      action: () => {
        setSelectedItem(item)
        setRemoveShareDialogOpen(true)
      },
    },
  ]

  const handleMoreClick = (e: React.MouseEvent, item: SharedItem) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({ item, x: rect.right, y: rect.bottom })
  }

  const handleItemClick = (item: SharedItem) => {
    if (activeTab === 'by') {
      setSelectedItem(item)
      setDetailsOpen(true)
    }
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shared</h2>

      <div className="flex items-center justify-between gap-4">
        <Subnav
          items={subnavItems}
          activeItem={activeTab}
          onItemClick={(item) => {
            if (item.id === 'with') setActiveTab('with')
            if (item.id === 'by') setActiveTab('by')
          }}
        />
      </div>

      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <span>{activeTab === 'with' ? 'With you' : 'By you'}</span>
            <MinusIcon className="w-3 h-3 rotate-90" />
            <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        <SharedTable
          items={items}
          isLoading={isLoading}
          activeTab={activeTab}
          onItemClick={handleItemClick}
          onMoreClick={activeTab === 'by' ? handleMoreClick : undefined}
        />
      </section>

      {contextMenu && activeTab === 'by' && (
        <ContextMenu
          file={contextMenu.item}
          x={contextMenu.x}
          y={contextMenu.y}
          containerRect={containerRef.current?.getBoundingClientRect()}
          menuItems={getByYouMenuItems(contextMenu.item)}
          onClose={() => setContextMenu(null)}
        />
      )}

      <ShareDetailsOffcanvas
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        shareDetail={shareDetail}
        isLoading={isLoadingDetail}
      />

      <ManageAccessOffcanvas
        open={manageAccessOpen}
        onOpenChange={setManageAccessOpen}
        shareDetail={shareDetail}
        isLoading={isLoadingDetail}
        onRemoveUser={handleRemoveUser}
        isRemoving={removeShareUserMutation.isPending}
      />

      <Dialog
        title="Stop Sharing"
        open={removeShareDialogOpen}
        onOpenChange={setRemoveShareDialogOpen}
        confirmText={`Are you sure you want to stop sharing "${selectedItem?.name}"? All users will lose access.`}
        confirmButtonText="Remove"
        cancelButtonText="Cancel"
        confirmType="danger"
        onConfirm={handleDeleteShare}
        onCancel={() => setRemoveShareDialogOpen(false)}
      />
    </div>
  )
}

