import { supabase } from '@/lib/supabase/config'
import { analyzePosition } from '@/lib/openai/config'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

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

type Props = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Comparer - Korev AI',
  description: 'Comparez les positions des candidats sur différents thèmes politiques et obtenez une analyse objective grâce à l\'IA.',
  openGraph: {
    title: 'Comparer - Korev AI',
    description: 'Comparez les positions des candidats sur différents thèmes politiques et obtenez une analyse objective grâce à l\'IA.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Korev AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comparer - Korev AI',
    description: 'Comparez les positions des candidats sur différents thèmes politiques et obtenez une analyse objective grâce à l\'IA.',
  },
};

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams
  const theme = params.theme as string | undefined
  const candidates = params.candidates as string | undefined

  const { themes, candidates: allCandidates } = await getThemesAndCandidates()
  
  let positions: Position[] = []
  let analysisResults: PositionWithAnalysis[] = []

  if (theme && candidates) {
    const selectedCandidates = candidates.split(',')
    positions = await getPositions(theme, selectedCandidates)

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
    <>
      <StructuredData
        type="WebPage"
        name="Comparer - Korev AI"
        description="Comparez les positions des candidats sur différents thèmes politiques et obtenez une analyse objective grâce à l'IA."
        url="https://agoria.app/compare"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-serif tracking-tight text-[#002654] sm:text-5xl">
            Comparer les positions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[#002654]/80 font-serif sm:mt-6">
            Sélectionnez un thème et des candidats pour comparer leurs positions
          </p>
        </div>

        <form className="mt-12 space-y-8" action="/compare" method="GET">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <label
                htmlFor="theme"
                className="block text-lg font-serif font-medium text-[#002654]"
              >
                Thème
              </label>
              <select
                id="theme"
                name="theme"
                className="mt-2 block w-full px-4 py-3 text-base font-serif border-2 border-[#002654]/20 focus:outline-none focus:ring-[#002654] focus:border-[#002654] rounded-xl bg-white/80 text-[#002654]"
                defaultValue={theme || ''}
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
                className="block text-lg font-serif font-medium text-[#002654]"
              >
                Candidats à comparer
              </label>
              <select
                id="candidates"
                name="candidates"
                multiple
                className="mt-2 block w-full px-4 py-3 text-base font-serif border-2 border-[#002654]/20 focus:outline-none focus:ring-[#002654] focus:border-[#002654] rounded-xl bg-white/80 text-[#002654]"
                defaultValue={candidates?.split(',') || []}
              >
                {allCandidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.party})
                  </option>
                ))}
              </select>
              <p className="mt-3 text-base text-[#002654]/60 font-serif">
                Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs candidats
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 text-lg font-medium font-serif rounded-xl shadow-md text-white bg-gradient-to-r from-[#002654] to-[#EF4135] hover:from-[#001b3b] hover:to-[#d93a2f] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002654]"
            >
              Comparer
            </button>
          </div>
        </form>

        {analysisResults.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold font-serif text-[#002654] mb-10 text-center">
              Résultats de la comparaison
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {analysisResults.map((result) => {
                const candidate = allCandidates.find((c) => c.id === result.candidate_id)
                return (
                  <div
                    key={result.id}
                    className="bg-white/80 backdrop-blur-sm shadow-lg border-2 border-[#002654]/10 overflow-hidden rounded-xl transition-all hover:border-[#002654]/30"
                  >
                    <div className="px-8 py-6 border-b border-[#002654]/10">
                      <h3 className="text-2xl font-serif font-semibold text-[#002654]">
                        {candidate?.name}
                      </h3>
                      <p className="mt-2 text-lg text-[#002654]/70 font-serif">
                        {candidate?.party}
                      </p>
                    </div>
                    <div className="px-8 py-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-serif font-medium text-[#002654]">Position</h4>
                          <p className="mt-2 text-base text-[#002654]/80 font-serif">{result.content}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-serif font-medium text-[#002654]">Analyse</h4>
                          <p className="mt-2 text-base text-[#002654]/80 font-serif">{result.analysis.summary}</p>
                          <ul className="mt-4 space-y-2">
                            {result.analysis.keyPoints.map((point, index) => (
                              <li key={index} className="text-base text-[#002654]/70 font-serif">
                                • {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {result.source_url && (
                          <div>
                            <h4 className="text-lg font-serif font-medium text-[#002654]">Source</h4>
                            <a
                              href={result.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-base text-[#002654] hover:text-[#EF4135] font-serif underline transition-colors"
                            >
                              Voir la source
                            </a>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-[#002654]/60 font-serif">
                            Dernière mise à jour : {formatDate(result.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
} 