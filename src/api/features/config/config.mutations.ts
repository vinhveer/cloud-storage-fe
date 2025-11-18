import { useMutation } from '@tanstack/react-query'
import { updateConfigByKey } from './config.api'
import type { AppError } from '../../core/error'
import type { UpdateConfigRequest, UpdateConfigSuccess } from './config.types'

export function useUpdateConfigByKey(configKey: string) {
  return useMutation<UpdateConfigSuccess, AppError, UpdateConfigRequest>({
    mutationFn: (payload) => updateConfigByKey(configKey, payload),
  })
}


