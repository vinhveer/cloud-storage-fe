import { deleteRequest } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { AdminUserDeleteEnvelopeSchema } from './admin-user-delete.schemas'
import type { AdminUserDeleteEnvelope, AdminUserDeleteSuccess } from './admin-user-delete.types'

const deleteEnvelope = AdminUserDeleteEnvelopeSchema

export async function deleteAdminUser(userId: number): Promise<AdminUserDeleteSuccess> {
  const response = await deleteRequest<unknown>(`/api/admin/users/${userId}`)
  const parsed = parseWithZod<AdminUserDeleteEnvelope>(deleteEnvelope, response)
  return parsed.data
}


