import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import {
  StorageBreakdownSchema,
  StorageLimitSchema,
  StorageUsersEnvelopeSchema,
} from './storage.schemas'
import type {
  StorageBreakdown,
  StorageLimit,
  StorageUsersEnvelope,
  StorageUsersListParams,
  StorageUsersSuccess,
} from './storage.types'

export type StorageBreakdownParams = {
  by?: 'extension' | 'mime'
}

export async function getStorageBreakdown(params: StorageBreakdownParams = {}): Promise<StorageBreakdown> {
  const response = await get<unknown>('/api/storage/breakdown', {
    params: {
      by: params.by,
    },
  })
  const parsed = parseWithZod<StorageBreakdown>(StorageBreakdownSchema, response)
  return parsed
}

export async function getStorageLimit(): Promise<StorageLimit> {
  const response = await get<unknown>('/api/storage/limit')
  const parsed = parseWithZod<StorageLimit>(StorageLimitSchema, response)
  return parsed
}

// Admin storage users
const storageUsersEnvelope = StorageUsersEnvelopeSchema

export async function getAdminStorageUsers(
  params: StorageUsersListParams = {},
): Promise<StorageUsersSuccess> {
  const response = await get<unknown>('/api/admin/storage/users', {
    params: {
      search: params.search,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<StorageUsersEnvelope>(storageUsersEnvelope, response)
  return parsed.data
}
