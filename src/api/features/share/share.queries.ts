import { useQuery } from '@tanstack/react-query'
import { getReceivedShares, getShareByResource, getShareDetail, listShares, type GetShareByResourceParams, type ListSharesParams, type ReceivedSharesParams } from './share.api'
import type { ListSharesSuccess, ReceivedSharesSuccess, ShareDetail } from './share.types'
import type { AppError } from '../../core/error'

export function useListShares(params: ListSharesParams) {
  return useQuery<ListSharesSuccess, AppError>({
    queryKey: ['shares', params],
    queryFn: () => listShares(params),
  })
}

export function useShareDetail(shareId: number | undefined) {
  return useQuery<ShareDetail, AppError>({
    queryKey: ['share-detail', shareId],
    enabled: shareId !== undefined,
    queryFn: () => {
      if (shareId === undefined) {
        throw new Error('shareId is required')
      }
      return getShareDetail(shareId)
    },
  })
}

export function useReceivedShares(params: ReceivedSharesParams) {
  return useQuery<ReceivedSharesSuccess, AppError>({
    queryKey: ['shares-received', params],
    queryFn: () => getReceivedShares(params),
  })
}

/**
 * Hook to get share info for a specific resource (file/folder).
 * Returns ShareDetail if share exists, null if not found.
 */
export function useShareByResource(params: GetShareByResourceParams | null) {
  return useQuery<ShareDetail | null, AppError>({
    queryKey: ['share-by-resource', params?.shareable_type, params?.shareable_id],
    enabled: params !== null && params.shareable_id > 0,
    queryFn: () => {
      if (!params) {
        return Promise.resolve(null)
      }
      return getShareByResource(params)
    },
  })
}
