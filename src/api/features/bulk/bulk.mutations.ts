import { useMutation } from '@tanstack/react-query'
import { bulkCopy, bulkDelete, bulkMove } from './bulk.api'
import type {
  BulkCopyRequest,
  BulkCopySuccess,
  BulkDeleteRequest,
  BulkDeleteSuccess,
  BulkMoveRequest,
  BulkMoveSuccess,
} from './bulk.types'
import type { AppError } from '../../core/error'

export function useBulkCopy() {
  return useMutation<BulkCopySuccess, AppError, BulkCopyRequest>({
    mutationFn: bulkCopy,
  })
}

export function useBulkDelete() {
  return useMutation<BulkDeleteSuccess, AppError, BulkDeleteRequest>({
    mutationFn: bulkDelete,
  })
}

export function useBulkMove() {
  return useMutation<BulkMoveSuccess, AppError, BulkMoveRequest>({
    mutationFn: bulkMove,
  })
}


