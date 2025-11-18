import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { ConfigDetailEnvelopeSchema, ListConfigsEnvelopeSchema, UpdateConfigEnvelopeSchema, UpdateConfigRequestSchema } from './config.schemas'
import type { ConfigDetailEnvelope, ConfigItem, ListConfigsEnvelope, ListConfigsParams, ListConfigsSuccess, UpdateConfigEnvelope, UpdateConfigRequest, UpdateConfigSuccess } from './config.types'
import { put } from '../../core/fetcher'

const listConfigsEnvelope = ListConfigsEnvelopeSchema
const configDetailEnvelope = ConfigDetailEnvelopeSchema
const updateConfigEnvelope = UpdateConfigEnvelopeSchema

export async function listConfigs(params: ListConfigsParams = {}): Promise<ListConfigsSuccess> {
  const response = await get<unknown>('/api/admin/configs', {
    params: {
      search: params.search,
      page: params.page,
      per_page: params.per_page,
    },
  })
  const parsed = parseWithZod<ListConfigsEnvelope>(listConfigsEnvelope, response)
  return parsed.data
}

export async function getConfigByKey(configKey: string): Promise<ConfigItem> {
  const response = await get<unknown>(`/api/admin/configs/${encodeURIComponent(configKey)}`)
  const parsed = parseWithZod<ConfigDetailEnvelope>(configDetailEnvelope, response)
  return parsed.data
}

export async function updateConfigByKey(configKey: string, payload: UpdateConfigRequest): Promise<UpdateConfigSuccess> {
  const validPayload = parseWithZod(UpdateConfigRequestSchema, payload)
  const response = await put<unknown, UpdateConfigRequest>(`/api/admin/configs/${encodeURIComponent(configKey)}`, validPayload)
  const parsed = parseWithZod<UpdateConfigEnvelope>(updateConfigEnvelope, response)
  return parsed.data
}


