import { get } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { DashboardEnvelopeSchema } from './dashboard.schemas'
import type { DashboardEnvelope, DashboardSuccess } from './dashboard.types'

const dashboardEnvelope = DashboardEnvelopeSchema

export async function getAdminDashboard(): Promise<DashboardSuccess> {
  const response = await get<unknown>('/api/admin/dashboard')
  const parsed = parseWithZod<DashboardEnvelope>(dashboardEnvelope, response)
  return parsed.data
}


