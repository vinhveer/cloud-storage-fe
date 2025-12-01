import { useState, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { formatBytes } from '../utils'

type StorageTimelinePoint = {
  date: string
  total_storage_used: number
}

type StorageTimelineChartProps = {
  data: StorageTimelinePoint[]
  onDateRangeChange?: (start: string, end: string) => void
}

export default function StorageTimelineChart({ data, onDateRangeChange }: StorageTimelineChartProps) {
  const [startDrag, setStartDrag] = useState<number | null>(null)
  const [endDrag, setEndDrag] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null)
  const chartRef = useRef<any>(null)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
        No data available
      </div>
    )
  }

  const chartData = data.map(point => ({
    date: point.date,
    dateFormatted: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    storage: point.total_storage_used,
  }))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 rounded-lg shadow-lg p-3 border border-gray-700">
          <p className="text-sm font-medium mb-1">{formatDate(payload[0].payload.date)}</p>
          <p className="text-sm">
            <span className="text-blue-400">Storage: </span>
            <span className="font-semibold">{formatBytes(payload[0].value)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const handleMouseDown = (e: any) => {
    if (!chartRef.current || !onDateRangeChange) return
    const chartContainer = chartRef.current.container
    if (!chartContainer) return

    const rect = chartContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = (x / rect.width) * 100

    if (startDrag === null) {
      setStartDrag(percent)
      setIsDragging('start')
    } else if (endDrag === null || percent > startDrag) {
      setEndDrag(percent)
      setIsDragging('end')
    } else {
      setStartDrag(percent)
      setIsDragging('start')
    }
  }

  const handleMouseMove = (e: any) => {
    if (!isDragging || !chartRef.current || !onDateRangeChange) return
    const chartContainer = chartRef.current.container
    if (!chartContainer) return

    const rect = chartContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))

    if (isDragging === 'start') {
      const newStart = Math.min(percent, endDrag !== null ? endDrag - 1 : 100)
      setStartDrag(newStart)
      if (endDrag !== null) {
        const startDate = getDateFromPercent(newStart)
        const endDate = getDateFromPercent(endDrag)
        if (startDate && endDate) {
          onDateRangeChange(startDate, endDate)
        }
      }
    } else {
      const newEnd = Math.max(percent, startDrag !== null ? startDrag + 1 : 0)
      setEndDrag(newEnd)
      if (startDrag !== null) {
        const startDate = getDateFromPercent(startDrag)
        const endDate = getDateFromPercent(newEnd)
        if (startDate && endDate) {
          onDateRangeChange(startDate, endDate)
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  const getDateFromPercent = (percent: number): string | null => {
    if (!chartData.length) return null
    const index = Math.round((percent / 100) * (chartData.length - 1))
    return chartData[Math.max(0, Math.min(chartData.length - 1, index))]?.date || null
  }

  const startDate = startDrag !== null ? getDateFromPercent(startDrag) : null
  const endDate = endDrag !== null ? getDateFromPercent(endDrag) : null

  return (
    <div className="w-full">
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-crosshair"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            ref={chartRef}
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="dateFormatted"
              className="text-xs fill-gray-600 dark:fill-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              className="text-xs fill-gray-600 dark:fill-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatBytes(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="storage"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorStorage)"
            />
            {startDrag !== null && (
              <ReferenceLine
                x={startDate ? chartData.findIndex(d => d.date === startDate) : undefined}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
            {endDrag !== null && (
              <ReferenceLine
                x={endDate ? chartData.findIndex(d => d.date === endDate) : undefined}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {startDate && endDate && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          <span className="font-medium">Selected range:</span> {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      )}
    </div>
  )
}
