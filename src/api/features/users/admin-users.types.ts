import { z } from 'zod'
import {
  AdminUserItemSchema,
  AdminUsersEnvelopeSchema,
  AdminUsersPaginationSchema,
  AdminUsersResponseSchema,
  AdminUsersSuccessSchema,
} from './admin-users.schemas'

export type AdminUserItem = z.infer<typeof AdminUserItemSchema>
export type AdminUsersPagination = z.infer<typeof AdminUsersPaginationSchema>
export type AdminUsersSuccess = z.infer<typeof AdminUsersSuccessSchema>
export type AdminUsersEnvelope = z.infer<typeof AdminUsersEnvelopeSchema>
export type AdminUsersResponse = z.infer<typeof AdminUsersResponseSchema>

export type AdminUsersListParams = {
  search?: string
  page?: number
  per_page?: number
}


