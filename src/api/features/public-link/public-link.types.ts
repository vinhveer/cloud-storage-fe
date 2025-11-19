import { z } from 'zod'
import {
  CreatePublicLinkEnvelopeSchema,
  CreatePublicLinkRequestSchema,
  CreatePublicLinkSuccessSchema,
  ListPublicLinksEnvelopeSchema,
  ListPublicLinksSuccessSchema,
  PublicLinkSchema,
  PublicLinkListItemSchema,
  PublicLinkListPaginationSchema,
  PublicLinkDetailEnvelopeSchema,
  PublicLinkDetailSchema,
  UpdatePublicLinkEnvelopeSchema,
  UpdatePublicLinkRequestSchema,
  UpdatePublicLinkSuccessSchema,
  PublicLinkPreviewEnvelopeSchema,
  PublicLinkPreviewDataSchema,
  PublicLinkDownloadEnvelopeSchema,
  PublicLinkDownloadDataSchema,
  RevokePublicLinkEnvelopeSchema,
  RevokePublicLinkSuccessSchema,
  FilePublicLinkItemSchema,
  FilePublicLinksDataSchema,
  FilePublicLinksEnvelopeSchema,
} from './public-link.schemas'

export type PublicLink = z.infer<typeof PublicLinkSchema>
export type PublicLinkDetail = z.infer<typeof PublicLinkDetailSchema>

export type CreatePublicLinkRequest = z.infer<typeof CreatePublicLinkRequestSchema>
export type CreatePublicLinkSuccess = z.infer<typeof CreatePublicLinkSuccessSchema>
export type CreatePublicLinkEnvelope = z.infer<typeof CreatePublicLinkEnvelopeSchema>

export type PublicLinkListItem = z.infer<typeof PublicLinkListItemSchema>
export type PublicLinkListPagination = z.infer<typeof PublicLinkListPaginationSchema>
export type ListPublicLinksSuccess = z.infer<typeof ListPublicLinksSuccessSchema>
export type ListPublicLinksEnvelope = z.infer<typeof ListPublicLinksEnvelopeSchema>

export type PublicLinkDetailEnvelope = z.infer<typeof PublicLinkDetailEnvelopeSchema>

export type UpdatePublicLinkRequest = z.infer<typeof UpdatePublicLinkRequestSchema>
export type UpdatePublicLinkSuccess = z.infer<typeof UpdatePublicLinkSuccessSchema>
export type UpdatePublicLinkEnvelope = z.infer<typeof UpdatePublicLinkEnvelopeSchema>

export type PublicLinkPreviewData = z.infer<typeof PublicLinkPreviewDataSchema>
export type PublicLinkPreviewEnvelope = z.infer<typeof PublicLinkPreviewEnvelopeSchema>

export type PublicLinkDownloadData = z.infer<typeof PublicLinkDownloadDataSchema>
export type PublicLinkDownloadEnvelope = z.infer<typeof PublicLinkDownloadEnvelopeSchema>

export type RevokePublicLinkSuccess = z.infer<typeof RevokePublicLinkSuccessSchema>
export type RevokePublicLinkEnvelope = z.infer<typeof RevokePublicLinkEnvelopeSchema>

export type FilePublicLinkItem = z.infer<typeof FilePublicLinkItemSchema>
export type FilePublicLinksData = z.infer<typeof FilePublicLinksDataSchema>
export type FilePublicLinksEnvelope = z.infer<typeof FilePublicLinksEnvelopeSchema>


