import { get, post, deleteRequest } from '../../core/fetcher'
import { parseWithZod, createApiResponseSchema } from '../../core/guards'
import {
  TrashListDataSchema,
  TrashFolderContentsDataSchema,
  RestoreTrashItemRequestSchema,
  RestoreTrashItemSuccessSchema,
  DeleteTrashItemRequestSchema,
  DeleteTrashItemSuccessSchema,
  EmptyTrashSuccessSchema,
} from './trash.schemas'
import type {
  TrashListSuccess,
  TrashFolderContentsSuccess,
  RestoreTrashItemRequest,
  RestoreTrashItemSuccess,
  DeleteTrashItemRequest,
  DeleteTrashItemSuccess,
  EmptyTrashSuccess,
} from './trash.types'

const trashListEnvelope = createApiResponseSchema(TrashListDataSchema)
const trashFolderContentsEnvelope = createApiResponseSchema(TrashFolderContentsDataSchema)
const restoreTrashItemEnvelope = createApiResponseSchema(RestoreTrashItemSuccessSchema)
const deleteTrashItemEnvelope = createApiResponseSchema(DeleteTrashItemSuccessSchema)
const emptyTrashEnvelope = createApiResponseSchema(EmptyTrashSuccessSchema)

export type ListTrashParams = {
  search?: string
  page?: number
  per_page?: number
}

export async function listTrash(params: ListTrashParams = {}): Promise<TrashListSuccess> {
  const response = await get<unknown>('/api/trash', {
    params: {
      search: params.search,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod(trashListEnvelope, response)
  return parsed.data
}

export type GetTrashFolderContentsParams = {
  search?: string
  page?: number
  per_page?: number
}

export async function getTrashFolderContents(
  folderId: number,
  params: GetTrashFolderContentsParams = {},
): Promise<TrashFolderContentsSuccess> {
  const response = await get<unknown>(`/api/trash/folders/${folderId}/contents`, {
    params: {
      search: params.search,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod(trashFolderContentsEnvelope, response)
  return parsed.data
}

export async function restoreTrashItem(
  id: number,
  payload: RestoreTrashItemRequest,
): Promise<RestoreTrashItemSuccess> {
  const validPayload = parseWithZod(RestoreTrashItemRequestSchema, payload)
  const response = await post<unknown, RestoreTrashItemRequest>(
    `/api/trash/${id}/restore`,
    validPayload,
  )
  const parsed = parseWithZod(restoreTrashItemEnvelope, response)
  return parsed.data
}

export async function deleteTrashItem(
  id: number,
  payload: DeleteTrashItemRequest,
): Promise<DeleteTrashItemSuccess> {
  const validPayload = parseWithZod(DeleteTrashItemRequestSchema, payload)
  const response = await deleteRequest<unknown>(`/api/trash/${id}`, {
    data: validPayload,
  })
  const parsed = parseWithZod(deleteTrashItemEnvelope, response)
  return parsed.data
}

export async function emptyTrash(): Promise<EmptyTrashSuccess> {
  const response = await deleteRequest<unknown>('/api/trash/empty')
  const parsed = parseWithZod(emptyTrashEnvelope, response)
  return parsed.data
}
