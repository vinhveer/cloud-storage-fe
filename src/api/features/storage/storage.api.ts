import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { StorageOverviewEnvelopeSchema } from './storage.schemas'
import type { StorageOverviewEnvelope, StorageOverviewSuccess } from './storage.types'

const storageOverviewEnvelope = StorageOverviewEnvelopeSchema

export async function getAdminStorageOverview(): Promise<StorageOverviewSuccess> {
  const response = await get<unknown>('/api/admin/storage/overview')
  const parsed = parseWithZod<StorageOverviewEnvelope>(storageOverviewEnvelope, response)
  return parsed.data
}


