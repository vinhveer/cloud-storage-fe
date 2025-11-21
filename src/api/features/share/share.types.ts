import { z } from 'zod'
import {
  CreateShareEnvelopeSchema,
  CreateShareRequestSchema,
  CreateShareSuccessSchema,
  ShareListItemSchema,
  ShareListPaginationSchema,
  ListSharesSuccessSchema,
  ListSharesEnvelopeSchema,
  ShareDetailSchema,
  DeleteShareSuccessSchema,
  ReceivedShareItemSchema,
  ReceivedSharesPaginationSchema,
  ReceivedSharesSuccessSchema,
  ShareRecipientSchema,
  ShareSchema,
} from './share.schemas'

export type ShareRecipient = z.infer<typeof ShareRecipientSchema>
export type Share = z.infer<typeof ShareSchema>

export type CreateShareRequest = z.infer<typeof CreateShareRequestSchema>
export type CreateShareSuccess = z.infer<typeof CreateShareSuccessSchema>
export type CreateShareEnvelope = z.infer<typeof CreateShareEnvelopeSchema>

export type ShareListItem = z.infer<typeof ShareListItemSchema>
export type ShareListPagination = z.infer<typeof ShareListPaginationSchema>
export type ListSharesSuccess = z.infer<typeof ListSharesSuccessSchema>
export type ListSharesEnvelope = z.infer<typeof ListSharesEnvelopeSchema>

export type ShareDetail = z.infer<typeof ShareDetailSchema>

export type DeleteShareSuccess = z.infer<typeof DeleteShareSuccessSchema>

export type ReceivedShareItem = z.infer<typeof ReceivedShareItemSchema>
export type ReceivedSharesPagination = z.infer<typeof ReceivedSharesPaginationSchema>
export type ReceivedSharesSuccess = z.infer<typeof ReceivedSharesSuccessSchema>

export type RemoveShareUserSuccess = DeleteShareSuccess


