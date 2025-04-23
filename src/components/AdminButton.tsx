'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AdminButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    >
      <Link href="/admin">
        Administration
      </Link>
    </Button>
  )
} 