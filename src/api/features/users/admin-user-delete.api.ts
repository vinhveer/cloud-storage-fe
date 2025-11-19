import { deleteRequest } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { AdminUserDeleteResponseSchema, AdminUserDeleteSuccessSchema } from './admin-user-delete.schemas'
import type { AdminUserDeleteResponse, AdminUserDeleteSuccess } from './admin-user-delete.types'

const deleteResponseSchema = AdminUserDeleteResponseSchema

export async function deleteAdminUser(userId: number): Promise<AdminUserDeleteSuccess> {
  const response = await deleteRequest<unknown>(`/api/admin/users/${userId}`)
  const parsed = parseWithZod<AdminUserDeleteResponse>(deleteResponseSchema, response)

  // Envelope success shape
  if (parsed && typeof parsed === 'object' && 'data' in parsed) {
    const dataObj = (parsed as { data: unknown }).data
    return parseWithZod(AdminUserDeleteSuccessSchema, dataObj)
  }

  // Raw success shape
  return parseWithZod(AdminUserDeleteSuccessSchema, parsed)
}


