import { post } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import {
  BulkCopyEnvelopeSchema,
  BulkCopyRequestSchema,
  BulkDeleteEnvelopeSchema,
  BulkDeleteRequestSchema,
  BulkMoveEnvelopeSchema,
  BulkMoveRequestSchema,
} from './bulk.schemas'
import type {
  BulkCopyEnvelope,
  BulkCopyRequest,
  BulkCopySuccess,
  BulkDeleteEnvelope,
  BulkDeleteRequest,
  BulkDeleteSuccess,
  BulkMoveEnvelope,
  BulkMoveRequest,
  BulkMoveSuccess,
} from './bulk.types'

const bulkCopyEnvelope = BulkCopyEnvelopeSchema
const bulkDeleteEnvelope = BulkDeleteEnvelopeSchema
const bulkMoveEnvelope = BulkMoveEnvelopeSchema

export async function bulkCopy(payload: BulkCopyRequest): Promise<BulkCopySuccess> {
  const validPayload = parseWithZod(BulkCopyRequestSchema, payload)
  const response = await post<unknown, BulkCopyRequest>('/api/bulk/bulk-copy', validPayload)
  const parsed = parseWithZod<BulkCopyEnvelope>(bulkCopyEnvelope, response)
  return parsed.data
}

export async function bulkDelete(payload: BulkDeleteRequest): Promise<BulkDeleteSuccess> {
  const validPayload = parseWithZod(BulkDeleteRequestSchema, payload)
  const response = await post<unknown, BulkDeleteRequest>('/api/bulk/bulk-delete', validPayload)
  const parsed = parseWithZod<BulkDeleteEnvelope>(bulkDeleteEnvelope, response)
  return parsed.data
}

export async function bulkMove(payload: BulkMoveRequest): Promise<BulkMoveSuccess> {
  const validPayload = parseWithZod(BulkMoveRequestSchema, payload)
  const response = await post<unknown, BulkMoveRequest>('/api/bulk/bulk-move', validPayload)
  const parsed = parseWithZod<BulkMoveEnvelope>(bulkMoveEnvelope, response)
  return parsed.data
}


