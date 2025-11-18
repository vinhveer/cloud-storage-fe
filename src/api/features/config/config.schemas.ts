import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

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

export const ListConfigsEnvelopeSchema = createApiResponseSchema(ListConfigsSuccessSchema)

export const ListConfigsParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
})

// Detail
export const ConfigDetailEnvelopeSchema = createApiResponseSchema(ConfigItemSchema)

// Update
export const UpdateConfigRequestSchema = z.object({
  config_value: z.string().min(1),
})

export const UpdateConfigSuccessSchema = z.object({
  message: z.string(),
  config: ConfigItemSchema,
})

export const UpdateConfigEnvelopeSchema = createApiResponseSchema(UpdateConfigSuccessSchema)

