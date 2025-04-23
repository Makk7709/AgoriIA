import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Gestion des Programmes - Agoria',
  description: 'Gestion des programmes PDF par thème'
}

export default async function ProgramsPage() {
  const supabase = createSupabaseServerClient()
  
  // Vérifier si l'utilisateur est connecté et a les droits d'admin
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login?redirect=/admin')
  }

  // Vérifier si l'utilisateur a le rôle admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Récupérer tous les thèmes
  const { data: themes } = await supabase
    .from('themes')
    .select('*')
    .order('name')

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Programmes</h1>
        <a
          href="/admin"
          className="text-blue-600 hover:text-blue-800"
        >
          Retour au dashboard
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {themes?.map((theme) => (
          <a
            key={theme.id}
            href={`/admin/themes/${theme.id}/programs`}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{theme.name}</h2>
            <p className="text-gray-600">{theme.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
} 