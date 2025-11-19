import { useQuery } from '@tanstack/react-query'
import { getReceivedShares, getShareDetail, listShares, type ListSharesParams, type ReceivedSharesParams } from './share.api'
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




