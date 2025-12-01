import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatNumber } from '../utils'

type FileExtensionStat = {
  extension: string
  count: number
}

type FileExtensionChartProps = {
  data: FileExtensionStat[]
}

export default function FileExtensionChart({ data }: FileExtensionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
        No data available
      </div>
    )
  }

  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .map(stat => ({
      extension: stat.extension || '(no extension)',
      count: stat.count,
      percentage: data.reduce((sum, s) => sum + s.count, 0) > 0
        ? ((stat.count / data.reduce((sum, s) => sum + s.count, 0)) * 100).toFixed(1)
        : '0',
    }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 rounded-lg shadow-lg p-3 border border-gray-700">
          <p className="text-sm font-medium mb-1">{data.extension}</p>
          <p className="text-sm">
            <span className="text-purple-400">Files: </span>
            <span className="font-semibold">{formatNumber(data.count)}</span>
          </p>
          <p className="text-sm">
            <span className="text-purple-400">Percentage: </span>
            <span className="font-semibold">{data.percentage}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const getBarColor = (index: number) => {
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe']
    return colors[index % colors.length]
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="extension"
            angle={-45}
            textAnchor="end"
            height={80}
            className="text-xs fill-gray-600 dark:fill-gray-400"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            className="text-xs fill-gray-600 dark:fill-gray-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {sortedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
