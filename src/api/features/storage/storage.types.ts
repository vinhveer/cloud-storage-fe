import { z } from 'zod'
import {
  StorageOverviewEnvelopeSchema,
  StorageOverviewFormattedSchema,
  StorageOverviewSuccessSchema,
  SystemOverviewSchema,
} from './storage.schemas'

export type StorageOverviewFormatted = z.infer<typeof StorageOverviewFormattedSchema>
export type SystemOverview = z.infer<typeof SystemOverviewSchema>
export type StorageOverviewSuccess = z.infer<typeof StorageOverviewSuccessSchema>
export type StorageOverviewEnvelope = z.infer<typeof StorageOverviewEnvelopeSchema>


