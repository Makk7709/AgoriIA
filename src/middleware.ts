import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sessionCache, profileCache } from '@/lib/cache'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ['/admin', '/api/analyze', '/api/pdf']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    // Vérifier le cache pour la session
    const sessionKey = req.headers.get('authorization') || 'no-auth'
    let session = sessionCache.get(sessionKey)

    if (!session) {
      // Si pas en cache, vérifier la session
      const { data: { session: newSession } } = await supabase.auth.getSession()
      session = newSession
      if (session) {
        sessionCache.set(sessionKey, session)
      }
    }

    if (!session) {
      // Rediriger vers la page de connexion si non authentifié
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Pour les routes admin, vérifier le rôle
    if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')) {
      // Vérifier le cache pour le profil
      let profile = profileCache.get(session.user.id)

      if (!profile) {
        // Si pas en cache, récupérer le profil
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        profile = newProfile
        if (profile) {
          profileCache.set(session.user.id, profile)
        }
      }

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/analyze/:path*',
    '/api/pdf/:path*',
    '/api/admin/:path*'
  ]
} 