import { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface User {
  id: string
  email: string
  role: string
  created_at: string
}

export const metadata: Metadata = {
  title: 'Gestion des Utilisateurs - Agoria',
  description: 'Gestion des utilisateurs et leurs rôles'
}

export default async function UsersPage() {
  const supabase = await createSupabaseServerClient()
  
  // Récupérer tous les utilisateurs
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('email')

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <a
          href="/admin"
          className="text-blue-600 hover:text-blue-800"
        >
          Retour au dashboard
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user: User) => (
          <div
            key={user.id}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{user.email}</h2>
            <p className="text-gray-600 mb-2">Rôle: {user.role}</p>
            <p className="text-gray-600">
              Créé le {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 