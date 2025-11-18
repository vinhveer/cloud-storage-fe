import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { StorageUsersEnvelopeSchema } from './storage-users.schemas'
import type { StorageUsersEnvelope, StorageUsersListParams, StorageUsersSuccess } from './storage-users.types'

const storageUsersEnvelope = StorageUsersEnvelopeSchema

export async function getAdminStorageUsers(params: StorageUsersListParams = {}): Promise<StorageUsersSuccess> {
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


