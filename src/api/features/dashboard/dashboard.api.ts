import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { DashboardOverviewEnvelopeSchema, DashboardStatsEnvelopeSchema } from './dashboard.schemas'
import type {
  DashboardOverview,
  DashboardOverviewEnvelope,
  DashboardStats,
  DashboardStatsEnvelope,
} from './dashboard.types'

const dashboardOverviewEnvelope = DashboardOverviewEnvelopeSchema
const dashboardStatsEnvelope = DashboardStatsEnvelopeSchema

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await get<unknown>('/api/dashboard')
  const parsed = parseWithZod<DashboardOverviewEnvelope>(dashboardOverviewEnvelope, response)
  return parsed.data
}

export type DashboardStatsParams = {
  start_date?: string
  end_date?: string
}

export async function getDashboardStats(params: DashboardStatsParams = {}): Promise<DashboardStats> {
  const response = await get<unknown>('/api/dashboard/stats', {
    params: {
      start_date: params.start_date,
      end_date: params.end_date,
    },
  })
  const parsed = parseWithZod<DashboardStatsEnvelope>(dashboardStatsEnvelope, response)
  return parsed.data
}


