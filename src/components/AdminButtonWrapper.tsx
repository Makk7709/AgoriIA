"use client"

import { useEffect, useState } from 'react'
import { AdminButton } from './AdminButton'

export default function AdminButtonWrapper() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <AdminButton />
} 