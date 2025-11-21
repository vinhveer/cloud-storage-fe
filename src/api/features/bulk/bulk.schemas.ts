import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const BulkCopyRequestSchema = z.object({
  file_ids: z.array(z.number()).optional(),
  folder_ids: z.array(z.number()).optional(),
  destination_folder_id: z.number().nullable().optional(),
})

export const BulkCopyResultItemSchema = z.object({
  original_id: z.number(),
  new_id: z.number(),
})

export const BulkCopyResultSchema = z.object({
  files: z.array(BulkCopyResultItemSchema),
  folders: z.array(BulkCopyResultItemSchema),
})

export const BulkCopySuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  copied: BulkCopyResultSchema,
})

export const BulkCopyEnvelopeSchema = createApiResponseSchema(BulkCopySuccessSchema)

export const BulkDeleteRequestSchema = z.object({
  file_ids: z.array(z.number()).optional(),
  folder_ids: z.array(z.number()).optional(),
})

export const BulkDeleteResultSchema = z.object({
  files: z.array(z.number()),
  folders: z.array(z.number()),
})

export const BulkDeleteFileResultSchema = z.object({
  requested: z.array(z.number()),
  found: z.array(z.number()),
  not_found: z.array(z.number()),
  not_owned: z.array(z.number()),
  already_deleted: z.array(z.number()),
  deleted: z.array(z.number()),
})

export const BulkDeleteFolderResultSchema = z.object({
  requested: z.array(z.number()),
  found: z.array(z.number()),
  not_found: z.array(z.number()),
  not_owned: z.array(z.number()),
  already_deleted: z.array(z.number()),
  deleted_folders: z.array(z.number()),
  deleted_files: z.array(z.number()),
})

export const BulkDeleteDetailsSchema = z.object({
  file_result: BulkDeleteFileResultSchema,
  folder_result: BulkDeleteFolderResultSchema,
})

export const BulkDeleteSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  deleted: BulkDeleteResultSchema,
  details: BulkDeleteDetailsSchema,
})

export const BulkDeleteEnvelopeSchema = createApiResponseSchema(BulkDeleteSuccessSchema)

export const BulkMoveRequestSchema = z.object({
  file_ids: z.array(z.number()).optional(),
  folder_ids: z.array(z.number()).optional(),
  destination_folder_id: z.number(),
})

export const BulkMoveResultSchema = z.object({
  files: z.array(z.number()),
  folders: z.array(z.number()),
})

export const BulkMoveSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  moved: BulkMoveResultSchema,
  destination_folder_id: z.number(),
})

export const BulkMoveEnvelopeSchema = createApiResponseSchema(BulkMoveSuccessSchema)


