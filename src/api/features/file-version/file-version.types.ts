import { z } from 'zod'
import {
  FileVersionSchema,
  FileVersionDetailEnvelopeSchema,
  FileVersionDetailSchema,
  FileVersionListItemSchema,
  FileVersionListPaginationSchema,
  ListFileVersionsEnvelopeSchema,
  ListFileVersionsSuccessSchema,
  RestoreFileVersionEnvelopeSchema,
  RestoreFileVersionSuccessSchema,
  UploadFileVersionEnvelopeSchema,
  UploadFileVersionRequestSchema,
  UploadFileVersionSuccessSchema,
} from './file-version.schemas'

export type FileVersion = z.infer<typeof FileVersionSchema>
export type UploadFileVersionSuccess = z.infer<typeof UploadFileVersionSuccessSchema>
export type UploadFileVersionEnvelope = z.infer<typeof UploadFileVersionEnvelopeSchema>
export type UploadFileVersionRequest = z.infer<typeof UploadFileVersionRequestSchema>

export type FileVersionListItem = z.infer<typeof FileVersionListItemSchema>
export type FileVersionListPagination = z.infer<typeof FileVersionListPaginationSchema>
export type ListFileVersionsSuccess = z.infer<typeof ListFileVersionsSuccessSchema>
export type ListFileVersionsEnvelope = z.infer<typeof ListFileVersionsEnvelopeSchema>

export type FileVersionDetail = z.infer<typeof FileVersionDetailSchema>
export type FileVersionDetailEnvelope = z.infer<typeof FileVersionDetailEnvelopeSchema>

export type RestoreFileVersionSuccess = z.infer<typeof RestoreFileVersionSuccessSchema>
export type RestoreFileVersionEnvelope = z.infer<typeof RestoreFileVersionEnvelopeSchema>

