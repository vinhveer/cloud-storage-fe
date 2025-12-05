import { get, post, put } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import {
  CreatePublicLinkEnvelopeSchema,
  CreatePublicLinkRequestSchema,
  ListPublicLinksEnvelopeSchema,
  PublicLinkDetailEnvelopeSchema,
  UpdatePublicLinkEnvelopeSchema,
  UpdatePublicLinkRequestSchema,
  PublicLinkPreviewEnvelopeSchema,
  PublicLinkFolderPreviewEnvelopeSchema,
  PublicLinkDownloadEnvelopeSchema,
  RevokePublicLinkEnvelopeSchema,
  FilePublicLinksEnvelopeSchema,
} from './public-link.schemas'
import type {
  CreatePublicLinkEnvelope,
  CreatePublicLinkRequest,
  CreatePublicLinkSuccess,
  ListPublicLinksEnvelope,
  ListPublicLinksSuccess,
  PublicLinkDetail,
  PublicLinkDetailEnvelope,
  UpdatePublicLinkEnvelope,
  UpdatePublicLinkRequest,
  UpdatePublicLinkSuccess,
  PublicLinkPreviewData,
  PublicLinkPreviewEnvelope,
  PublicLinkFolderPreviewData,
  PublicLinkFolderPreviewEnvelope,
  PublicLinkDownloadData,
  PublicLinkDownloadEnvelope,
  RevokePublicLinkEnvelope,
  RevokePublicLinkSuccess,
  FilePublicLinksData,
  FilePublicLinksEnvelope,
} from './public-link.types'

const createPublicLinkEnvelope = CreatePublicLinkEnvelopeSchema
const listPublicLinksEnvelope = ListPublicLinksEnvelopeSchema
const publicLinkDetailEnvelope = PublicLinkDetailEnvelopeSchema
const updatePublicLinkEnvelope = UpdatePublicLinkEnvelopeSchema
const publicLinkPreviewEnvelope = PublicLinkPreviewEnvelopeSchema
const publicLinkDownloadEnvelope = PublicLinkDownloadEnvelopeSchema
const revokePublicLinkEnvelope = RevokePublicLinkEnvelopeSchema
const filePublicLinksEnvelope = FilePublicLinksEnvelopeSchema

export async function createPublicLink(payload: CreatePublicLinkRequest): Promise<CreatePublicLinkSuccess> {
  const validPayload = parseWithZod(CreatePublicLinkRequestSchema, payload)
  const response = await post<unknown, CreatePublicLinkRequest>('/api/public-links', validPayload)
  const parsed = parseWithZod<CreatePublicLinkEnvelope>(createPublicLinkEnvelope, response)
  return parsed.data
}

export type ListPublicLinksParams = {
  page?: number
  per_page?: number
}

export async function listPublicLinks(params: ListPublicLinksParams = {}): Promise<ListPublicLinksSuccess> {
  const response = await get<unknown>('/api/public-links', {
    params: {
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<ListPublicLinksEnvelope>(listPublicLinksEnvelope, response)
  return parsed.data
}

export async function getPublicLinkDetail(token: string): Promise<PublicLinkDetail> {
  const response = await get<unknown>(`/api/public-links/${token}`)
  const parsed = parseWithZod<PublicLinkDetailEnvelope>(publicLinkDetailEnvelope, response)
  return parsed.data
}

export async function updatePublicLink(id: number, payload: UpdatePublicLinkRequest): Promise<UpdatePublicLinkSuccess> {
  const validPayload = parseWithZod(UpdatePublicLinkRequestSchema, payload)
  const response = await put<unknown, UpdatePublicLinkRequest>(`/api/public-links/${id}`, validPayload)
  const parsed = parseWithZod<UpdatePublicLinkEnvelope>(updatePublicLinkEnvelope, response)
  return parsed.data
}

export async function getPublicLinkPreview(token: string): Promise<PublicLinkPreviewData> {
  const response = await get<unknown>(`/api/public-links/${token}/preview`)
  const parsed = parseWithZod<PublicLinkPreviewEnvelope>(publicLinkPreviewEnvelope, response)
  return parsed.data
}

export async function getPublicLinkFolderPreview(token: string): Promise<PublicLinkFolderPreviewData> {
  const response = await get<unknown>(`/api/public-links/${token}/preview`)
  const parsed = parseWithZod<PublicLinkFolderPreviewEnvelope>(PublicLinkFolderPreviewEnvelopeSchema, response)
  return parsed.data
}

export async function getPublicLinkDownload(token: string): Promise<PublicLinkDownloadData> {
  const response = await get<unknown>(`/api/public-links/${token}/download`)
  const parsed = parseWithZod<PublicLinkDownloadEnvelope>(publicLinkDownloadEnvelope, response)
  return parsed.data
}

export async function revokePublicLink(id: number): Promise<RevokePublicLinkSuccess> {
  const response = await post<unknown, Record<string, never>>(`/api/public-links/${id}/revoke`, {})
  const parsed = parseWithZod<RevokePublicLinkEnvelope>(revokePublicLinkEnvelope, response)
  return parsed.data
}

export async function getFilePublicLinks(fileId: number): Promise<FilePublicLinksData> {
  const response = await get<unknown>(`/api/files/${fileId}/public-links`)
  const parsed = parseWithZod<FilePublicLinksEnvelope>(filePublicLinksEnvelope, response)
  return parsed.data
}


