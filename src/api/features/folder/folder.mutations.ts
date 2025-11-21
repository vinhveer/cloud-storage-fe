import { useMutation } from '@tanstack/react-query'
import { copyFolder, createFolder, deleteFolder, moveFolder, updateFolder } from './folder.api'
import type {
  CreateFolderRequest,
  CreateFolderSuccess,
  CopyFolderRequest,
  CopyFolderSuccess,
  DeleteFolderSuccess,
  MoveFolderRequest,
  MoveFolderSuccess,
  UpdateFolderRequest,
  UpdateFolderSuccess,
} from './folder.types'
import type { AppError } from '../../core/error'

export function useCreateFolder() {
  return useMutation<CreateFolderSuccess, AppError, CreateFolderRequest>({
    mutationFn: createFolder,
  })
}

export type MoveFolderVariables = {
  folderId: number
  target_folder_id: number | null
}

export function useMoveFolder() {
  return useMutation<MoveFolderSuccess, AppError, MoveFolderVariables>({
    mutationFn: variables =>
      moveFolder(variables.folderId, {
        target_folder_id: variables.target_folder_id,
      }),
  })
}

export type UpdateFolderVariables = {
  folderId: number
  folder_name: string
}

export function useUpdateFolder() {
  return useMutation<UpdateFolderSuccess, AppError, UpdateFolderVariables>({
    mutationFn: variables =>
      updateFolder(variables.folderId, {
        folder_name: variables.folder_name,
      } as UpdateFolderRequest),
  })
}

export function useDeleteFolder() {
  return useMutation<DeleteFolderSuccess, AppError, number>({
    mutationFn: folderId => deleteFolder(folderId),
  })
}

export type CopyFolderVariables = {
  folderId: number
  target_folder_id: number | null
}

export function useCopyFolder() {
  return useMutation<CopyFolderSuccess, AppError, CopyFolderVariables>({
    mutationFn: variables =>
      copyFolder(variables.folderId, {
        target_folder_id: variables.target_folder_id,
      } as CopyFolderRequest),
  })
}


