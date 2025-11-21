import { z } from 'zod'
import {
  StorageUserItemSchema,
  StorageUsersEnvelopeSchema,
  StorageUsersPaginationSchema,
  StorageUsersSuccessSchema,
} from './storage-users.schemas'

export type StorageUserItem = z.infer<typeof StorageUserItemSchema>
export type StorageUsersPagination = z.infer<typeof StorageUsersPaginationSchema>
export type StorageUsersSuccess = z.infer<typeof StorageUsersSuccessSchema>
export type StorageUsersEnvelope = z.infer<typeof StorageUsersEnvelopeSchema>

export type StorageUsersListParams = {
  search?: string
  page?: number
  per_page?: number
}


