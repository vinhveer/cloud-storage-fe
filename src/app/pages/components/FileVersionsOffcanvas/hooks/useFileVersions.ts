import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useFileVersions, useFileVersionDetail } from '@/api/features/file-version/file-version.queries'
import { useRestoreFileVersion } from '@/api/features/file-version/file-version.mutations'
import { downloadFileVersion } from '@/api/features/file-version/file-version.api'
import { useDeleteFileVersion } from '@/api/features/file/file.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'

const PER_PAGE = 10

export function useFileVersionsManager(fileId: number | null) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; versionId: number | null }>({
    open: false,
    versionId: null,
  })
  const [restoreDialog, setRestoreDialog] = useState<{ open: boolean; versionId: number | null }>({
    open: false,
    versionId: null,
  })

  const queryClient = useQueryClient()
  const { showAlert } = useAlert()

  const { data, isLoading, error } = useFileVersions({
    fileId: fileId ?? 0,
    page: currentPage,
    perPage: PER_PAGE,
  })

  const { data: versionDetail, isLoading: isLoadingDetail } = useFileVersionDetail({
    fileId: fileId ?? 0,
    versionId: selectedVersionId ?? 0,
  })

  const restoreMutation = useRestoreFileVersion()
  const deleteMutation = useDeleteFileVersion()

  const handleRestore = useCallback(async () => {
    if (!restoreDialog.versionId || !fileId) return

    try {
      await restoreMutation.mutateAsync(
        { fileId, versionId: restoreDialog.versionId },
        {
          onSuccess: () => {
            showAlert({ type: 'success', message: 'Version restored successfully.' })
            queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
            queryClient.invalidateQueries({ queryKey: ['file-detail', fileId] })
            setRestoreDialog({ open: false, versionId: null })
          },
          onError: (error: any) => {
            showAlert({
              type: 'error',
              message: error.message || 'Failed to restore version. Please try again.',
            })
          },
        }
      )
    } catch (error: any) {
      showAlert({ type: 'error', message: error.message || 'Failed to restore version.' })
    }
  }, [restoreDialog.versionId, fileId, restoreMutation, showAlert, queryClient])

  const handleDelete = useCallback(async () => {
    if (!deleteDialog.versionId || !fileId) return

    try {
      await deleteMutation.mutateAsync(
        { fileId, versionId: deleteDialog.versionId },
        {
          onSuccess: () => {
            showAlert({ type: 'success', message: 'Version deleted successfully.' })
            queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
            setDeleteDialog({ open: false, versionId: null })
          },
          onError: (error: any) => {
            showAlert({
              type: 'error',
              message: error.message || 'Failed to delete version. Please try again.',
            })
          },
        }
      )
    } catch (error: any) {
      showAlert({ type: 'error', message: error.message || 'Failed to delete version.' })
    }
  }, [deleteDialog.versionId, fileId, deleteMutation, showAlert, queryClient])

  const handleDownload = useCallback(
    async (versionId: number, versionNumber: number, fileName?: string) => {
      if (!fileId) return

      try {
        const blob = await downloadFileVersion(fileId, versionId)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const fileExtension = fileName?.split('.').pop() || 'file'
        a.download = `${fileName?.replace(/\.[^/.]+$/, '') || 'file'}_v${versionNumber}.${fileExtension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showAlert({ type: 'success', message: 'Version downloaded successfully.' })
      } catch (error: any) {
        showAlert({ type: 'error', message: error.message || 'Failed to download version.' })
      }
    },
    [fileId, showAlert]
  )

  const openDetail = useCallback((versionId: number) => {
    setSelectedVersionId(versionId)
    setShowDetail(true)
  }, [])

  const closeDetail = useCallback(() => {
    setShowDetail(false)
    setSelectedVersionId(null)
  }, [])

  return {
    currentPage,
    setCurrentPage,
    selectedVersionId,
    showDetail,
    deleteDialog,
    restoreDialog,
    setDeleteDialog,
    setRestoreDialog,
    data,
    isLoading,
    error,
    versionDetail,
    isLoadingDetail,
    restoreMutation,
    deleteMutation,
    handleRestore,
    handleDelete,
    handleDownload,
    openDetail,
    closeDetail,
    perPage: PER_PAGE,
  }
}

