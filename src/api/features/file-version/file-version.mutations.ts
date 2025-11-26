import { useMutation } from '@tanstack/react-query'
import { restoreFileVersion, uploadFileVersion } from './file-version.api'
import type { RestoreFileVersionSuccess, UploadFileVersionSuccess } from './file-version.types'
import type { AppError } from '../../core/error'

export type UploadFileVersionVariables = {
  fileId: number
  action: string
  notes?: string
  file: File
}

export function useUploadFileVersion() {
  return useMutation<UploadFileVersionSuccess, AppError, UploadFileVersionVariables>({
    mutationFn: variables =>
      uploadFileVersion(variables.fileId, {
        action: variables.action,
        notes: variables.notes,
        file: variables.file,
      }),
  })
}

export type RestoreFileVersionVariables = {
  fileId: number
  versionId: number
}

export function useRestoreFileVersion() {
  return useMutation<RestoreFileVersionSuccess, AppError, RestoreFileVersionVariables>({
    mutationFn: variables => restoreFileVersion(variables.fileId, variables.versionId),
  })
}


