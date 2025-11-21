import { z } from 'zod'
import {
  ConfigItemSchema,
  ConfigsPaginationSchema,
  ListConfigsEnvelopeSchema,
  ListConfigsParamsSchema,
  ListConfigsSuccessSchema,
  ConfigDetailEnvelopeSchema,
  UpdateConfigEnvelopeSchema,
  UpdateConfigRequestSchema,
  UpdateConfigSuccessSchema,
} from './config.schemas'

export type ConfigItem = z.infer<typeof ConfigItemSchema>
export type ConfigsPagination = z.infer<typeof ConfigsPaginationSchema>
export type ListConfigsSuccess = z.infer<typeof ListConfigsSuccessSchema>
export type ListConfigsEnvelope = z.infer<typeof ListConfigsEnvelopeSchema>
export type ListConfigsParams = z.infer<typeof ListConfigsParamsSchema>
export type ConfigDetailEnvelope = z.infer<typeof ConfigDetailEnvelopeSchema>
export type UpdateConfigRequest = z.infer<typeof UpdateConfigRequestSchema>
export type UpdateConfigSuccess = z.infer<typeof UpdateConfigSuccessSchema>
export type UpdateConfigEnvelope = z.infer<typeof UpdateConfigEnvelopeSchema>


