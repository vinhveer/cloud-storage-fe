import React from 'react'
import { useRouter } from '@tanstack/react-router'

export default function RedirectToHome() {
  const router = useRouter()
  React.useEffect(() => {
    router.navigate({ to: '/' })
  }, [router])
  return null
}