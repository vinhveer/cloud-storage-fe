import React from 'react'
import Dialog from '@/components/Dialog'

export function DialogBasicDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="space-y-2">
      <button className="btn btn-primary btn-md" onClick={() => setOpen(true)}>
        Open Dialog
      </button>
      <Dialog
        title="Confirm Action"
        confirmText="Are you sure?"
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
        confirmType="danger"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}

export function DialogControlledDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="space-y-2">
      <button className="btn btn-secondary btn-md" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog
        title="Update Settings"
        confirmText="Apply changes?"
        confirmButtonText="Apply"
        cancelButtonText="Cancel"
        confirmType="primary"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          setTimeout(() => setOpen(false), 300)
        }}
      />
    </div>
  )
}

export function DialogVariantsDemo() {
  const [dangerOpen, setDangerOpen] = React.useState(false)
  const [primaryOpen, setPrimaryOpen] = React.useState(false)
  const [neutralOpen, setNeutralOpen] = React.useState(false)
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button className="btn btn-danger btn-md" onClick={() => setDangerOpen(true)}>Danger</button>
        <button className="btn btn-primary btn-md" onClick={() => setPrimaryOpen(true)}>Primary</button>
        <button className="btn btn-secondary btn-md" onClick={() => setNeutralOpen(true)}>Neutral</button>
      </div>

      <Dialog
        title="Delete Item"
        confirmText="This action cannot be undone."
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        confirmType="danger"
        open={dangerOpen}
        onOpenChange={setDangerOpen}
      />

      <Dialog
        title="Publish"
        confirmText="Publish this document?"
        confirmButtonText="Publish"
        cancelButtonText="Cancel"
        confirmType="primary"
        open={primaryOpen}
        onOpenChange={setPrimaryOpen}
      />

      <Dialog
        title="Proceed"
        confirmText="Continue to the next step?"
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
        confirmType="neutral"
        open={neutralOpen}
        onOpenChange={setNeutralOpen}
      />
    </div>
  )
}


