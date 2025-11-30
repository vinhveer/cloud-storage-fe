import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { UserDashboardOverviewEnvelopeSchema, UserDashboardStatsEnvelopeSchema } from './user-dashboard.schemas'
import type {
  UserDashboardOverview,
  UserDashboardOverviewEnvelope,
  UserDashboardStats,
  UserDashboardStatsEnvelope,
} from './user-dashboard.types'

const userDashboardOverviewEnvelope = UserDashboardOverviewEnvelopeSchema
const userDashboardStatsEnvelope = UserDashboardStatsEnvelopeSchema

export async function getUserDashboardOverview(): Promise<UserDashboardOverview> {
  const response = await get<unknown>('/api/dashboard')
  const parsed = parseWithZod<UserDashboardOverviewEnvelope>(userDashboardOverviewEnvelope, response)
  return parsed.data
}

export type UserDashboardStatsParams = {
  start_date?: string
  end_date?: string
}

export async function getUserDashboardStats(params: UserDashboardStatsParams = {}): Promise<UserDashboardStats> {
  const response = await get<unknown>('/api/dashboard/stats', {
    params: {
      start_date: params.start_date,
      end_date: params.end_date,
    },
  })
  const parsed = parseWithZod<UserDashboardStatsEnvelope>(userDashboardStatsEnvelope, response)
  return parsed.data
}

