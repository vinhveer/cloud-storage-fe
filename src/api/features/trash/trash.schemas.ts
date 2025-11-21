import { z } from 'zod'

export const TrashItemSchema = z.object({
  id: z.number(),
  type: z.enum(['file', 'folder']),
  title: z.string().min(0),
  deleted_at: z.string(),
  file_size: z.number().nullable(),
  mime_type: z.string().nullable(),
  file_extension: z.string().nullable(),
  parent_id: z.number().nullable(),
})

export const TrashPaginationSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const TrashListDataSchema = z.object({
  items: z.array(TrashItemSchema),
  pagination: TrashPaginationSchema,
})

export const TrashListEnvelopeSchema = z.object({
  success: z.boolean(),
  data: TrashListDataSchema,
  error: z.unknown().nullable().optional(),
  meta: z.unknown().nullable().optional(),
})

export const TrashFolderContentsPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const TrashFolderItemSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
  deleted_at: z.string(),
})

export const TrashFileItemSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  file_extension: z.string(),
  deleted_at: z.string(),
})

export const TrashFolderContentsDataSchema = z.object({
  folders: z.array(TrashFolderItemSchema),
  folders_pagination: TrashFolderContentsPaginationSchema,
  files: z.array(TrashFileItemSchema),
  files_pagination: TrashFolderContentsPaginationSchema,
})

export const RestoreTrashItemRequestSchema = z.object({
  type: z.enum(['file', 'folder']),
})

export const RestoredItemSchema = z.object({
  id: z.number(),
  type: z.enum(['file', 'folder']),
  display_name: z.string(),
})

export const RestoreTrashItemSuccessSchema = z.object({
  message: z.string(),
  restored_item: RestoredItemSchema,
})

export const DeleteTrashItemRequestSchema = z.object({
  type: z.enum(['file', 'folder']),
})

export const DeleteTrashItemSuccessSchema = z.object({
  message: z.string(),
})

export const EmptyTrashDeletedCountSchema = z.object({
  files: z.number(),
  folders: z.number(),
})

export const EmptyTrashSuccessSchema = z.object({
  message: z.string(),
  deleted_count: EmptyTrashDeletedCountSchema,
})

export default TrashListEnvelopeSchema
