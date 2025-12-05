import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPublicLink, revokePublicLink, updatePublicLink } from './public-link.api'
import type {
  CreatePublicLinkRequest,
  CreatePublicLinkSuccess,
  UpdatePublicLinkRequest,
  UpdatePublicLinkSuccess,
  RevokePublicLinkSuccess,
} from './public-link.types'
import type { AppError } from '../../core/error'

export function useCreatePublicLink() {
  const queryClient = useQueryClient()
  return useMutation<CreatePublicLinkSuccess, AppError, CreatePublicLinkRequest>({
    mutationFn: createPublicLink,
    onSuccess: () => {
      // Invalidate all public-link related queries
      queryClient.invalidateQueries({ queryKey: ['public-links'] })
      queryClient.invalidateQueries({ queryKey: ['file-public-links'] })
    },
  })
}

export type UpdatePublicLinkVariables = {
  id: number
  permission?: string
  expired_at?: string | null
}

export function useUpdatePublicLink() {
  const queryClient = useQueryClient()
  return useMutation<UpdatePublicLinkSuccess, AppError, UpdatePublicLinkVariables>({
    mutationFn: variables =>
      updatePublicLink(variables.id, {
        permission: variables.permission,
        expired_at: variables.expired_at,
      } as UpdatePublicLinkRequest),
    onSuccess: () => {
      // Invalidate all public-link related queries
      queryClient.invalidateQueries({ queryKey: ['public-links'] })
      queryClient.invalidateQueries({ queryKey: ['file-public-links'] })
    },
  })
}

export type RevokePublicLinkVariables = {
  id: number
}

export function useRevokePublicLink() {
  const queryClient = useQueryClient()
  return useMutation<RevokePublicLinkSuccess, AppError, RevokePublicLinkVariables>({
    mutationFn: variables => revokePublicLink(variables.id),
    onSuccess: () => {
      // Invalidate all public-link related queries
      queryClient.invalidateQueries({ queryKey: ['public-links'] })
      queryClient.invalidateQueries({ queryKey: ['file-public-links'] })
    },
  })
}


