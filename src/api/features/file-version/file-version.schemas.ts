import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const FileVersionSchema = z.object({
  version_id: z.number(),
  file_id: z.number(),
  user_id: z.number(),
  version_number: z.number(),
  uuid: z.string(),
  file_extension: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
  action: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
})

export const UploadFileVersionSuccessSchema = z.object({
  message: z.string(),
  version: FileVersionSchema,
})

export const UploadFileVersionEnvelopeSchema = createApiResponseSchema(UploadFileVersionSuccessSchema)

export const UploadFileVersionRequestSchema = z.object({
  action: z.string(),
  notes: z.string().optional(),
  file: z.instanceof(File),
})

export const FileVersionListItemSchema = z.object({
  version_id: z.number(),
  version_number: z.number(),
  action: z.string(),
  notes: z.string().nullable(),
  file_size: z.number(),
  created_at: z.string(),
})

export const FileVersionListPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ListFileVersionsSuccessSchema = z.object({
  data: z.array(FileVersionListItemSchema),
  pagination: FileVersionListPaginationSchema,
})

export const ListFileVersionsEnvelopeSchema = createApiResponseSchema(ListFileVersionsSuccessSchema)

export const FileVersionUploadedBySchema = z.object({
  user_id: z.number(),
  name: z.string(),
})

export const FileVersionDetailSchema = z.object({
  version_id: z.number(),
  file_id: z.number(),
  version_number: z.number(),
  uuid: z.string(),
  file_extension: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
  action: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
  uploaded_by: FileVersionUploadedBySchema,
})

export const FileVersionDetailEnvelopeSchema = createApiResponseSchema(FileVersionDetailSchema)

export const RestoredFileVersionSchema = z.object({
  version_id: z.number(),
  version_number: z.number(),
  action: z.string(),
  restored_at: z.string(),
})

export const RestoreFileVersionSuccessSchema = z.object({
  message: z.string(),
  restored_to_version: RestoredFileVersionSchema,
})

export const RestoreFileVersionEnvelopeSchema = createApiResponseSchema(RestoreFileVersionSuccessSchema)

