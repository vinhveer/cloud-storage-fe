import { deleteRequest, get, post, put } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import {
  CreateFolderEnvelopeSchema,
  CreateFolderRequestSchema,
  FolderDetailEnvelopeSchema,
  FolderBreadcrumbEnvelopeSchema,
  FolderContentsEnvelopeSchema,
  FolderTreeEnvelopeSchema,
  ListFoldersEnvelopeSchema,
  UpdateFolderEnvelopeSchema,
  UpdateFolderRequestSchema,
  MoveFolderEnvelopeSchema,
  MoveFolderRequestSchema,
  DeleteFolderEnvelopeSchema,
  CopyFolderEnvelopeSchema,
  CopyFolderRequestSchema,
} from './folder.schemas'
import type {
  CreateFolderEnvelope,
  CreateFolderRequest,
  CreateFolderSuccess,
  FolderDetailEnvelope,
  FolderDetail,
  FolderBreadcrumbEnvelope,
  FolderBreadcrumbSuccess,
  FolderTreeEnvelope,
  FolderTreeSuccess,
  ListFoldersEnvelope,
  ListFoldersSuccess,
  UpdateFolderEnvelope,
  UpdateFolderRequest,
  UpdateFolderSuccess,
  MoveFolderEnvelope,
  MoveFolderRequest,
  MoveFolderSuccess,
  DeleteFolderEnvelope,
  DeleteFolderSuccess,
  CopyFolderEnvelope,
  CopyFolderRequest,
  CopyFolderSuccess,
} from './folder.types'

const createFolderEnvelope = CreateFolderEnvelopeSchema
const moveFolderEnvelope = MoveFolderEnvelopeSchema
const folderTreeEnvelope = FolderTreeEnvelopeSchema
const folderBreadcrumbEnvelope = FolderBreadcrumbEnvelopeSchema
const listFoldersEnvelope = ListFoldersEnvelopeSchema
const folderDetailEnvelope = FolderDetailEnvelopeSchema
const folderContentsEnvelope = FolderContentsEnvelopeSchema
const updateFolderEnvelope = UpdateFolderEnvelopeSchema
const deleteFolderEnvelope = DeleteFolderEnvelopeSchema
const copyFolderEnvelope = CopyFolderEnvelopeSchema

export async function createFolder(payload: CreateFolderRequest): Promise<CreateFolderSuccess> {
  const validPayload = parseWithZod(CreateFolderRequestSchema, payload)
  const response = await post<unknown, CreateFolderRequest>('/api/folders', validPayload)
  const parsed = parseWithZod<CreateFolderEnvelope>(createFolderEnvelope, response)
  return parsed.data
}

export async function moveFolder(folderId: number, payload: MoveFolderRequest): Promise<MoveFolderSuccess> {
  const validPayload = parseWithZod(MoveFolderRequestSchema, payload)
  const response = await post<unknown, MoveFolderRequest>(`/api/folders/${folderId}/move`, validPayload)
  const parsed = parseWithZod<MoveFolderEnvelope>(moveFolderEnvelope, response)
  return parsed.data
}

export async function getFolderTree(): Promise<FolderTreeSuccess> {
  const response = await get<unknown>('/api/folders/tree')
  const parsed = parseWithZod<FolderTreeEnvelope>(folderTreeEnvelope, response)
  return parsed.data
}

export async function getFolderBreadcrumb(folderId: number): Promise<FolderBreadcrumbSuccess> {
  const response = await get<unknown>(`/api/folders/${folderId}/breadcrumb`)
  const parsed = parseWithZod<FolderBreadcrumbEnvelope>(folderBreadcrumbEnvelope, response)
  return parsed.data
}

export type ListFoldersParams = {
  parent_id?: number
  page?: number
  per_page?: number
}

export async function listFolders(params: ListFoldersParams = {}): Promise<ListFoldersSuccess> {
  const response = await get<unknown>('/api/folders', {
    params: {
      parent_id: params.parent_id,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<ListFoldersEnvelope>(listFoldersEnvelope, response)
  return parsed.data
}

export async function getFolderDetail(folderId: number): Promise<FolderDetail> {
  const response = await get<unknown>(`/api/folders/${folderId}`)
  const parsed = parseWithZod<FolderDetailEnvelope>(folderDetailEnvelope, response)
  return parsed.data
}

export async function getFolderContents(folderId: number) {
  const response = await get<unknown>(`/api/folders/${folderId}/contents`)
  const parsed = parseWithZod(folderContentsEnvelope, response)
  return parsed.data
}

export async function updateFolder(folderId: number, payload: UpdateFolderRequest): Promise<UpdateFolderSuccess> {
  const validPayload = parseWithZod(UpdateFolderRequestSchema, payload)
  const response = await put<unknown, UpdateFolderRequest>(`/api/folders/${folderId}`, validPayload)
  const parsed = parseWithZod<UpdateFolderEnvelope>(updateFolderEnvelope, response)
  return parsed.data
}

export async function deleteFolder(folderId: number): Promise<DeleteFolderSuccess> {
  const response = await deleteRequest<unknown>(`/api/folders/${folderId}`)
  const parsed = parseWithZod<DeleteFolderEnvelope>(deleteFolderEnvelope, response)
  return parsed.data
}

export async function copyFolder(folderId: number, payload: CopyFolderRequest): Promise<CopyFolderSuccess> {
  const validPayload = parseWithZod(CopyFolderRequestSchema, payload)
  const response = await post<unknown, CopyFolderRequest>(`/api/folders/${folderId}/copy`, validPayload)
  const parsed = parseWithZod<CopyFolderEnvelope>(copyFolderEnvelope, response)
  return parsed.data
}

export async function downloadFolder(folderId: number): Promise<Blob> {
  const response = await get<Blob>(`/api/folders/${folderId}/download`, {
    responseType: 'blob',
    headers: {
      Accept: 'application/zip',
    },
  })
  return response
}

export async function downloadFolderWithToken(folderId: number, token: string): Promise<Blob> {
  const response = await get<Blob>(`/api/folders/${folderId}/download`, {
    params: { token },
    responseType: 'blob',
    headers: {
      Accept: 'application/zip',
    },
  })
  return response
}

export type FolderPreviewStats = {
  total_files: number
  total_folders: number
  total_size: number
  total_size_formatted: string
}

export type FolderPreviewFolder = {
  folder_id: number
  folder_name: string
  created_at: string
  updated_at: string
}

export type FolderPreviewFile = {
  file_id: number
  display_name: string
  file_size: number
  mime_type: string
  file_extension: string
  created_at: string
  updated_at: string
  last_opened_at: string | null
}

export type FolderPreviewContents = {
  folders: FolderPreviewFolder[]
  files: FolderPreviewFile[]
}

export type FolderPreviewData = {
  folder: FolderPreviewFolder
  stats: FolderPreviewStats
  contents: FolderPreviewContents
}

export async function getFolderPreview(folderId: number, token?: string): Promise<FolderPreviewData> {
  const config = token ? { params: { token } } : {}
  const response = await get<{ success: boolean; data: FolderPreviewData }>(`/api/folders/${folderId}/preview`, config)
  return response.data
}