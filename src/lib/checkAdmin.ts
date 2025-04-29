import { createBrowserClient } from '@supabase/ssr'

export async function checkAdminStatus(userEmail: string): Promise<boolean> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', userEmail)
      .single()

    return profile?.role === 'admin'
  } catch (error) {
    console.error('Erreur lors de la vérification du statut admin:', error)
    throw error
  }
} 