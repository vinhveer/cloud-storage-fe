import { useQuery } from '@tanstack/react-query'
import {
  listTrash,
  getTrashFolderContents,
  type ListTrashParams,
  type GetTrashFolderContentsParams,
} from './trash.api'
import type { TrashListSuccess, TrashFolderContentsSuccess } from './trash.types'
import type { AppError } from '../../core/error'

export function useTrash(params: ListTrashParams = {}) {
  return useQuery<TrashListSuccess, AppError>({
    queryKey: ['trash', params],
    queryFn: () => listTrash(params),
  })
}

export function useTrashFolderContents(
  folderId: number | undefined,
  params: GetTrashFolderContentsParams = {},
) {
  return useQuery<TrashFolderContentsSuccess, AppError>({
    queryKey: ['trash-folder-contents', folderId, params],
    enabled: folderId !== undefined,
    queryFn: () => {
      if (folderId === undefined) {
        throw new Error('folderId is required')
      }
      return getTrashFolderContents(folderId, params)
    },
  })
}

