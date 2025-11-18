import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const UploadedFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  file_extension: z.string(),
  folder_id: z.number().nullable(),
  user_id: z.number(),
  created_at: z.string(),
})

export const UploadFileSuccessSchema = z.object({
  message: z.string(),
  file: UploadedFileSchema,
})

export const UploadFileEnvelopeSchema = createApiResponseSchema(UploadFileSuccessSchema)

export const UploadFileRequestSchema = z.object({
  file: z.instanceof(File),
  folderId: z.number().optional(),
})

export const MoveFileRequestSchema = z.object({
  destination_folder_id: z.number().optional(),
})

export const MovedFileSchema = z.object({
  file_id: z.number(),
  folder_id: z.number().nullable(),
})

export const MoveFileSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  file: MovedFileSchema,
})

export const MoveFileEnvelopeSchema = createApiResponseSchema(MoveFileSuccessSchema)

export const FileListItemSchema = UploadedFileSchema.extend({
  is_deleted: z.boolean(),
})

export const FileListPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ListFilesSuccessSchema = z.object({
  data: z.array(FileListItemSchema),
  pagination: FileListPaginationSchema,
})

export const ListFilesEnvelopeSchema = createApiResponseSchema(ListFilesSuccessSchema)

export const FileDetailSchema = FileListItemSchema.extend({
  created_at: z.string(),
  last_opened_at: z.string().nullable(),
})

export const FileDetailEnvelopeSchema = createApiResponseSchema(FileDetailSchema)

export const UpdateFileRequestSchema = z.object({
  display_name: z.string().optional(),
  folder_id: z.number().optional(),
})

export const UpdatedFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  folder_id: z.number().nullable(),
})

export const UpdateFileSuccessSchema = z.object({
  message: z.string(),
  file: UpdatedFileSchema,
})

export const UpdateFileEnvelopeSchema = createApiResponseSchema(UpdateFileSuccessSchema)

export const DeleteFileSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
})

export const DeleteFileEnvelopeSchema = createApiResponseSchema(DeleteFileSuccessSchema)

export const CopyFileRequestSchema = z.object({
  destination_folder_id: z.number().nullable().optional(),
  only_latest: z.boolean().optional(),
})

export const CopiedFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  folder_id: z.number().nullable(),
})

export const CopyFileSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  new_file: CopiedFileSchema,
})

export const CopyFileEnvelopeSchema = createApiResponseSchema(CopyFileSuccessSchema)

export const RecentFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  last_opened_at: z.string(),
})

export const RecentFilesSuccessSchema = z.object({
  data: z.array(RecentFileSchema),
})

export const RecentFilesEnvelopeSchema = createApiResponseSchema(RecentFilesSuccessSchema)

export const FilePreviewFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
})

export const FilePreviewSuccessSchema = z.object({
  message: z.string(),
  file: FilePreviewFileSchema,
  preview_url: z.string(),
  expires_in: z.number(),
})

export const FilePreviewEnvelopeSchema = createApiResponseSchema(FilePreviewSuccessSchema)

export const DeleteFileVersionSuccessSchema = z.object({
  message: z.string(),
})

export const DeleteFileVersionEnvelopeSchema = createApiResponseSchema(DeleteFileVersionSuccessSchema)


