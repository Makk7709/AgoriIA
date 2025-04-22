import { supabase } from '@/lib/supabase/config'
import { analyzePosition } from '@/lib/openai/config'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

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
  candidates: {
    name: string
    party: string
  }
}

async function getThemeWithPositions(id: string) {
  const { data: theme, error: themeError } = await supabase
    .from('themes')
    .select('*')
    .eq('id', id)
    .single()

  if (themeError) {
    console.error('Error fetching theme:', themeError)
    return null
  }

  const { data: positions, error: positionsError } = await supabase
    .from('positions')
    .select(`
      *,
      candidates (
        name,
        party
      )
    `)
    .eq('theme_id', id)

  if (positionsError) {
    console.error('Error fetching positions:', positionsError)
    return null
  }

  return {
    theme,
    positions,
  }
}

export default async function ThemePage({ params }: { params: { id: string } }) {
  const data = await getThemeWithPositions(params.id)

  if (!data) {
    notFound()
  }

  const { theme, positions } = data

  // Analyser les positions avec l'IA
  const analysisPromises = positions.map(async (position) => {
    const analysis = await analyzePosition(position.content)
    return {
      ...position,
      analysis,
    }
  })

  const positionsWithAnalysis = await Promise.all(analysisPromises)

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

      <div className="mt-12 space-y-16">
        {positionsWithAnalysis.map((position) => (
          <div
            key={position.id}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {position.candidates.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {position.candidates.party}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="prose max-w-none">
                <h4 className="text-base font-semibold text-gray-900">Position</h4>
                <p className="mt-2 text-gray-600">{position.content}</p>

                {position.source_url && (
                  <p className="mt-2 text-sm text-gray-500">
                    Source :{' '}
                    <a
                      href={position.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Lien
                    </a>
                  </p>
                )}

                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-900">
                    Analyse IA
                  </h4>
                  <div className="mt-2 space-y-4">
                    <p className="text-gray-600">{position.analysis.summary}</p>
                    <ul className="list-disc pl-5 text-gray-600">
                      {position.analysis.keyPoints.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Score d&apos;alignement :
                        </span>
                        <span className="ml-2 text-sm font-semibold text-gray-900">
                          {position.analysis.alignment}%
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Confiance :
                        </span>
                        <span className="ml-2 text-sm font-semibold text-gray-900">
                          {position.analysis.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <p className="text-xs text-gray-500">
                Dernière mise à jour : {formatDate(position.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 