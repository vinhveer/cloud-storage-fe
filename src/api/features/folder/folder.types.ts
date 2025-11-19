import { z } from 'zod'
import {
  CreateFolderEnvelopeSchema,
  CreateFolderRequestSchema,
  CreateFolderSuccessSchema,
  DeleteFolderEnvelopeSchema,
  DeleteFolderSuccessSchema,
  CopyFolderEnvelopeSchema,
  CopyFolderRequestSchema,
  CopyFolderSuccessSchema,
  UpdateFolderEnvelopeSchema,
  UpdateFolderRequestSchema,
  UpdateFolderSuccessSchema,
  FolderSchema,
  FolderDetailEnvelopeSchema,
  FolderDetailSchema,
  FolderTreeEnvelopeSchema,
  FolderTreeNodeSchema,
  FolderTreeSuccessSchema,
  FolderBreadcrumbEnvelopeSchema,
  FolderBreadcrumbItemSchema,
  FolderBreadcrumbSuccessSchema,
  FolderListItemSchema,
  FolderListPaginationSchema,
  ListFoldersEnvelopeSchema,
  ListFoldersSuccessSchema,
  MoveFolderEnvelopeSchema,
  MoveFolderRequestSchema,
  MoveFolderSuccessSchema,
} from './folder.schemas'

export type Folder = z.infer<typeof FolderSchema>
export type FolderDetail = z.infer<typeof FolderDetailSchema>
export type FolderDetailEnvelope = z.infer<typeof FolderDetailEnvelopeSchema>
export type CreateFolderSuccess = z.infer<typeof CreateFolderSuccessSchema>
export type CreateFolderEnvelope = z.infer<typeof CreateFolderEnvelopeSchema>
export type CreateFolderRequest = z.infer<typeof CreateFolderRequestSchema>

export type DeleteFolderSuccess = z.infer<typeof DeleteFolderSuccessSchema>
export type DeleteFolderEnvelope = z.infer<typeof DeleteFolderEnvelopeSchema>

export type CopyFolderRequest = z.infer<typeof CopyFolderRequestSchema>
export type CopyFolderSuccess = z.infer<typeof CopyFolderSuccessSchema>
export type CopyFolderEnvelope = z.infer<typeof CopyFolderEnvelopeSchema>

export type UpdateFolderRequest = z.infer<typeof UpdateFolderRequestSchema>
export type UpdateFolderSuccess = z.infer<typeof UpdateFolderSuccessSchema>
export type UpdateFolderEnvelope = z.infer<typeof UpdateFolderEnvelopeSchema>

export type MoveFolderRequest = z.infer<typeof MoveFolderRequestSchema>
export type MoveFolderSuccess = z.infer<typeof MoveFolderSuccessSchema>
export type MoveFolderEnvelope = z.infer<typeof MoveFolderEnvelopeSchema>

export type FolderTreeNode = z.infer<typeof FolderTreeNodeSchema>
export type FolderTreeSuccess = z.infer<typeof FolderTreeSuccessSchema>
export type FolderTreeEnvelope = z.infer<typeof FolderTreeEnvelopeSchema>

export type FolderBreadcrumbItem = z.infer<typeof FolderBreadcrumbItemSchema>
export type FolderBreadcrumbSuccess = z.infer<typeof FolderBreadcrumbSuccessSchema>
export type FolderBreadcrumbEnvelope = z.infer<typeof FolderBreadcrumbEnvelopeSchema>

export type FolderListItem = z.infer<typeof FolderListItemSchema>
export type FolderListPagination = z.infer<typeof FolderListPaginationSchema>
export type ListFoldersSuccess = z.infer<typeof ListFoldersSuccessSchema>
export type ListFoldersEnvelope = z.infer<typeof ListFoldersEnvelopeSchema>


