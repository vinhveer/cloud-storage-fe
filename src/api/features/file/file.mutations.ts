import { useMutation } from '@tanstack/react-query'
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
  return useMutation<UploadFileSuccess, AppError, UploadFileRequest>({
    mutationFn: uploadFile,
  })
}

export type MoveFileVariables = {
  fileId: number
  destinationFolderId?: number
}

export function useMoveFile() {
  return useMutation<MoveFileSuccess, AppError, MoveFileVariables>({
    mutationFn: variables =>
      moveFile(variables.fileId, {
        destination_folder_id: variables.destinationFolderId,
      }),
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
  return useMutation<UpdateFileSuccess, AppError, UpdateFileVariables>({
    mutationFn: variables =>
      updateFile(variables.fileId, {
        display_name: variables.displayName,
        folder_id: variables.folderId,
      }),
  })
}

export function useDeleteFile() {
  return useMutation<DeleteFileSuccess, AppError, number>({
    mutationFn: fileId => deleteFile(fileId),
  })
}

export type CopyFileVariables = {
  fileId: number
  destinationFolderId?: number | null
  onlyLatest?: boolean
}

export function useCopyFile() {
  return useMutation<CopyFileSuccess, AppError, CopyFileVariables>({
    mutationFn: variables =>
      copyFile(variables.fileId, {
        destination_folder_id: variables.destinationFolderId ?? null,
        only_latest: variables.onlyLatest,
      }),
  })
}

export type DeleteFileVersionVariables = {
  fileId: number
  versionId: number
}

export function useDeleteFileVersion() {
  return useMutation<DeleteFileVersionSuccess, AppError, DeleteFileVersionVariables>({
    mutationFn: variables => deleteFileVersion(variables.fileId, variables.versionId),
  })
}


