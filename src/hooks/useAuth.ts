import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setUser(null)
          return
        }

        setUser({ email: session.user.email! })
      } catch (error) {
        console.error('Erreur lors de la vérification du statut auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  return {
    user,
    loading
  }
} 