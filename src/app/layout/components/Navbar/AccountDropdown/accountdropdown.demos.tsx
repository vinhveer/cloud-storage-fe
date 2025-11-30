import { useState } from 'react'
import AccountDropdown from '@/app/layout/components/Navbar/AccountDropdown/AccountDropdown'

export function AccountDropdownDemoControlled() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center justify-end gap-3 p-6">
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        onClick={() => setOpen((v) => !v)}
      >
        Toggle
      </button>
      <AccountDropdown
        userName="Jane Doe"
        userEmail="jane@example.com"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}


