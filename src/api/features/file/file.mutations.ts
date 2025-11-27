import { useMutation, useQueryClient } from '@tanstack/react-query'
import { copyFile, deleteFile, deleteFileVersion, downloadFile, moveFile, updateFile, uploadFile } from './file.api'
import type {
  CopyFileSuccess,
  DeleteFileSuccess,
  MoveFileSuccess,
  UploadFileRequest,
  UploadFileSuccess,
  UpdateFileSuccess,
  DeleteFileVersionSuccess,
} from './file.types'
import type { AppError } from '../../core/error'

export function useUploadFile() {
  const queryClient = useQueryClient()

  return useMutation<UploadFileSuccess, AppError, UploadFileRequest>({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['files'], exact: false })
    },
  })
}

export type MoveFileVariables = {
  fileId: number
  destinationFolderId?: number
}

export function useMoveFile() {
  const queryClient = useQueryClient()

  return useMutation<MoveFileSuccess, AppError, MoveFileVariables>({
    mutationFn: variables =>
      moveFile(variables.fileId, {
        destination_folder_id: variables.destinationFolderId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['files'], exact: false })
    },
  })
}

export function useDownloadFile() {
  return useMutation<Blob, AppError, number>({
    mutationFn: fileId => downloadFile(fileId),
  })
}

export type UpdateFileVariables = {
  fileId: number
  displayName?: string
  folderId?: number
}

export function useUpdateFile() {
  const queryClient = useQueryClient()

  return useMutation<UpdateFileSuccess, AppError, UpdateFileVariables>({
    mutationFn: variables =>
      updateFile(variables.fileId, {
        display_name: variables.displayName,
        folder_id: variables.folderId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['files'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['file'], exact: false })
    },
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation<DeleteFileSuccess, AppError, number>({
    mutationFn: fileId => deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['files'], exact: false })
    },
  })
}

export type CopyFileVariables = {
  fileId: number
  destinationFolderId?: number | null
  onlyLatest?: boolean
}

export function useCopyFile() {
  const queryClient = useQueryClient()

  return useMutation<CopyFileSuccess, AppError, CopyFileVariables>({
    mutationFn: variables =>
      copyFile(variables.fileId, {
        destination_folder_id: variables.destinationFolderId ?? null,
        only_latest: variables.onlyLatest,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['files'], exact: false })
    },
  })
}

export type DeleteFileVersionVariables = {
  fileId: number
  versionId: number
}

export function useDeleteFileVersion() {
  const queryClient = useQueryClient()

  return useMutation<DeleteFileVersionSuccess, AppError, DeleteFileVersionVariables>({
    mutationFn: variables => deleteFileVersion(variables.fileId, variables.versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['file'], exact: false })
    },
  })
}


