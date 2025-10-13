import React from 'react'
import FormCard from '@/components/FormCard'

export function FormCardBasicDemo() {
  return (
    <FormCard title="Welcome" subtitle="This is a centered card">
      <p>Nội dung thường không phải form, ví dụ hướng dẫn.</p>
      <a href="#" className="btn btn-secondary btn-sm">Explore</a>
    </FormCard>
  )
}

export function FormCardWithFormDemo() {
  return (
    <FormCard title="Đăng nhập" subtitle="Chào mừng trở lại" action="/login" method="POST">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input type="email" className="mt-1 block w-full border rounded-md px-3 py-2" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
          <input type="password" className="mt-1 block w-full border rounded-md px-3 py-2" />
        </label>
      </div>
      <button className="btn btn-primary btn-md w-full">Đăng nhập</button>
    </FormCard>
  )
}


