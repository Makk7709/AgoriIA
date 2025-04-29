import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsAuthenticated(false)
        setIsAdmin(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setIsAuthenticated(true)
      setIsAdmin(profile?.role === 'admin')
    } catch (error) {
      console.error('Erreur lors de la vérification du statut admin:', error)
      setIsAuthenticated(false)
      setIsAdmin(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [])

  return {
    isLoading,
    isAuthenticated,
    isAdmin,
    checkAdminStatus
  }
} 