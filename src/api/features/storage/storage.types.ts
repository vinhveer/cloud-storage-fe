import { z } from 'zod'
import {
    StorageBreakdownItemSchema,
    StorageBreakdownSchema,
    StorageLimitSchema,
    StorageUserItemSchema,
    StorageUsersEnvelopeSchema,
    StorageUsersPaginationSchema,
    StorageUsersSuccessSchema,
} from './storage.schemas'

export type StorageBreakdownItem = z.infer<typeof StorageBreakdownItemSchema>
export type StorageBreakdown = z.infer<typeof StorageBreakdownSchema>
export type StorageLimit = z.infer<typeof StorageLimitSchema>

// Admin storage users
export type StorageUserItem = z.infer<typeof StorageUserItemSchema>
export type StorageUsersPagination = z.infer<typeof StorageUsersPaginationSchema>
export type StorageUsersSuccess = z.infer<typeof StorageUsersSuccessSchema>
export type StorageUsersEnvelope = z.infer<typeof StorageUsersEnvelopeSchema>

export type StorageUsersListParams = {
    search?: string
    page?: number
    per_page?: number
}
