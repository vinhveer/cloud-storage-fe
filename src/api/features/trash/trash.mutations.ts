import { useMutation } from '@tanstack/react-query'
import { restoreTrashItem, deleteTrashItem, emptyTrash } from './trash.api'
import type { RestoreTrashItemSuccess, DeleteTrashItemSuccess, EmptyTrashSuccess } from './trash.types'
import type { AppError } from '../../core/error'

export type RestoreTrashItemVariables = {
  id: number
  type: 'file' | 'folder'
}

export function useRestoreTrashItem() {
  return useMutation<RestoreTrashItemSuccess, AppError, RestoreTrashItemVariables>({
    mutationFn: variables =>
      restoreTrashItem(variables.id, {
        type: variables.type,
      }),
  })
}

export type DeleteTrashItemVariables = {
  id: number
  type: 'file' | 'folder'
}

export function useDeleteTrashItem() {
  return useMutation<DeleteTrashItemSuccess, AppError, DeleteTrashItemVariables>({
    mutationFn: variables =>
      deleteTrashItem(variables.id, {
        type: variables.type,
      }),
  })
}

export function useEmptyTrash() {
  return useMutation<EmptyTrashSuccess, AppError, void>({
    mutationFn: () => emptyTrash(),
  })
}

