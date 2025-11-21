import { get, post, upload } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { toFormData } from '../../core/upload'
import {
  FileVersionDetailEnvelopeSchema,
  ListFileVersionsEnvelopeSchema,
  RestoreFileVersionEnvelopeSchema,
  UploadFileVersionEnvelopeSchema,
  UploadFileVersionRequestSchema,
} from './file-version.schemas'
import type {
  FileVersionDetailEnvelope,
  FileVersionDetail,
  ListFileVersionsEnvelope,
  ListFileVersionsSuccess,
  RestoreFileVersionEnvelope,
  RestoreFileVersionSuccess,
  UploadFileVersionEnvelope,
  UploadFileVersionRequest,
  UploadFileVersionSuccess,
} from './file-version.types'

const uploadFileVersionEnvelope = UploadFileVersionEnvelopeSchema

function toUploadFileVersionFormData(payload: UploadFileVersionRequest): FormData {
  const record: Record<string, unknown> = {
    action: payload.action,
    notes: payload.notes,
    file: payload.file,
  }

  return toFormData(record)
}

export async function uploadFileVersion(
  fileId: number,
  payload: UploadFileVersionRequest,
): Promise<UploadFileVersionSuccess> {
  const validPayload = parseWithZod(UploadFileVersionRequestSchema, payload)
  const formData = toUploadFileVersionFormData(validPayload)
  const response = await upload<unknown>(`/api/files/${fileId}/versions`, formData)
  const parsed = parseWithZod<UploadFileVersionEnvelope>(uploadFileVersionEnvelope, response)
  return parsed.data
}

const listFileVersionsEnvelope = ListFileVersionsEnvelopeSchema

export async function listFileVersions(
  fileId: number,
  params: { page?: number; per_page?: number } = {},
): Promise<ListFileVersionsSuccess> {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.per_page) search.set('per_page', String(params.per_page))

  const query = search.toString()
  const url = query ? `/api/files/${fileId}/versions?${query}` : `/api/files/${fileId}/versions`

  const response = await get<unknown>(url)
  const parsed = parseWithZod<ListFileVersionsEnvelope>(listFileVersionsEnvelope, response)
  return parsed.data
}

const fileVersionDetailEnvelope = FileVersionDetailEnvelopeSchema

export async function getFileVersionDetail(fileId: number, versionId: number): Promise<FileVersionDetail> {
  const response = await get<unknown>(`/api/files/${fileId}/versions/${versionId}`)
  const parsed = parseWithZod<FileVersionDetailEnvelope>(fileVersionDetailEnvelope, response)
  return parsed.data
}

const restoreFileVersionEnvelope = RestoreFileVersionEnvelopeSchema

export async function restoreFileVersion(fileId: number, versionId: number): Promise<RestoreFileVersionSuccess> {
  const response = await post<unknown, undefined>(`/api/files/${fileId}/versions/${versionId}/restore`)
  const parsed = parseWithZod<RestoreFileVersionEnvelope>(restoreFileVersionEnvelope, response)
  return parsed.data
}

export async function downloadFileVersion(fileId: number, versionId: number): Promise<Blob> {
  const response = await get<Blob>(`/api/files/${fileId}/versions/${versionId}/download`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
  return response
}



