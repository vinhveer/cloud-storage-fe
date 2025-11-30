import React from 'react'
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import { useListShares, useShareDetail } from '@/api/features/share/share.queries'
import { useRemoveShareUser } from '@/api/features/share/share.mutations'
import { useAlert } from '@/components/Alert/AlertProvider'
import { useQueryClient } from '@tanstack/react-query'
import Loading from '@/components/Loading/Loading'

export type ManageAccessDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    shareableType: 'file' | 'folder'
    shareableId: number
    shareableName: string
}

export default function ManageAccessDialog({
    open,
    onOpenChange,
    shareableType,
    shareableId,
    shareableName,
}: Readonly<ManageAccessDialogProps>) {
    const queryClient = useQueryClient()
    const { showAlert } = useAlert()

    // Fetch all shares to find the one for this file/folder
    const { data: sharesData, isLoading: isLoadingShares } = useListShares({ per_page: 100 })

    // Find the share for this specific file/folder
    // Note: API doesn't return shareable_id in list, so we match by name
    const shareItem = React.useMemo(() => {
        if (!sharesData?.data) return null
        return sharesData.data.find(
            share => share.shareable_type === shareableType && share.shareable_name === shareableName
        )
    }, [sharesData, shareableType, shareableName, shareableId])

    // Fetch share details if found
    const { data: shareDetail, isLoading: isLoadingDetail } = useShareDetail(shareItem?.share_id)

    const removeUserMutation = useRemoveShareUser()

    const handleRemoveUser = async (userId: number, userName: string) => {
        if (!shareItem?.share_id) return

        try {
            await removeUserMutation.mutateAsync({
                shareId: shareItem.share_id,
                userId,
            })
            showAlert({ type: 'success', message: `Đã xóa quyền truy cập của "${userName}"` })
            // Invalidate queries to refresh data
            await queryClient.invalidateQueries({ queryKey: ['shares'] })
            await queryClient.invalidateQueries({ queryKey: ['share-detail', shareItem.share_id] })
        } catch {
            showAlert({ type: 'error', message: `Không thể xóa quyền truy cập` })
        }
    }

    const isLoading = isLoadingShares || isLoadingDetail
    const hasAccess = shareDetail?.shared_with && shareDetail.shared_with.length > 0

    return (
        <Offcanvas
            id="manage-access-dialog"
            open={open}
            onOpenChange={onOpenChange}
            width="25"
            alignment="right"
            title="Manage access"
            closeButton={{ position: 'right' }}
        >
            <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {shareableType === 'file' ? 'File' : 'Folder'}: <strong>{shareableName}</strong>
                    </p>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loading size="lg" />
                    </div>
                )}

                {!isLoading && !shareItem && (
                    <div className="text-center py-8">
                        <UserCircleIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chưa chia sẻ với ai
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Sử dụng "Share" để chia sẻ {shareableType === 'file' ? 'file' : 'folder'} này
                        </p>
                    </div>
                )}

                {!isLoading && shareItem && !hasAccess && (
                    <div className="text-center py-8">
                        <UserCircleIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Không có người dùng nào có quyền truy cập
                        </p>
                    </div>
                )}

                {!isLoading && hasAccess && (
                    <div className="space-y-1">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            People with access ({shareDetail?.shared_with.length})
                        </h3>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {shareDetail?.shared_with.map(user => (
                                <li
                                    key={user.user_id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {user.permission}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveUser(user.user_id, user.name)}
                                        disabled={removeUserMutation.isPending}
                                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                                        title="Remove access"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {shareDetail?.shared_by && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Shared by: <span className="font-medium">{shareDetail.shared_by.name}</span>
                        </p>
                    </div>
                )}
            </div>
        </Offcanvas>
    )
}
