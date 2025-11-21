import { deleteRequest, get, post } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import {
  CreateShareEnvelopeSchema,
  CreateShareRequestSchema,
  ListSharesEnvelopeSchema,
  ShareDetailSchema,
  DeleteShareSuccessSchema,
  ReceivedSharesSuccessSchema,
} from './share.schemas'
import type {
  CreateShareEnvelope,
  CreateShareRequest,
  CreateShareSuccess,
  ListSharesEnvelope,
  ListSharesSuccess,
  ShareDetail,
  DeleteShareSuccess,
  RemoveShareUserSuccess,
  ReceivedSharesSuccess,
} from './share.types'

const createShareEnvelope = CreateShareEnvelopeSchema
const listSharesEnvelope = ListSharesEnvelopeSchema

export async function createShare(payload: CreateShareRequest): Promise<CreateShareSuccess> {
  const validPayload = parseWithZod(CreateShareRequestSchema, payload)
  const response = await post<unknown, CreateShareRequest>('/api/shares', validPayload)
  const parsed = parseWithZod<CreateShareEnvelope>(createShareEnvelope, response)
  return parsed.data
}

export type ListSharesParams = {
  page?: number
  per_page?: number
}

export async function listShares(params: ListSharesParams = {}): Promise<ListSharesSuccess> {
  const response = await get<unknown>('/api/shares', {
    params: {
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<ListSharesEnvelope>(listSharesEnvelope, response)
  return parsed.data
}

export async function getShareDetail(shareId: number): Promise<ShareDetail> {
  const response = await get<unknown>(`/api/shares/${shareId}`)
  const parsed = parseWithZod<ShareDetail>(ShareDetailSchema, response)
  return parsed
}

export async function deleteShare(shareId: number): Promise<DeleteShareSuccess> {
  const response = await deleteRequest<unknown>(`/api/shares/${shareId}`)
  const parsed = parseWithZod<DeleteShareSuccess>(DeleteShareSuccessSchema, response)
  return parsed
}

export async function removeShareUser(shareId: number, userId: number): Promise<RemoveShareUserSuccess> {
  const response = await deleteRequest<unknown>(`/api/shares/${shareId}/users/${userId}`)
  const parsed = parseWithZod<DeleteShareSuccess>(DeleteShareSuccessSchema, response)
  return parsed
}

export type ReceivedSharesParams = {
  page?: number
  per_page?: number
}

export async function getReceivedShares(params: ReceivedSharesParams = {}): Promise<ReceivedSharesSuccess> {
  const response = await get<unknown>('/api/shares/received', {
    params: {
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<ReceivedSharesSuccess>(ReceivedSharesSuccessSchema, response)
  return parsed
}


