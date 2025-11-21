import { useQuery } from '@tanstack/react-query'
import { getFileVersionDetail, listFileVersions } from './file-version.api'
import type { FileVersionDetail, ListFileVersionsSuccess } from './file-version.types'
import type { AppError } from '../../core/error'

export type ListFileVersionsParams = {
  fileId: number
  page?: number
  perPage?: number
}

export function useFileVersions(params: ListFileVersionsParams) {
  const { fileId, page, perPage } = params

  return useQuery<ListFileVersionsSuccess, AppError>({
    queryKey: ['file-versions', fileId, page, perPage],
    queryFn: () =>
      listFileVersions(fileId, {
        page,
        per_page: perPage,
      }),
    enabled: Number.isFinite(fileId) && fileId > 0,
  })
}

export type FileVersionDetailParams = {
  fileId: number
  versionId: number
}

export function useFileVersionDetail(params: FileVersionDetailParams) {
  const { fileId, versionId } = params

  return useQuery<FileVersionDetail, AppError>({
    queryKey: ['file-version-detail', fileId, versionId],
    queryFn: () => getFileVersionDetail(fileId, versionId),
    enabled: Number.isFinite(fileId) && fileId > 0 && Number.isFinite(versionId) && versionId > 0,
  })
}


