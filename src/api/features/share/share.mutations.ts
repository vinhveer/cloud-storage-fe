import { useMutation } from '@tanstack/react-query'
import { createShare, deleteShare, removeShareUser } from './share.api'
import type { CreateShareRequest, CreateShareSuccess, DeleteShareSuccess, RemoveShareUserSuccess } from './share.types'
import type { AppError } from '../../core/error'

export function useCreateShare() {
  return useMutation<CreateShareSuccess, AppError, CreateShareRequest>({
    mutationFn: createShare,
  })
}

export type DeleteShareVariables = {
  id: number
}

export function useDeleteShare() {
  return useMutation<DeleteShareSuccess, AppError, DeleteShareVariables>({
    mutationFn: variables => deleteShare(variables.id),
  })
}

export type RemoveShareUserVariables = {
  shareId: number
  userId: number
}

export function useRemoveShareUser() {
  return useMutation<RemoveShareUserSuccess, AppError, RemoveShareUserVariables>({
    mutationFn: variables => removeShareUser(variables.shareId, variables.userId),
  })
}

