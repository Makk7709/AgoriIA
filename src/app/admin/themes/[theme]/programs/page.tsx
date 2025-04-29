import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProgramUpload } from '@/components/admin/ProgramUpload'
import { ProgramList } from '@/components/admin/ProgramList'

export const metadata: Metadata = {
  title: 'Gestion des Programmes - Agoria',
  description: 'Gestion des programmes PDF par thème'
}

type Props = {
  params: { theme: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function ThemeProgramsPage({ params, searchParams }: Props) {
  const supabase = await createSupabaseServerClient()
  
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

  // Récupérer les informations du thème
  const { data: theme } = await supabase
    .from('themes')
    .select('*')
    .eq('id', params.theme)
    .single()

  if (!theme) {
    redirect('/admin/themes')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Programmes - {theme.name}</h1>
          <p className="text-gray-600 mt-2">{theme.description}</p>
        </div>
        <a
          href="/admin/themes"
          className="text-blue-600 hover:text-blue-800"
        >
          Retour aux thèmes
        </a>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ajouter un programme</h2>
          <ProgramUpload themeId={params.theme} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Programmes existants</h2>
          <ProgramList themeId={params.theme} />
        </div>
      </div>
    </div>
  )
} 