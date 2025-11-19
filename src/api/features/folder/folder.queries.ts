import { useQuery } from '@tanstack/react-query'
import {
  getFolderBreadcrumb,
  getFolderContents,
  getFolderDetail,
  getFolderTree,
  listFolders,
  type ListFoldersParams,
} from './folder.api'
import type { FolderBreadcrumbSuccess, FolderDetail, FolderTreeSuccess, ListFoldersSuccess } from './folder.types'
import type { AppError } from '../../core/error'

export function useFolderTree() {
  return useQuery<FolderTreeSuccess, AppError>({
    queryKey: ['folder-tree'],
    queryFn: () => getFolderTree(),
  })
}

export function useListFolders(params: ListFoldersParams = {}) {
  const { parent_id, page, per_page } = params

  return useQuery<ListFoldersSuccess, AppError>({
    queryKey: ['folders', parent_id, page, per_page],
    queryFn: () => listFolders(params),
  })
}

export type FolderBreadcrumbParams = {
  folderId: number
}

export function useFolderBreadcrumb(params: FolderBreadcrumbParams) {
  const { folderId } = params

  return useQuery<FolderBreadcrumbSuccess, AppError>({
    queryKey: ['folder-breadcrumb', folderId],
    queryFn: () => getFolderBreadcrumb(folderId),
    enabled: Number.isFinite(folderId) && folderId > 0,
  })
}

export type FolderDetailParams = {
  folderId: number
}

export function useFolderDetail(params: FolderDetailParams) {
  const { folderId } = params

  return useQuery<FolderDetail, AppError>({
    queryKey: ['folder-detail', folderId],
    queryFn: () => getFolderDetail(folderId),
    enabled: Number.isFinite(folderId) && folderId > 0,
  })
}

type FolderContentsSuccess = Awaited<ReturnType<typeof getFolderContents>>

export type FolderContentsParams = {
  folderId: number
}

export function useFolderContents(params: FolderContentsParams) {
  const { folderId } = params

  return useQuery<FolderContentsSuccess, AppError>({
    queryKey: ['folder-contents', folderId],
    queryFn: () => getFolderContents(folderId),
    enabled: Number.isFinite(folderId) && folderId >= 0,
  })
}


