import { deleteRequest, get, post } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import {
  CreateShareEnvelopeSchema,
  CreateShareRequestSchema,
  ListSharesEnvelopeSchema,
  ShareDetailSchema,
  DeleteShareSuccessSchema,
  ReceivedSharesSuccessSchema,
  ReceivedSharesEnvelopeSchema,
  AddShareUsersEnvelopeSchema,
  AddShareUsersRequestSchema,
  ShareByResourceEnvelopeSchema,
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
  AddShareUsersRequest,
  AddShareUsersSuccess,
  AddShareUsersEnvelope,
  ShareByResourceEnvelope,
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

  const envelopeParsed = ReceivedSharesEnvelopeSchema.safeParse(response)
  if (envelopeParsed.success) {
    return envelopeParsed.data.data
  }

  const plainParsed = ReceivedSharesSuccessSchema.safeParse(response)
  if (plainParsed.success) {
    return plainParsed.data
  }

  // Fallback: coerce minimal shape without throwing to keep UI working even if backend changes slightly
  const anyResp = response as any
  const data = Array.isArray(anyResp?.data) ? anyResp.data : []
  const pagination = anyResp?.pagination ?? {
    current_page: 1,
    total_pages: 1,
    total_items: data.length,
  }
  return { data, pagination }
}

export async function addShareUsers(shareId: number, payload: AddShareUsersRequest): Promise<AddShareUsersSuccess> {
  const validPayload = parseWithZod(AddShareUsersRequestSchema, payload)
  const response = await post<unknown, AddShareUsersRequest>(`/api/shares/${shareId}/users`, validPayload)
  const parsed = parseWithZod<AddShareUsersEnvelope>(AddShareUsersEnvelopeSchema, response)
  return parsed.data
}

export type GetShareByResourceParams = {
  shareable_type: 'file' | 'folder'
  shareable_id: number
}

/**
 * Get share info for a specific resource (file/folder).
 * Returns ShareDetail if share exists, null if not found (404).
 */
export async function getShareByResource(params: GetShareByResourceParams): Promise<ShareDetail | null> {
  try {
    const response = await get<unknown>('/api/shares/by-resource', {
      params: {
        shareable_type: params.shareable_type,
        shareable_id: params.shareable_id,
      },
    })
    const parsed = parseWithZod<ShareByResourceEnvelope>(ShareByResourceEnvelopeSchema, response)
    return parsed.data
  } catch (error: unknown) {
    // If 404, return null (no share exists for this resource)
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null
    }
    throw error
  }
}
