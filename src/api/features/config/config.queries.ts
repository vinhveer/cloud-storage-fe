import { useQuery } from '@tanstack/react-query'
import { getConfigByKey, listConfigs } from './config.api'
import type { ConfigItem, ListConfigsParams, ListConfigsSuccess } from './config.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useListConfigs(params: ListConfigsParams = {}) {
  const listParams: ListParams = {
    page: params.page,
    limit: params.per_page,
    search: params.search,
  }

  return useQuery<ListConfigsSuccess, AppError>({
    queryKey: qk.config.list(listParams),
    queryFn: () => listConfigs(params),
  })
}

export function useConfigByKey(configKey: string | undefined) {
  return useQuery<ConfigItem, AppError>({
    queryKey: ['config', 'detail', configKey ?? ''],
    queryFn: () => {
      if (!configKey) {
        throw new Error('configKey is required')
      }
      return getConfigByKey(configKey)
    },
    enabled: !!configKey,
  })
}


