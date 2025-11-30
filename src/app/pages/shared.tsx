import { useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Subnav from '@/components/Subnav/Subnav'
import type { SubnavItem } from '@/components/Subnav/Subnav'
import { getDefaultFileIcon } from '@/components/FileList/file-list.icons'
import type { FileItem, MenuItem } from '@/components/FileList'
import ContextMenu from '@/components/FileList/ContextMenu'
import Dialog from '@/components/Dialog/Dialog'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import Loading from '@/components/Loading/Loading'
import { useListShares, useReceivedShares, useShareDetail } from '@/api/features/share/share.queries'
import { useDeleteShare, useRemoveShareUser } from '@/api/features/share/share.mutations'
import {
  UserGroupIcon,
  InformationCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline'

type SharedItem = FileItem & {
  owner: string
  sharedDate: string
  shareId: number
  shareableType: 'file' | 'folder'
  shareableId?: number
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(isThisYear ? {} : { year: 'numeric' }),
  }
  return date.toLocaleDateString('en-US', options)
}

function getFileTypeFromName(name: string, shareableType: 'file' | 'folder'): string {
  if (shareableType === 'folder') return 'Folder'

  const ext = name.split('.').pop()?.toLowerCase()
  const typeMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    xls: 'Excel',
    xlsx: 'Excel',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
    mp4: 'Video',
    mp3: 'Audio',
    zip: 'Archive',
    rar: 'Archive',
  }
  return typeMap[ext || ''] || 'File'
}

const subnavItems: SubnavItem[] = [
  { id: 'with', label: 'With you' },
  { id: 'by', label: 'By you' },
]

type Tab = 'with' | 'by'


export default function SharedPage() {
  const [activeTab, setActiveTab] = useState<Tab>('with')
  const [contextMenu, setContextMenu] = useState<{
    item: SharedItem
    x: number
    y: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Dialog/Offcanvas states
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [manageAccessOpen, setManageAccessOpen] = useState(false)
  const [removeShareDialogOpen, setRemoveShareDialogOpen] = useState(false)

  const { data: receivedData, isLoading: isLoadingReceived } = useReceivedShares({})
  const { data: sharedByYouData, isLoading: isLoadingByYou } = useListShares({})

  // Get share detail when item is selected
  const { data: shareDetail, isLoading: isLoadingDetail } = useShareDetail(
    selectedItem?.shareId
  )

  const deleteShareMutation = useDeleteShare()
  const removeShareUserMutation = useRemoveShareUser()

  // Handle remove user from share
  const handleRemoveUser = (userId: number) => {
    if (!selectedItem) return
    removeShareUserMutation.mutate(
      { shareId: selectedItem.shareId, userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['share-detail', selectedItem.shareId] })
          queryClient.invalidateQueries({ queryKey: ['shares'] })
        },
      }
    )
  }

  // Menu items for "By you" tab
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

  // Handle delete share
  const handleDeleteShare = () => {
    if (!selectedItem) return
    deleteShareMutation.mutate(
      { id: selectedItem.shareId },
      {
        onSuccess: () => {
          setRemoveShareDialogOpen(false)
          queryClient.invalidateQueries({ queryKey: ['shares'] })
        },
      }
    )
  }

  const handleContextMenu = (e: React.MouseEvent, item: SharedItem) => {
    e.preventDefault()
    setContextMenu({ item, x: e.clientX, y: e.clientY })
  }

  const handleMoreClick = (e: React.MouseEvent, item: SharedItem) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({ item, x: rect.right, y: rect.bottom })
  }

  const withYouItems: SharedItem[] = (receivedData?.data || []).map((item) => ({
    id: String(item.share_id),
    name: item.shareable_name,
    type: getFileTypeFromName(item.shareable_name, item.shareable_type),
    owner: `${item.owner.name}'s Files`,
    sharedDate: formatDate(item.shared_at),
    shareId: item.share_id,
    shareableType: item.shareable_type,
  }))

  const byYouItems: SharedItem[] = (sharedByYouData?.data || []).map((item) => ({
    id: String(item.share_id),
    name: item.shareable_name,
    type: getFileTypeFromName(item.shareable_name, item.shareable_type),
    owner: `Shared with ${item.shared_with_count} ${item.shared_with_count === 1 ? 'person' : 'people'}`,
    sharedDate: formatDate(item.created_at),
    shareId: item.share_id,
    shareableType: item.shareable_type,
  }))

  const items = activeTab === 'with' ? withYouItems : byYouItems
  const isLoading = activeTab === 'with' ? isLoadingReceived : isLoadingByYou

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
          <div>
            {activeTab === 'with' ? 'With you' : 'By you'} · {items.length}{' '}
            {items.length === 1 ? 'item' : 'items'}
          </div>

        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <p>No shared items found</p>
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-900 dark:text-gray-100">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Date shared</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                  {activeTab === 'with' ? 'Shared by' : 'Shared with'}
                </th>
                {activeTab === 'by' && (
                  <th className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-400 w-12"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
                  onContextMenu={activeTab === 'by' ? (e) => handleContextMenu(e, item) : undefined}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getDefaultFileIcon(item, 'w-6 h-6')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.sharedDate}</td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{item.owner}</td>
                  {activeTab === 'by' && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={(e) => handleMoreClick(e, item)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="More options"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Context Menu for "By you" tab */}
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

      {/* Details Offcanvas */}
      <Offcanvas
        title={shareDetail?.shareable_name ?? 'Details'}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        closeButton
        width="25"
      >
        {isLoadingDetail ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="lg" />
          </div>
        ) : shareDetail ? (
          <div className="space-y-6">
            {/* Preview-style icon area */}
            <section className="space-y-2">
              <div className="w-full flex justify-center">
                <div className="w-32 h-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-4xl font-semibold text-gray-500 dark:text-gray-300">
                  {shareDetail.shareable_type === 'folder' ? (
                    <FolderIcon className="w-12 h-12" />
                  ) : (
                    <DocumentIcon className="w-12 h-12" />
                  )}
                </div>
              </div>
            </section>

            {/* Information section similar to My Files detail */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                {shareDetail.shareable_type === 'folder' ? 'Folder information' : 'File information'}
              </h3>
              <dl className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="text-right font-medium truncate max-w-[180px]">
                    {shareDetail.shareable_name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                  <dd className="text-right font-medium capitalize">
                    {shareDetail.shareable_type}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Shared on</dt>
                  <dd className="text-right font-medium">
                    {new Date(shareDetail.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Shared by</dt>
                  <dd className="text-right font-medium truncate max-w-[180px]">
                    {shareDetail.shared_by.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Permission</dt>
                  <dd className="text-right font-medium capitalize">
                    {/* TODO: replace with real aggregate permission if backend provides it */}
                    {shareDetail.shared_with[0]?.permission ?? 'view'}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No details available</p>
        )}
      </Offcanvas>

      {/* Manage Access Offcanvas */}
      <Offcanvas
        title="Manage Access"
        open={manageAccessOpen}
        onOpenChange={setManageAccessOpen}
        closeButton
        width="25"
      >
        {isLoadingDetail ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="lg" />
          </div>
        ) : shareDetail ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage who has access to <strong>{shareDetail.shareable_name}</strong>
            </p>

            <div className="space-y-2">
              {shareDetail.shared_with.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                  No users have access
                </p>
              ) : (
                shareDetail.shared_with.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          Can {user.permission}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.user_id)}
                      disabled={removeShareUserMutation.isPending}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove access"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No access data available</p>
        )}
      </Offcanvas>

      {/* Permission Dialog removed: no update share API available */}

      {/* Remove Share Dialog */}
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


