import { z } from 'zod'
import { createApiResponseSchema, createNullableApiResponseSchema } from '../../core/guards'

export const ConfigItemSchema = z.object({
  config_id: z.number(),
  config_key: z.string(),
  config_value: z.string(),
})

export const ConfigsPaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_items: z.number(),
})

export const ListConfigsSuccessSchema = z.object({
  data: z.array(ConfigItemSchema),
  pagination: ConfigsPaginationSchema,
})

// List configs: backend success trả về raw { data: [...], pagination: {...} }
// Unauthorized (401) được interceptor xử lý trước; tuy nhiên đề phòng trường hợp
// backend trả envelope thì chấp nhận cả dạng envelope nullable.
export const ListConfigsEnvelopeSchema = z.union([
  createNullableApiResponseSchema(ListConfigsSuccessSchema),
  ListConfigsSuccessSchema,
])

export const ListConfigsParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
})

// Detail: backend trả về 200 với raw object {config_id,...} hoặc trong một số trường hợp (401) dạng envelope với data = null.
// Hợp nhất các khả năng để tránh INVALID_RESPONSE.
export const ConfigDetailEnvelopeSchema = z.union([
  createNullableApiResponseSchema(ConfigItemSchema), // envelope (success, data|null, error, meta)
  ConfigItemSchema, // raw success object
])

// Update
export const UpdateConfigRequestSchema = z.object({
  config_value: z.string().min(1),
})

export const UpdateConfigSuccessSchema = z.object({
  message: z.string(),
  config: ConfigItemSchema,
})

// Backend có thể trả về 2 dạng:
// 1) Dạng envelope chuẩn: { success, data: { message, config }, error?, meta? }
// 2) Dạng top-level (không có data): { success, message, config }
export const UpdateConfigEnvelopeSchema = z.union([
  createApiResponseSchema(UpdateConfigSuccessSchema),
  z.object({
    success: z.boolean(),
    message: z.string(),
    config: ConfigItemSchema,
    error: z.unknown().nullable().optional(),
    meta: z.unknown().nullable().optional(),
  }),
])

