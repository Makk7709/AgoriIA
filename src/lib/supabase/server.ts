import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export async function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          try {
            const cookieStore = await cookies()
            const cookie = await cookieStore.get(name)
            return cookie?.value
          } catch (error) {
            console.error('Erreur lors de la lecture du cookie:', error)
            return null
          }
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies()
            const cookieOptions: ResponseCookie = {
              name,
              value,
              ...options,
            }
            await cookieStore.set(cookieOptions)
          } catch (error) {
            console.error('Erreur lors de la définition du cookie:', error)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies()
            const cookieOptions: ResponseCookie = {
              name,
              value: '',
              ...options,
              maxAge: 0,
            }
            await cookieStore.set(cookieOptions)
          } catch (error) {
            console.error('Erreur lors de la suppression du cookie:', error)
          }
        },
      },
    }
  )
} 