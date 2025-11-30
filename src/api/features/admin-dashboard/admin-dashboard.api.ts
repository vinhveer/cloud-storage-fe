import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { AdminDashboardOverviewEnvelopeSchema } from './admin-dashboard.schemas'
import type {
  AdminDashboardOverview,
  AdminDashboardOverviewEnvelope,
} from './admin-dashboard.types'

const adminDashboardOverviewEnvelope = AdminDashboardOverviewEnvelopeSchema

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  const response = await get<unknown>('/api/admin/dashboard')
  const parsed = parseWithZod<AdminDashboardOverviewEnvelope>(adminDashboardOverviewEnvelope, response)
  return parsed.data
}

