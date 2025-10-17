import React from 'react'
import StorageUsage from '@/components/StorageUsage/StorageUsage'

export function StorageUsageBasicDemo() {
  return (
    <div className="grid gap-4">
      <StorageUsage used={12.34} total={50} />
      <StorageUsage used={50} total={50} />
      <StorageUsage used={0} total={50} />
    </div>
  )
}

export function StorageUsageVariantsDemo() {
  return (
    <div className="grid gap-4">
      <StorageUsage used={32} total={100} colorClassName="bg-blue-600" />
      <StorageUsage used={32} total={100} colorClassName="bg-emerald-600" />
      <StorageUsage used={32} total={100} colorClassName="bg-amber-500" />
      <StorageUsage used={85} total={100} colorClassName="bg-rose-600" />
    </div>
  )
}


