import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useListShares, useReceivedShares, useShareDetail } from '@/api/features/share/share.queries'
import { useDeleteShare, useRemoveShareUser, useAddShareUsers } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import type { SharedItem, Tab } from '../types'
import { formatDate, getFileTypeFromName } from '../utils'

export function useShared() {
  const [activeTab, setActiveTab] = useState<Tab>('with')
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [manageAccessOpen, setManageAccessOpen] = useState(false)
  const [removeShareDialogOpen, setRemoveShareDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const { showAlert } = useAlert()

  const { data: receivedData, isLoading: isLoadingReceived } = useReceivedShares({})
  const { data: sharedByYouData, isLoading: isLoadingByYou } = useListShares({})
  const { data: shareDetail, isLoading: isLoadingDetail } = useShareDetail(selectedItem?.shareId)

  const deleteShareMutation = useDeleteShare()
  const removeShareUserMutation = useRemoveShareUser()
  const addShareUsersMutation = useAddShareUsers()

  const handleRemoveUser = useCallback(
    (userId: number) => {
      if (!selectedItem) return
      removeShareUserMutation.mutate(
        { shareId: selectedItem.shareId, userId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['share-detail', selectedItem.shareId] })
            queryClient.invalidateQueries({ queryKey: ['shares'] })
            queryClient.invalidateQueries({ queryKey: ['shares-received'] })
            showAlert({ type: 'success', message: 'User removed from share successfully.' })
          },
          onError: () => {
            showAlert({ type: 'error', message: 'Failed to remove user. Please try again.' })
          },
        }
      )
    },
    [selectedItem, removeShareUserMutation, queryClient, showAlert]
  )

  const handleDeleteShare = useCallback(() => {
    if (!selectedItem) return
    deleteShareMutation.mutate(
      { id: selectedItem.shareId },
      {
        onSuccess: () => {
          setRemoveShareDialogOpen(false)
          queryClient.invalidateQueries({ queryKey: ['shares'] })
          showAlert({ type: 'success', message: 'Share removed successfully.' })
        },
        onError: () => {
          showAlert({ type: 'error', message: 'Failed to remove share. Please try again.' })
        },
      }
    )
  }, [selectedItem, deleteShareMutation, queryClient, showAlert])

  const handleAddUsers = useCallback(
    async (userIds: number[]) => {
      if (!shareDetail?.share_id) throw new Error('No share selected')
      await addShareUsersMutation.mutateAsync({
        shareId: shareDetail.share_id,
        userIds,
        permission: 'download',
      })
      queryClient.invalidateQueries({ queryKey: ['share-detail', shareDetail.share_id] })
      queryClient.invalidateQueries({ queryKey: ['shares'] })
      showAlert({ type: 'success', message: 'Users added successfully.' })
    },
    [shareDetail, addShareUsersMutation, queryClient, showAlert]
  )

  const withYouItems: SharedItem[] = (receivedData?.data || []).map((item) => ({
    id: String(item.share_id),
    name: item.shareable_name,
    type: getFileTypeFromName(item.shareable_name, item.shareable_type),
    owner: `${item.owner.name}'s Files`,
    sharedDate: formatDate(item.shared_at),
    shareId: item.share_id,
    shareableType: item.shareable_type,
    shareableId: item.shareable_id,
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

  
  return {
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
    handleAddUsers,
    handleDeleteShare,
    deleteShareMutation,
    removeShareUserMutation,
  }
}

