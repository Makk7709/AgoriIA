import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Vérifier la session
    const { data: { session } } = await supabase.auth.getSession()

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route admin
    if (!session && req.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Si l'utilisateur est connecté, vérifier son rôle
    if (session && req.nextUrl.pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      // Si l'utilisateur n'est pas admin, rediriger vers la page d'accueil
      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  } catch (error) {
    console.error('Erreur middleware:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
} 