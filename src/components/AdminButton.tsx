'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

export function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
            
          setIsAdmin(profile?.role === 'admin')
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut admin:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  if (loading) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    >
      <Link href={isAdmin ? "/admin" : "/login?redirect=/admin"}>
        Administration
      </Link>
    </Button>
  )
} 