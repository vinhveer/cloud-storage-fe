import { z } from 'zod'
import {
  AdminUserStorageUsageEnvelopeSchema,
  AdminUserStorageUsageResponseSchema,
  AdminUserStorageUsageSchema,
} from './admin-user-storage-usage.schemas'

export type AdminUserStorageUsage = z.infer<typeof AdminUserStorageUsageSchema>
export type AdminUserStorageUsageEnvelope = z.infer<typeof AdminUserStorageUsageEnvelopeSchema>
export type AdminUserStorageUsageResponse = z.infer<typeof AdminUserStorageUsageResponseSchema>


