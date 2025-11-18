import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { ConfigDetailEnvelopeSchema, ListConfigsEnvelopeSchema, UpdateConfigEnvelopeSchema, UpdateConfigRequestSchema, UpdateConfigSuccessSchema } from './config.schemas'
import type { ConfigItem, ListConfigsParams, ListConfigsSuccess, UpdateConfigRequest, UpdateConfigSuccess } from './config.types'
import { AppError } from '../../core/error'
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
  const parsed = parseWithZod(listConfigsEnvelope, response)

  // Raw success object shape
  if (parsed && typeof parsed === 'object' && 'data' in parsed && 'pagination' in parsed && !('success' in parsed)) {
    return parsed as ListConfigsSuccess
  }

  // Envelope shape with data
  if (parsed && typeof parsed === 'object' && 'success' in parsed) {
    const envelope = parsed as { success: boolean; data: unknown | null }
    if (envelope.data && typeof envelope.data === 'object') {
      const dataObj = envelope.data as ListConfigsSuccess
      if ('data' in dataObj && 'pagination' in dataObj) {
        return dataObj
      }
    }
  }

  throw new AppError('Invalid configs response', { code: 'INVALID_RESPONSE' })
}

export async function getConfigByKey(configKey: string): Promise<ConfigItem> {
  const response = await get<unknown>(`/api/admin/configs/${encodeURIComponent(configKey)}`)
  const parsed = parseWithZod(configDetailEnvelope, response)

  // Raw success object
  if (parsed && typeof parsed === 'object' && 'config_id' in parsed) {
    return parsed as ConfigItem
  }

  // Envelope with data
  if (parsed && typeof parsed === 'object' && 'data' in parsed && (parsed as any).data) {
    return (parsed as { data: ConfigItem }).data
  }

  throw new AppError('Invalid config response', { code: 'INVALID_RESPONSE' })
}

export async function updateConfigByKey(configKey: string, payload: UpdateConfigRequest): Promise<UpdateConfigSuccess> {
  const validPayload = parseWithZod(UpdateConfigRequestSchema, payload)
  const response = await put<unknown, UpdateConfigRequest>(`/api/admin/configs/${encodeURIComponent(configKey)}`, validPayload)
  const parsed = parseWithZod(updateConfigEnvelope, response)

  // Chuẩn hoá về kiểu UpdateConfigSuccess: { message, config }
  if ('data' in parsed && parsed.data) {
    return parseWithZod(UpdateConfigSuccessSchema, parsed.data)
  }

  return parseWithZod(UpdateConfigSuccessSchema, {
    message: (parsed as { message?: unknown }).message,
    config: (parsed as { config?: unknown }).config,
  })
}


