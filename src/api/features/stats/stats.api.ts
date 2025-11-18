import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { FileStatsEnvelopeSchema, UserStatsEnvelopeSchema } from './stats.schemas'
import type {
  FileStatsEnvelope,
  FileStatsSuccess,
  StorageStatsEnvelope,
  StorageStatsParams,
  StorageStatsSuccess,
  UserStatsEnvelope,
  UserStatsSuccess,
} from './stats.types'
import { StorageStatsEnvelopeSchema } from './stats.schemas'

const userStatsEnvelope = UserStatsEnvelopeSchema
const fileStatsEnvelope = FileStatsEnvelopeSchema
const storageStatsEnvelope = StorageStatsEnvelopeSchema

export async function getAdminUserStats(): Promise<UserStatsSuccess> {
  const response = await get<unknown>('/api/admin/stats/users')
  const parsed = parseWithZod<UserStatsEnvelope>(userStatsEnvelope, response)
  return parsed.data
}

export async function getAdminFileStats(): Promise<FileStatsSuccess> {
  const response = await get<unknown>('/api/admin/stats/files')
  const parsed = parseWithZod<FileStatsEnvelope>(fileStatsEnvelope, response)
  return parsed.data
}

export async function getAdminStorageStats(params: StorageStatsParams = {}): Promise<StorageStatsSuccess> {
  const response = await get<unknown>('/api/admin/stats/storage', {
    params: {
      start_date: params.start_date,
      end_date: params.end_date,
    },
  })
  const parsed = parseWithZod<StorageStatsEnvelope>(storageStatsEnvelope, response)
  return parsed.data
}


