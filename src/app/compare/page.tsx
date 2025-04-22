import { supabase } from '@/lib/supabase/config'
import { analyzePosition } from '@/lib/openai/config'
import { formatDate } from '@/lib/utils'

interface Theme {
  id: string
  name: string
}

interface Candidate {
  id: string
  name: string
  party: string
}

interface Position {
  id: string
  theme_id: string
  candidate_id: string
  content: string
  source_url: string | null
  created_at: string
}

interface PositionWithAnalysis extends Position {
  analysis: {
    summary: string
    keyPoints: string[]
    alignment: number
    confidence: number
  }
}

async function getThemesAndCandidates() {
  const [themesResponse, candidatesResponse] = await Promise.all([
    supabase.from('themes').select('id, name').order('name'),
    supabase.from('candidates').select('id, name, party').order('name'),
  ])

  return {
    themes: (themesResponse.data || []) as Theme[],
    candidates: (candidatesResponse.data || []) as Candidate[],
  }
}

async function getPositions(themeId: string, candidateIds: string[]) {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('theme_id', themeId)
    .in('candidate_id', candidateIds)

  if (error) {
    console.error('Error fetching positions:', error)
    return []
  }

  return data as Position[]
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { theme?: string; candidates?: string }
}) {
  const { themes, candidates } = await getThemesAndCandidates()
  
  let positions: Position[] = []
  let analysisResults: PositionWithAnalysis[] = []

  if (searchParams.theme && searchParams.candidates) {
    const selectedCandidates = searchParams.candidates.split(',')
    positions = await getPositions(searchParams.theme, selectedCandidates)

    // Analyser les positions avec l'IA
    const analysisPromises = positions.map(async (position) => {
      const analysis = await analyzePosition(position.content)
      return {
        ...position,
        analysis,
      }
    })

    analysisResults = await Promise.all(analysisPromises)
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Comparer les positions
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Sélectionnez un thème et des candidats pour comparer leurs positions
        </p>
      </div>

      <form className="mt-8 space-y-6" action="/compare" method="GET">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700"
            >
              Thème
            </label>
            <select
              id="theme"
              name="theme"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue={searchParams.theme || ''}
            >
              <option value="">Sélectionnez un thème</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="candidates"
              className="block text-sm font-medium text-gray-700"
            >
              Candidats à comparer
            </label>
            <select
              id="candidates"
              name="candidates"
              multiple
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue={searchParams.candidates?.split(',') || []}
            >
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} ({candidate.party})
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs candidats
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Comparer
          </button>
        </div>
      </form>

      {analysisResults.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Résultats de la comparaison</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {analysisResults.map((result) => {
              const candidate = candidates.find((c) => c.id === result.candidate_id)
              return (
                <div
                  key={result.id}
                  className="bg-white shadow overflow-hidden sm:rounded-lg"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {candidate?.name}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {candidate?.party}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="prose max-w-none">
                      <h4 className="text-base font-semibold text-gray-900">Position</h4>
                      <p className="mt-2 text-gray-600">{result.content}</p>

                      {result.source_url && (
                        <p className="mt-2 text-sm text-gray-500">
                          Source :{' '}
                          <a
                            href={result.source_url}
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
                          <p className="text-gray-600">{result.analysis.summary}</p>
                          <ul className="list-disc pl-5 text-gray-600">
                            {result.analysis.keyPoints.map((point: string, index: number) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Score d&apos;alignement :
                              </span>
                              <span className="ml-2 text-sm font-semibold text-gray-900">
                                {result.analysis.alignment}%
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                Confiance :
                              </span>
                              <span className="ml-2 text-sm font-semibold text-gray-900">
                                {result.analysis.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <p className="text-xs text-gray-500">
                      Dernière mise à jour : {formatDate(result.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 