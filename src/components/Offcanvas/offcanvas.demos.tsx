import React from 'react'
import Offcanvas from '@/components/Offcanvas'
import { Button } from '@/components/Button'

export function OffcanvasRightDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Right (50%)</Button>
      <Offcanvas alignment="right" width="50" title="Right Panel" closeButton open={open} onOpenChange={setOpen}>
        <p className="text-sm text-gray-700">Nội dung panel bên phải.</p>
      </Offcanvas>
    </div>
  )
}

export function OffcanvasLeftNarrowDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open Left (25%)</Button>
      <Offcanvas alignment="left" width="25" title="Left Panel" closeButton={{ position: 'left' }} open={open} onOpenChange={setOpen}>
        <p className="text-sm text-gray-700">Nội dung panel bên trái.</p>
      </Offcanvas>
    </div>
  )
}

export function OffcanvasTopFullDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open Top (100%)</Button>
      <Offcanvas alignment="top" width="100" title="Top Panel" closeButton open={open} onOpenChange={setOpen}>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">Chiều rộng full, phủ toàn màn hình theo chiều dọc.</p>
          <p className="text-sm text-gray-700">Dùng cho form dài hoặc wizard.</p>
        </div>
      </Offcanvas>
    </div>
  )
}


