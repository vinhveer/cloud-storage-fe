import { deleteRequest, get, post, put, upload } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { toFormData } from '../../core/upload'
import {
  FileDetailEnvelopeSchema,
  MoveFileEnvelopeSchema,
  MoveFileRequestSchema,
  ListFilesEnvelopeSchema,
  UploadFileEnvelopeSchema,
  UploadFileRequestSchema,
  UpdateFileEnvelopeSchema,
  UpdateFileRequestSchema,
  DeleteFileEnvelopeSchema,
  CopyFileEnvelopeSchema,
  CopyFileRequestSchema,
  FilePreviewEnvelopeSchema,
  RecentFilesEnvelopeSchema,
  DeleteFileVersionEnvelopeSchema,
} from './file.schemas'
import type {
  CopyFileEnvelope,
  CopyFileRequest,
  CopyFileSuccess,
  DeleteFileEnvelope,
  DeleteFileSuccess,
  FileDetail,
  FileDetailEnvelope,
  FilePreviewEnvelope,
  FilePreviewSuccess,
  ListFilesEnvelope,
  ListFilesParams,
  ListFilesSuccess,
  DeleteFileVersionEnvelope,
  DeleteFileVersionSuccess,
  MoveFileRequest,
  MoveFileSuccess,
  RecentFilesEnvelope,
  RecentFilesSuccess,
  UploadFileRequest,
  UploadFileSuccess,
  UpdateFileEnvelope,
  UpdateFileRequest,
  UpdateFileSuccess,
} from './file.types'

const uploadFileEnvelope = UploadFileEnvelopeSchema
const moveFileEnvelope = MoveFileEnvelopeSchema
const listFilesEnvelope = ListFilesEnvelopeSchema
const fileDetailEnvelope = FileDetailEnvelopeSchema
const updateFileEnvelope = UpdateFileEnvelopeSchema
const deleteFileEnvelope = DeleteFileEnvelopeSchema
const copyFileEnvelope = CopyFileEnvelopeSchema
const recentFilesEnvelope = RecentFilesEnvelopeSchema
const filePreviewEnvelope = FilePreviewEnvelopeSchema
const deleteFileVersionEnvelope = DeleteFileVersionEnvelopeSchema

function toUploadFileFormData(payload: UploadFileRequest): FormData {
  const record: Record<string, unknown> = {
    file: payload.file,
  }

  if (payload.folderId !== undefined && payload.folderId !== null) {
    record.folder_id = payload.folderId
  }

  return toFormData(record)
}

export async function uploadFile(payload: UploadFileRequest): Promise<UploadFileSuccess> {
  const validPayload = parseWithZod(UploadFileRequestSchema, payload)
  const formData = toUploadFileFormData(validPayload)
  const response = await upload<unknown>('/api/files', formData)
  const parsed = parseWithZod(uploadFileEnvelope, response)
  return parsed.data
}

export async function moveFile(fileId: number, payload: MoveFileRequest): Promise<MoveFileSuccess> {
  const validPayload = parseWithZod(MoveFileRequestSchema, payload)
  const response = await post<unknown, MoveFileRequest>(`/api/files/${fileId}/move`, validPayload)
  const parsed = parseWithZod(moveFileEnvelope, response)
  return parsed.data
}

export async function listFiles(params: ListFilesParams = {}): Promise<ListFilesSuccess> {
  const response = await get<unknown>('/api/files', {
    params: {
      folder_id: params.folder_id,
      search: params.search,
      extension: params.extension,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<ListFilesEnvelope>(listFilesEnvelope, response)
  return parsed.data
}

export async function getFileDetail(fileId: number): Promise<FileDetail> {
  const response = await get<unknown>(`/api/files/${fileId}`)
  const parsed = parseWithZod<FileDetailEnvelope>(fileDetailEnvelope, response)
  return parsed.data
}

export async function downloadFile(fileId: number): Promise<Blob> {
  const response = await get<Blob>(`/api/files/${fileId}/download`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
  return response
}

export async function updateFile(fileId: number, payload: UpdateFileRequest): Promise<UpdateFileSuccess> {
  const validPayload = parseWithZod(UpdateFileRequestSchema, payload)
  const response = await put<unknown, UpdateFileRequest>(`/api/files/${fileId}`, validPayload)
  const parsed = parseWithZod<UpdateFileEnvelope>(updateFileEnvelope, response)
  return parsed.data
}

export async function deleteFile(fileId: number): Promise<DeleteFileSuccess> {
  const response = await deleteRequest<unknown>(`/api/files/${fileId}`)
  const parsed = parseWithZod<DeleteFileEnvelope>(deleteFileEnvelope, response)
  return parsed.data
}

export async function copyFile(fileId: number, payload: CopyFileRequest): Promise<CopyFileSuccess> {
  const validPayload = parseWithZod(CopyFileRequestSchema, payload)
  const response = await post<unknown, CopyFileRequest>(`/api/files/${fileId}/copy`, validPayload, {
    params: {
      only_latest: validPayload.only_latest,
    },
  })
  const parsed = parseWithZod<CopyFileEnvelope>(copyFileEnvelope, response)
  return parsed.data
}

export async function getRecentFiles(limit?: number): Promise<RecentFilesSuccess> {
  const response = await get<unknown>('/api/files/recent', {
    params: {
      limit,
    },
  })
  const parsed = parseWithZod<RecentFilesEnvelope>(recentFilesEnvelope, response)
  return parsed.data
}

export async function getFilePreview(fileId: number, token?: string): Promise<FilePreviewSuccess> {
  const url = `/api/files/${fileId}/preview`
  const config = token ? { params: { token } } : {}
  const response = await get<unknown>(url, config)
  const parsed = parseWithZod<FilePreviewEnvelope>(filePreviewEnvelope, response)
  return parsed.data
}

export async function deleteFileVersion(fileId: number, versionId: number): Promise<DeleteFileVersionSuccess> {
  const response = await deleteRequest<unknown>(`/api/files/${fileId}/versions/${versionId}`)
  const parsed = parseWithZod<DeleteFileVersionEnvelope>(deleteFileVersionEnvelope, response)
  return parsed.data
}