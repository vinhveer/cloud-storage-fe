import { z } from 'zod'
import {
  UploadFileEnvelopeSchema,
  UploadFileRequestSchema,
  UploadFileSuccessSchema,
  UploadedFileSchema,
  MoveFileEnvelopeSchema,
  MoveFileRequestSchema,
  MoveFileSuccessSchema,
  MovedFileSchema,
  FileListItemSchema,
  FileListPaginationSchema,
  ListFilesEnvelopeSchema,
  ListFilesSuccessSchema,
  FileDetailEnvelopeSchema,
  FileDetailSchema,
  UpdateFileEnvelopeSchema,
  UpdateFileRequestSchema,
  UpdateFileSuccessSchema,
  UpdatedFileSchema,
  DeleteFileEnvelopeSchema,
  DeleteFileSuccessSchema,
  CopyFileEnvelopeSchema,
  CopyFileRequestSchema,
  CopyFileSuccessSchema,
  CopiedFileSchema,
  RecentFileSchema,
  RecentFilesEnvelopeSchema,
  RecentFilesSuccessSchema,
  FilePreviewEnvelopeSchema,
  FilePreviewFileSchema,
  FilePreviewSuccessSchema,
} from './file.schemas'

export type UploadedFile = z.infer<typeof UploadedFileSchema>
export type UploadFileSuccess = z.infer<typeof UploadFileSuccessSchema>
export type UploadFileEnvelope = z.infer<typeof UploadFileEnvelopeSchema>
export type UploadFileRequest = z.infer<typeof UploadFileRequestSchema>

export type MoveFileRequest = z.infer<typeof MoveFileRequestSchema>
export type MovedFile = z.infer<typeof MovedFileSchema>
export type MoveFileSuccess = z.infer<typeof MoveFileSuccessSchema>
export type MoveFileEnvelope = z.infer<typeof MoveFileEnvelopeSchema>

export type FileListItem = z.infer<typeof FileListItemSchema>
export type FileListPagination = z.infer<typeof FileListPaginationSchema>
export type ListFilesSuccess = z.infer<typeof ListFilesSuccessSchema>
export type ListFilesEnvelope = z.infer<typeof ListFilesEnvelopeSchema>

export type ListFilesParams = {
  folder_id?: number
  search?: string
  extension?: string
  page?: number
  per_page?: number
}

export type FileDetail = z.infer<typeof FileDetailSchema>
export type FileDetailEnvelope = z.infer<typeof FileDetailEnvelopeSchema>

export type UpdateFileRequest = z.infer<typeof UpdateFileRequestSchema>
export type UpdatedFile = z.infer<typeof UpdatedFileSchema>
export type UpdateFileSuccess = z.infer<typeof UpdateFileSuccessSchema>
export type UpdateFileEnvelope = z.infer<typeof UpdateFileEnvelopeSchema>

export type DeleteFileSuccess = z.infer<typeof DeleteFileSuccessSchema>
export type DeleteFileEnvelope = z.infer<typeof DeleteFileEnvelopeSchema>

export type CopyFileRequest = z.infer<typeof CopyFileRequestSchema>
export type CopiedFile = z.infer<typeof CopiedFileSchema>
export type CopyFileSuccess = z.infer<typeof CopyFileSuccessSchema>
export type CopyFileEnvelope = z.infer<typeof CopyFileEnvelopeSchema>

export type RecentFile = z.infer<typeof RecentFileSchema>
export type RecentFilesSuccess = z.infer<typeof RecentFilesSuccessSchema>
export type RecentFilesEnvelope = z.infer<typeof RecentFilesEnvelopeSchema>

export type FilePreviewFile = z.infer<typeof FilePreviewFileSchema>
export type FilePreviewSuccess = z.infer<typeof FilePreviewSuccessSchema>
export type FilePreviewEnvelope = z.infer<typeof FilePreviewEnvelopeSchema>


