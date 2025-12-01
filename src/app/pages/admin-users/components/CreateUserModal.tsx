import { useState, useMemo } from 'react'
import { Button } from '@/components/Button/Button'
import Offcanvas from '@/components/Offcanvas/Offcanvas'

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<void>
  isLoading: boolean
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}

function validateName(name: string): { valid: boolean; message?: string } {
  if (name.trim().length === 0) {
    return { valid: false, message: 'Name is required' }
  }
  if (/^\d+$/.test(name.trim())) {
    return { valid: false, message: 'Name cannot contain only numbers' }
  }
  return { valid: true }
}

export default function CreateUserModal({ open, onOpenChange, onSubmit, isLoading }: CreateUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  const nameValidation = useMemo(() => validateName(name), [name])
  const passwordValidation = useMemo(() => validatePassword(password), [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string; email?: string; password?: string } = {}

    if (!nameValidation.valid) {
      newErrors.name = nameValidation.message
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    try {
      await onSubmit(name.trim(), email.trim(), password, role)
      setName('')
      setEmail('')
      setPassword('')
      setRole('user')
    } catch {
      // Error handled by parent
    }
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('user')
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Offcanvas
      id="create-admin-user-offcanvas"
      title="Create new user"
      alignment="right"
      width="25"
      open={open}
      onOpenChange={handleClose}
      closeButton={true}
    >
      <form className="flex flex-col h-full min-h-0" onSubmit={handleSubmit} autoComplete="off">
        <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-name">
              User name <span className="text-red-500">*</span>
            </label>
            <input
              id="create-name"
              type="text"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-sm ${
                errors.name
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              value={name}
              onChange={e => {
                setName(e.target.value)
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }))
                }
              }}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="create-email"
              type="email"
              autoComplete="new-email"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-sm ${
                errors.email
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }))
                }
              }}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="create-password"
              type="password"
              autoComplete="new-password"
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-sm ${
                errors.password
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-700'
              }`}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: undefined }))
                }
              }}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
            {password && passwordValidation.valid && (
              <p className="text-sm text-green-600 dark:text-green-400">Password is valid</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-role">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="create-role"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm"
              value={role}
              onChange={e => setRole(e.target.value as 'user' | 'admin')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            isLoading={isLoading}
            value="Save"
          />
        </div>
      </form>
    </Offcanvas>
  )
}

