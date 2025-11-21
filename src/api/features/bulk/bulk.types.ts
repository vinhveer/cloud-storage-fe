import { z } from 'zod'
import {
  BulkCopyEnvelopeSchema,
  BulkCopyRequestSchema,
  BulkCopyResultItemSchema,
  BulkCopyResultSchema,
  BulkCopySuccessSchema,
  BulkDeleteDetailsSchema,
  BulkDeleteEnvelopeSchema,
  BulkDeleteFileResultSchema,
  BulkDeleteFolderResultSchema,
  BulkDeleteRequestSchema,
  BulkDeleteResultSchema,
  BulkDeleteSuccessSchema,
  BulkMoveEnvelopeSchema,
  BulkMoveRequestSchema,
  BulkMoveResultSchema,
  BulkMoveSuccessSchema,
} from './bulk.schemas'

export type BulkCopyRequest = z.infer<typeof BulkCopyRequestSchema>
export type BulkCopyResultItem = z.infer<typeof BulkCopyResultItemSchema>
export type BulkCopyResult = z.infer<typeof BulkCopyResultSchema>
export type BulkCopySuccess = z.infer<typeof BulkCopySuccessSchema>
export type BulkCopyEnvelope = z.infer<typeof BulkCopyEnvelopeSchema>

export type BulkDeleteRequest = z.infer<typeof BulkDeleteRequestSchema>
export type BulkDeleteResult = z.infer<typeof BulkDeleteResultSchema>
export type BulkDeleteFileResult = z.infer<typeof BulkDeleteFileResultSchema>
export type BulkDeleteFolderResult = z.infer<typeof BulkDeleteFolderResultSchema>
export type BulkDeleteDetails = z.infer<typeof BulkDeleteDetailsSchema>
export type BulkDeleteSuccess = z.infer<typeof BulkDeleteSuccessSchema>
export type BulkDeleteEnvelope = z.infer<typeof BulkDeleteEnvelopeSchema>

export type BulkMoveRequest = z.infer<typeof BulkMoveRequestSchema>
export type BulkMoveResult = z.infer<typeof BulkMoveResultSchema>
export type BulkMoveSuccess = z.infer<typeof BulkMoveSuccessSchema>
export type BulkMoveEnvelope = z.infer<typeof BulkMoveEnvelopeSchema>


