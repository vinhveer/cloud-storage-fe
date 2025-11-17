import { useQuery } from '@tanstack/react-query'
import { getFileDetail, getFilePreview, getRecentFiles, listFiles } from './file.api'
import type { FileDetail, FilePreviewSuccess, ListFilesParams, ListFilesSuccess, RecentFilesSuccess } from './file.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useListFiles(params: ListFilesParams = {}) {
  const listParams: ListParams = {
    page: params.page,
    limit: params.per_page,
    search: params.search,
    filters: {
      folder_id: params.folder_id,
      extension: params.extension,
    },
  }

  return useQuery<ListFilesSuccess, AppError>({
    queryKey: qk.file.list(listParams),
    queryFn: () => listFiles(params),
  })
}

export function useFileDetail(fileId: number | undefined) {
  return useQuery<FileDetail, AppError>({
    queryKey: qk.file.byId(String(fileId)),
    queryFn: () => {
      if (fileId === undefined) {
        throw new Error('fileId is required')
      }
      return getFileDetail(fileId)
    },
    enabled: fileId !== undefined,
  })
}

export function useRecentFiles(limit?: number) {
  return useQuery<RecentFilesSuccess, AppError>({
    queryKey: ['files', 'recent', { limit }],
    queryFn: () => getRecentFiles(limit),
  })
}

export function useFilePreview(fileId: number | undefined) {
  return useQuery<FilePreviewSuccess, AppError>({
    queryKey: ['file', 'preview', String(fileId)],
    queryFn: () => {
      if (fileId === undefined) {
        throw new Error('fileId is required')
      }
      return getFilePreview(fileId)
    },
    enabled: fileId !== undefined,
  })
}


