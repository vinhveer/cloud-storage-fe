import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const FolderSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
  fol_folder_id: z.number().nullable(),
  user_id: z.number(),
  created_at: z.string(),
})

export const FolderDetailSchema = FolderSchema.extend({
  is_deleted: z.boolean(),
  deleted_at: z.string().nullable(),
})

export const FolderDetailEnvelopeSchema = createApiResponseSchema(FolderDetailSchema)

export const CreateFolderSuccessSchema = z.object({
  message: z.string(),
  folder: FolderSchema,
})

export const CreateFolderEnvelopeSchema = createApiResponseSchema(CreateFolderSuccessSchema)

export const CreateFolderRequestSchema = z.object({
  folder_name: z.string(),
  parent_folder_id: z.number().optional(),
})

export const UpdateFolderRequestSchema = z.object({
  folder_name: z.string(),
})

export const UpdatedFolderSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
})

export const UpdateFolderSuccessSchema = z.object({
  message: z.string(),
  folder: UpdatedFolderSchema,
})

export const UpdateFolderEnvelopeSchema = createApiResponseSchema(UpdateFolderSuccessSchema)

export const MoveFolderRequestSchema = z.object({
  target_folder_id: z.number().nullable().optional(),
})

export const MoveFolderSuccessSchema = z.object({
  message: z.string(),
})

export const MoveFolderEnvelopeSchema = createApiResponseSchema(MoveFolderSuccessSchema)

export type FolderTreeNode = {
  folder_id: number
  folder_name: string
  children: FolderTreeNode[]
}

export const FolderTreeNodeSchema: z.ZodType<FolderTreeNode> = z.lazy(() =>
  z.object({
    folder_id: z.number(),
    folder_name: z.string(),
    children: z.array(FolderTreeNodeSchema),
  }),
)

export const FolderTreeSuccessSchema = z.object({
  folders: z.array(FolderTreeNodeSchema),
})

export const FolderTreeEnvelopeSchema = createApiResponseSchema(FolderTreeSuccessSchema)

export const FolderBreadcrumbItemSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
})

export const FolderBreadcrumbSuccessSchema = z.object({
  breadcrumb: z.array(FolderBreadcrumbItemSchema),
})

export const FolderBreadcrumbEnvelopeSchema = createApiResponseSchema(FolderBreadcrumbSuccessSchema)

export const FolderListItemSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
  fol_folder_id: z.number().nullable(),
  created_at: z.string(),
})

export const FolderListPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ListFoldersSuccessSchema = z.object({
  data: z.array(FolderListItemSchema),
  pagination: FolderListPaginationSchema,
})

export const ListFoldersEnvelopeSchema = createApiResponseSchema(ListFoldersSuccessSchema)

export const FolderContentsFolderSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
  created_at: z.string(),
})

export const FolderContentsFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  file_extension: z.string(),
  last_opened_at: z.string().nullable(),
})

export const FolderContentsSuccessSchema = z.object({
  folders: z.array(FolderContentsFolderSchema),
  files: z.array(FolderContentsFileSchema),
})

export const FolderContentsEnvelopeSchema = createApiResponseSchema(FolderContentsSuccessSchema)

export const DeleteFolderSuccessSchema = z.object({
  message: z.string(),
})

export const DeleteFolderEnvelopeSchema = createApiResponseSchema(DeleteFolderSuccessSchema)

export const CopyFolderRequestSchema = z.object({
  target_folder_id: z.number().nullable().optional(),
})

export const CopyFolderSuccessSchema = z.object({
  message: z.string(),
  new_folder_id: z.number(),
})

export const CopyFolderEnvelopeSchema = createApiResponseSchema(CopyFolderSuccessSchema)


