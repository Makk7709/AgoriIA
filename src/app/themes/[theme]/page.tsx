import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/config'
import { ComparisonGrid } from '@/components/ComparisonGrid'

// Types
interface ThemePageProps {
  params: {
    theme: string // ID du thème depuis l'URL
  }
}

interface Theme {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface Position {
  id: string
  theme_id: string
  candidate_id: string
  content: string
  source_url: string | null
  created_at: string
  candidate: {
    name: string
    party: string
  }
}

interface ThemeWithPositions {
  theme: Theme
  positions: Position[]
}

async function getThemeWithPositions(themeId: string): Promise<ThemeWithPositions | null> {
  // Récupérer les informations du thème
  const { data: theme, error: themeError } = await supabase
    .from('themes')
    .select('*')
    .eq('id', themeId)
    .single()

  if (themeError) {
    console.error('Erreur lors de la récupération du thème:', themeError)
    return null
  }

  // Récupérer les positions avec les informations des candidats
  const { data: positions, error: positionsError } = await supabase
    .from('positions')
    .select(`
      *,
      candidate:candidates (
        name,
        party
      )
    `)
    .eq('theme_id', themeId)

  if (positionsError) {
    console.error('Erreur lors de la récupération des positions:', positionsError)
    return null
  }

  return {
    theme,
    positions: positions || [],
  }
}

export default async function ThemePage({ params }: ThemePageProps) {
  const themeId = params.theme

  // Validation basique de l'ID
  if (!themeId || typeof themeId !== 'string') {
    notFound()
  }

  // Récupérer les données
  const data = await getThemeWithPositions(themeId)

  // Si aucune donnée n'est trouvée, afficher la page 404
  if (!data) {
    notFound()
  }

  const { theme, positions } = data

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {theme.name}
        </h1>
        {theme.description && (
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {theme.description}
          </p>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Positions des candidats ({positions.length})
        </h2>
        {positions.length > 0 ? (
          <ComparisonGrid positions={positions} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Aucune position n&apos;a encore été enregistrée pour ce thème.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 