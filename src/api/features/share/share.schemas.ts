import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const ShareRecipientSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  permission: z.string(),
})

export const ShareSchema = z.object({
  share_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  shareable_id: z.number(),
  user_id: z.number(),
  created_at: z.string(),
  shared_with: z.array(ShareRecipientSchema),
})

export const CreateShareRequestSchema = z.object({
  shareable_type: z.enum(['file', 'folder']),
  shareable_id: z.number(),
  user_ids: z.array(z.number()),
  permission: z.string(),
})

export const CreateShareSuccessSchema = z.object({
  share: ShareSchema,
  share_created: z.boolean(),
  added_user_ids: z.array(z.number()),
  updated_user_ids: z.array(z.number()),
  skipped_user_ids: z.array(z.number()),
})

export const CreateShareEnvelopeSchema = createApiResponseSchema(CreateShareSuccessSchema)

export const ShareListItemSchema = z.object({
  share_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  shareable_name: z.string(),
  shared_with_count: z.number(),
  created_at: z.string(),
})

export const ShareListPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ListSharesSuccessSchema = z.object({
  data: z.array(ShareListItemSchema),
  pagination: ShareListPaginationSchema,
})

export const ListSharesEnvelopeSchema = createApiResponseSchema(ListSharesSuccessSchema)

export const ShareDetailOwnerSchema = z.object({
  user_id: z.number(),
  name: z.string(),
})

export const ShareDetailRecipientSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  permission: z.string(),
})

export const ShareDetailSchema = z.object({
  share_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  shareable_name: z.string(),
  created_at: z.string(),
  shared_by: ShareDetailOwnerSchema,
  shared_with: z.array(ShareDetailRecipientSchema),
})

export const DeleteShareSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
})

export const ReceivedShareOwnerSchema = z.object({
  user_id: z.number(),
  name: z.string(),
})

export const ReceivedShareItemSchema = z.object({
  share_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  shareable_name: z.string(),
  owner: ReceivedShareOwnerSchema,
  permission: z.string(),
  shared_at: z.string(),
})

export const ReceivedSharesPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ReceivedSharesSuccessSchema = z.object({
  data: z.array(ReceivedShareItemSchema),
  pagination: ReceivedSharesPaginationSchema,
})


