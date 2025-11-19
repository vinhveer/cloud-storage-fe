import { useMutation } from '@tanstack/react-query'
import { downloadFileVersion } from './file-version.api'
import type { AppError } from '../../core/error'

export type DownloadFileVersionVariables = {
  fileId: number
  versionId: number
}

export function useDownloadFileVersion() {
  return useMutation<Blob, AppError, DownloadFileVersionVariables>({
    mutationFn: variables => downloadFileVersion(variables.fileId, variables.versionId),
  })
}


