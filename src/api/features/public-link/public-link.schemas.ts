import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

export const PublicLinkSchema = z.object({
  public_link_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  permission: z.string(),
  token: z.string(),
  url: z.string(),
  expired_at: z.string().nullable(),
  created_at: z.string(),
})

export const CreatePublicLinkRequestSchema = z.object({
  shareable_type: z.enum(['file', 'folder']),
  shareable_id: z.union([z.string(), z.number()]),
  permission: z.string(),
  expired_at: z.string().nullable().optional(),
})

export const CreatePublicLinkSuccessSchema = z.object({
  message: z.string(),
  public_link: PublicLinkSchema,
})

export const CreatePublicLinkEnvelopeSchema = createApiResponseSchema(CreatePublicLinkSuccessSchema)

export const PublicLinkListItemSchema = z.object({
  public_link_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  shareable_name: z.string(),
  permission: z.string(),
  token: z.string(),
  url: z.string(),
  expired_at: z.string().nullable(),
  revoked_at: z.string().nullable(),
  created_at: z.string(),
})

export const PublicLinkListPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ListPublicLinksSuccessSchema = z.object({
  data: z.array(PublicLinkListItemSchema),
  pagination: PublicLinkListPaginationSchema,
})

export const ListPublicLinksEnvelopeSchema = createApiResponseSchema(ListPublicLinksSuccessSchema)

export const PublicLinkOwnerSchema = z.object({
  user_id: z.number(),
  name: z.string(),
})

export const PublicLinkDetailSchema = z.object({
  public_link_id: z.number(),
  shareable_type: z.enum(['file', 'folder']),
  shareable_id: z.number().optional(),
  shareable_name: z.string(),
  permission: z.string(),
  token: z.string(),
  expired_at: z.string().nullable(),
  revoked_at: z.string().nullable(),
  created_at: z.string(),
  owner: PublicLinkOwnerSchema,
})

export const PublicLinkDetailEnvelopeSchema = createApiResponseSchema(PublicLinkDetailSchema)

export const UpdatePublicLinkRequestSchema = z.object({
  permission: z.string().optional(),
  expired_at: z.string().nullable().optional(),
})

export const UpdatedPublicLinkSchema = z.object({
  public_link_id: z.number(),
  permission: z.string(),
  expired_at: z.string().nullable(),
})

export const UpdatePublicLinkSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  public_link: UpdatedPublicLinkSchema,
})

export const UpdatePublicLinkEnvelopeSchema = createApiResponseSchema(UpdatePublicLinkSuccessSchema)

export const PublicLinkPreviewFileSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  mime_type: z.string(),
  size: z.number(),
  url: z.string(),
})

export const PublicLinkPreviewFolderStatsSchema = z.object({
  total_files: z.number(),
  total_folders: z.number(),
  total_size: z.number(),
  total_size_formatted: z.string(),
})

export const PublicLinkPreviewFolderItemSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const PublicLinkPreviewFileItemSchema = z.object({
  file_id: z.number(),
  display_name: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  file_extension: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  last_opened_at: z.string().nullable(),
})

export const PublicLinkPreviewFolderContentsSchema = z.object({
  folders: z.array(PublicLinkPreviewFolderItemSchema),
  files: z.array(PublicLinkPreviewFileItemSchema),
})

export const PublicLinkPreviewFolderSchema = z.object({
  folder_id: z.number(),
  folder_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const PublicLinkFolderPreviewDataSchema = z.object({
  shareable_type: z.literal('folder'),
  folder: PublicLinkPreviewFolderSchema,
  stats: PublicLinkPreviewFolderStatsSchema,
  contents: PublicLinkPreviewFolderContentsSchema,
  token: z.string(),
})

export const PublicLinkFolderPreviewEnvelopeSchema = createApiResponseSchema(PublicLinkFolderPreviewDataSchema)

export const PublicLinkPreviewDataSchema = z.object({
  shareable_type: z.literal('file'),
  file: PublicLinkPreviewFileSchema,
})

export const PublicLinkPreviewEnvelopeSchema = createApiResponseSchema(PublicLinkPreviewDataSchema)

export const PublicLinkDownloadDataSchema = z.object({
  success: z.literal(true),
  shareable_type: z.enum(['file', 'folder']).optional(),
  download_url: z.string(),
  name: z.string().optional(),
})

export const PublicLinkDownloadEnvelopeSchema = createApiResponseSchema(PublicLinkDownloadDataSchema)

export const RevokePublicLinkSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string(),
})

export const RevokePublicLinkEnvelopeSchema = createApiResponseSchema(RevokePublicLinkSuccessSchema)

export const FilePublicLinkItemSchema = z.object({
  public_link_id: z.number(),
  permission: z.string(),
  token: z.string(),
  url: z.string(),
  expired_at: z.string().nullable(),
  revoked_at: z.string().nullable(),
})

export const FilePublicLinksDataSchema = z.object({
  file_id: z.number(),
  file_name: z.string(),
  public_links: z.array(FilePublicLinkItemSchema),
})

export const FilePublicLinksEnvelopeSchema = createApiResponseSchema(FilePublicLinksDataSchema)


