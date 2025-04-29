import { createSupabaseServerClient } from './supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'admin' | 'user'

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  return {
    ...session.user,
    role: profile?.role as UserRole || 'user'
  }
}

export async function requireAuth(redirectTo: string = '/login') {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(redirectTo)
  }
  
  return user
}

export async function requireAdmin(redirectTo: string = '/') {
  const user = await requireAuth()
  
  if (user.role !== 'admin') {
    redirect(redirectTo)
  }
  
  return user
}

export function isAdmin(user: { role?: UserRole } | null) {
  return user?.role === 'admin'
} 