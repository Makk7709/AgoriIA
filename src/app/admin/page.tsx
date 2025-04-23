import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Administration - Agoria',
  description: 'Interface d\'administration d\'Agoria'
}

export default async function AdminPage() {
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <a href="/admin/themes" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Gestion des thèmes</h2>
          <p className="text-gray-600">Gérer les thèmes et leurs positions</p>
        </a>
        
        <a href="/admin/candidates" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Gestion des candidats</h2>
          <p className="text-gray-600">Gérer les candidats et leurs informations</p>
        </a>
        
        <a href="/admin/users" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Gestion des utilisateurs</h2>
          <p className="text-gray-600">Gérer les utilisateurs et leurs rôles</p>
        </a>

        <a href="/admin/programs" className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Gestion des programmes</h2>
          <p className="text-gray-600">Gérer les programmes PDF par thème</p>
        </a>
      </div>
    </div>
  )
} 