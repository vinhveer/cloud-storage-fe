import { useMutation, useQueryClient } from '@tanstack/react-query'
import { copyFolder, createFolder, deleteFolder, downloadFolder, moveFolder, updateFolder } from './folder.api'
import type {
  CreateFolderRequest,
  CreateFolderSuccess,
  CopyFolderRequest,
  CopyFolderSuccess,
  DeleteFolderSuccess,
  MoveFolderSuccess,
  UpdateFolderRequest,
  UpdateFolderSuccess,
} from './folder.types'
import type { AppError } from '../../core/error'

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation<CreateFolderSuccess, AppError, CreateFolderRequest>({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false })
    },
  })
}

export type MoveFolderVariables = {
  folderId: number
  target_folder_id: number | null
}

export function useMoveFolder() {
  const queryClient = useQueryClient()

  return useMutation<MoveFolderSuccess, AppError, MoveFolderVariables>({
    mutationFn: variables =>
      moveFolder(variables.folderId, {
        target_folder_id: variables.target_folder_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false })
    },
  })
}

export type UpdateFolderVariables = {
  folderId: number
  folder_name: string
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()

  return useMutation<UpdateFolderSuccess, AppError, UpdateFolderVariables>({
    mutationFn: variables =>
      updateFolder(variables.folderId, {
        folder_name: variables.folder_name,
      } as UpdateFolderRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation<DeleteFolderSuccess, AppError, number>({
    mutationFn: folderId => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false })
    },
  })
}

export type CopyFolderVariables = {
  folderId: number
  target_folder_id: number | null
}

export function useCopyFolder() {
  const queryClient = useQueryClient()

  return useMutation<CopyFolderSuccess, AppError, CopyFolderVariables>({
    mutationFn: variables =>
      copyFolder(variables.folderId, {
        target_folder_id: variables.target_folder_id,
      } as CopyFolderRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'], exact: false })
      queryClient.invalidateQueries({ queryKey: ['folder-tree'] })
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false })
    },
  })
}

export function useDownloadFolder() {
  return useMutation<Blob, AppError, number>({
    mutationFn: (folderId: number) => downloadFolder(folderId),
  })
}


