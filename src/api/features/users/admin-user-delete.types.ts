import { z } from 'zod'
import { AdminUserDeleteSuccessSchema, AdminUserDeleteResponseSchema } from './admin-user-delete.schemas'

export type AdminUserDeleteSuccess = z.infer<typeof AdminUserDeleteSuccessSchema>
export type AdminUserDeleteResponse = z.infer<typeof AdminUserDeleteResponseSchema>


