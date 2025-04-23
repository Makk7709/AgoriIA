import { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface Candidate {
  id: string
  name: string
  party: string
  description: string
}

export const metadata: Metadata = {
  title: 'Gestion des Candidats - Agoria',
  description: 'Gestion des candidats et leurs informations'
}

export default async function CandidatesPage() {
  const supabase = await createSupabaseServerClient()
  
  // Récupérer tous les candidats
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('name')

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Candidats</h1>
        <a
          href="/admin"
          className="text-blue-600 hover:text-blue-800"
        >
          Retour au dashboard
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates?.map((candidate: Candidate) => (
          <div
            key={candidate.id}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{candidate.name}</h2>
            <p className="text-gray-600 mb-2">{candidate.party}</p>
            <p className="text-gray-600">{candidate.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 