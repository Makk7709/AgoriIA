import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte',
}

interface LoginPageProps {
  searchParams?: { redirect?: string }
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  // Création du client Supabase (synchrone car cookies() est synchrone)
  const supabase = createSupabaseServerClient()

  // Vérification sécurisée de l'utilisateur avec await du client
  const { data: { user } } = await (await supabase).auth.getUser()

  // Si l'utilisateur est connecté, on vérifie son rôle et on redirige
  if (user) {
    const { data: profile } = await (await supabase)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Redirection basée sur le rôle (admin → /admin, sinon → searchParams.redirect ou /)
    if (profile?.role === 'admin') {
      redirect('/admin')
    }
    
    redirect(searchParams?.redirect || '/')
  }

  // Si non connecté, affichage du formulaire
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="mt-2 text-sm text-gray-600">
            "La créativité, c'est l'intelligence qui s'amuse." - Albert Einstein
          </p>
        </div>

        <LoginForm redirect={searchParams?.redirect} />

        <div className="text-center text-sm text-gray-500">
          <p>Agoria - Votre partenaire créatif</p>
        </div>
      </div>
    </div>
  )
} 