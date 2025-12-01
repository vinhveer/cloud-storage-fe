import TableData from '@/components/TableData'
import { createColumns } from '@/components/Table/createColumns'
import type { TableRecentUser } from '../hooks/useAdminOverview'

type RecentUsersTableProps = {
  users: TableRecentUser[]
}

export default function RecentUsersTable({ users }: RecentUsersTableProps) {
  const columns = createColumns<TableRecentUser>({
    user_id: { label: 'ID', align: 'center' as const },
    name: { label: 'Name' },
    email: { label: 'Email' },
    created_at: { label: 'Created At' },
  })

  columns.forEach(col => {
    if (col.key === 'created_at') {
      col.render = (value: string | number) => {
        const date = new Date(value as string)
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      }
    }
  })

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400">No users</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <TableData<TableRecentUser>
        columns={columns}
        data={users}
        emptyMessage="No users"
        enableContextMenu={false}
      />
    </div>
  )
}

