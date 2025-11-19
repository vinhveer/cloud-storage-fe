import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { StorageBreakdownSchema, StorageLimitSchema } from './storage.schemas'
import type { StorageBreakdown, StorageLimit } from './storage.types'

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


