import { useMutation } from '@tanstack/react-query'
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
  return useMutation<CreatePublicLinkSuccess, AppError, CreatePublicLinkRequest>({
    mutationFn: createPublicLink,
  })
}

export type UpdatePublicLinkVariables = {
  id: number
  permission?: string
  expired_at?: string | null
}

export function useUpdatePublicLink() {
  return useMutation<UpdatePublicLinkSuccess, AppError, UpdatePublicLinkVariables>({
    mutationFn: variables =>
      updatePublicLink(variables.id, {
        permission: variables.permission,
        expired_at: variables.expired_at,
      } as UpdatePublicLinkRequest),
  })
}

export type RevokePublicLinkVariables = {
  id: number
}

export function useRevokePublicLink() {
  return useMutation<RevokePublicLinkSuccess, AppError, RevokePublicLinkVariables>({
    mutationFn: variables => revokePublicLink(variables.id),
  })
}


