import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePublicLinks } from '@/api/features/public-link/public-link.queries'
import { useRevokePublicLink } from '@/api/features/public-link/public-link.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import type { PublicLinkItem } from '../types'
import { getPublicLinkStatus } from '../utils'

export function usePublicLinksPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const perPage = 20
  const queryClient = useQueryClient()
  const { showAlert } = useAlert()

  const { data: publicLinksData, isLoading } = usePublicLinks({ page: currentPage, per_page: perPage })
  const revokeMutation = useRevokePublicLink()

  const items: PublicLinkItem[] = (publicLinksData?.data || []).map((item) => ({
    ...item,
    status: getPublicLinkStatus(item.expired_at, item.revoked_at),
  }))

  const handleRevoke = useCallback(
    (id: number) => {
      revokeMutation.mutate(
        { id },
        {
          onSuccess: () => {
            setRevokeDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ['public-links'] })
            showAlert({ type: 'success', message: 'Public link revoked successfully.' })
          },
          onError: () => {
            showAlert({ type: 'error', message: 'Failed to revoke public link. Please try again.' })
          },
        }
      )
    },
    [revokeMutation, queryClient, showAlert]
  )

  return {
    currentPage,
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
    pagination: publicLinksData?.pagination,
    handleRevoke,
    revokeMutation,
  }
}

