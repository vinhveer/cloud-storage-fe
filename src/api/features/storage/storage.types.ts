import { z } from 'zod'
import { StorageBreakdownItemSchema, StorageBreakdownSchema, StorageLimitSchema } from './storage.schemas'

export type StorageBreakdownItem = z.infer<typeof StorageBreakdownItemSchema>
export type StorageBreakdown = z.infer<typeof StorageBreakdownSchema>
export type StorageLimit = z.infer<typeof StorageLimitSchema>


