import { useQuery } from '@tanstack/react-query'
import {
  getPublicLinkDetail,
  getPublicLinkPreview,
  getPublicLinkDownload,
  getFilePublicLinks,
  listPublicLinks,
  type ListPublicLinksParams,
} from './public-link.api'
import type { AppError } from '../../core/error'
import type {
  ListPublicLinksSuccess,
  PublicLinkDetail,
  PublicLinkPreviewData,
  PublicLinkDownloadData,
  FilePublicLinksData,
} from './public-link.types'

export function usePublicLinks(params: ListPublicLinksParams) {
  return useQuery<ListPublicLinksSuccess, AppError>({
    queryKey: ['public-links', params],
    queryFn: () => listPublicLinks(params),
  })
}

export function usePublicLinkDetail(token: string | null) {
  return useQuery<PublicLinkDetail, AppError>({
    queryKey: ['public-link-detail', token],
    enabled: !!token,
    queryFn: () => {
      if (!token) {
        throw new Error('Token is required')
      }
      return getPublicLinkDetail(token)
    },
  })
}

export function usePublicLinkPreview(token: string | null) {
  return useQuery<PublicLinkPreviewData, AppError>({
    queryKey: ['public-link-preview', token],
    enabled: !!token,
    queryFn: () => {
      if (!token) {
        throw new Error('Token is required')
      }
      return getPublicLinkPreview(token)
    },
  })
}

export function usePublicLinkDownload(token: string | null) {
  return useQuery<PublicLinkDownloadData, AppError>({
    queryKey: ['public-link-download', token],
    enabled: !!token,
    queryFn: () => {
      if (!token) {
        throw new Error('Token is required')
      }
      return getPublicLinkDownload(token)
    },
  })
}

export function useFilePublicLinks(fileId: number | undefined) {
  return useQuery<FilePublicLinksData, AppError>({
    queryKey: ['file-public-links', fileId],
    enabled: fileId !== undefined,
    queryFn: () => {
      if (fileId === undefined) {
        throw new Error('fileId is required')
      }
      return getFilePublicLinks(fileId)
    },
  })
}


