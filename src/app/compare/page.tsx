import { supabase } from '@/lib/supabase/config'
import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { ComparisonView } from '@/components/ComparisonView'
import type { Theme, Position, Candidate } from '@/lib/types'

type Props = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getThemesAndCandidates() {
  console.log('Fetching themes and candidates...');
  
  // Créer un client Supabase avec le rôle de service
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const [themesResponse, candidatesResponse] = await Promise.all([
    supabaseAdmin.from('themes').select('*').order('name'),
    supabaseAdmin.from('candidates').select('*').order('name'),
  ])

  console.log('Themes response:', themesResponse);
  console.log('Candidates response:', candidatesResponse);

  if (themesResponse.error) {
    console.error('Error fetching themes:', themesResponse.error);
  }

  if (candidatesResponse.error) {
    console.error('Error fetching candidates:', candidatesResponse.error);
  }

  const result = {
    themes: (themesResponse.data || []) as Theme[],
    candidates: (candidatesResponse.data || []) as Candidate[],
  }

  console.log('Final result:', result);
  return result;
}

async function getPositions(themeId: string, candidateIds: string[]) {
  console.log('Fetching positions with:', { themeId, candidateIds });
  
  const { data, error } = await supabase
    .from('positions')
    .select(`
      id,
      theme_id,
      candidate_id,
      content,
      source_url,
      created_at,
      title,
      description,
      candidate:candidates (
        id,
        name,
        party
      )
    `)
    .eq('theme_id', themeId)
    .in('candidate_id', candidateIds);

  console.log('Raw response:', { data, error });

  if (error) {
    console.error('Error fetching positions:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('No positions found for the given theme and candidates');
    return [];
  }

  // Transform the data to match the Position type
  const transformedData = data.map(position => ({
    ...position,
    candidate: position.candidate[0] // Take the first candidate from the array
  }));

  console.log('Transformed positions:', transformedData);
  return transformedData as Position[];
}

export const metadata: Metadata = {
  title: 'Comparer - Korev AI',
  description: 'Comparez les positions des candidats sur différents thèmes politiques.',
  openGraph: {
    title: 'Comparer - Korev AI',
    description: 'Comparez les positions des candidats sur différents thèmes politiques.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Korev AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comparer - Korev AI',
    description: 'Comparez les positions des candidats sur différents thèmes politiques.',
  },
}

export default async function ComparePage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams)
  const theme = params.theme as string | undefined
  const candidates = params.candidates

  const { themes, candidates: allCandidates } = await getThemesAndCandidates()
  
  let positions: Position[] = []
  let selectedTheme: Theme | undefined

  if (theme && candidates) {
    const selectedCandidates = Array.isArray(candidates) ? candidates : [candidates]
    console.log('Selected candidates:', selectedCandidates)
    
    positions = await getPositions(theme, selectedCandidates)
    selectedTheme = themes.find(t => t.id === theme)
    console.log('Selected theme:', selectedTheme)
    console.log('Positions for comparison:', positions)
  }

  return (
    <>
      <StructuredData
        type="WebPage"
        name="Comparer - Korev AI"
        description="Comparez les positions des candidats sur différents thèmes politiques."
        url="https://agoria.app/compare"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      
      {selectedTheme && positions.length > 0 ? (
        <ComparisonView
          theme={selectedTheme}
          positions={positions}
          candidates={allCandidates}
        />
      ) : (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-serif tracking-tight text-[#002654] sm:text-5xl">
              Comparer les positions
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-[#002654]/80 font-serif sm:mt-6">
              Sélectionnez un thème et des candidats pour comparer leurs positions
            </p>
          </div>

          <form className="mt-12 max-w-4xl mx-auto" action="/compare" method="GET">
            <div className="space-y-8">
              {/* Sélection du thème */}
              <div className="relative">
                <label
                  htmlFor="theme"
                  className="block text-xl font-serif font-medium text-[#002654] mb-3"
                >
                  Sur quel thème souhaitez-vous comparer ?
                </label>
                <div className="relative group">
                  <select
                    id="theme"
                    name="theme"
                    className="block w-full px-6 py-4 text-lg font-serif border-2 border-[#002654]/20 focus:outline-none focus:ring-2 focus:ring-[#002654] focus:border-[#002654] rounded-2xl bg-white/90 text-[#002654] appearance-none transition-all hover:border-[#002654]/40"
                    defaultValue={theme || ''}
                  >
                    <option value="">Choisissez un thème</option>
                    {themes && themes.map((theme) => (
                      <option key={theme.id} value={theme.id} className="py-2">
                        {theme.name} - {theme.description}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#002654]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sélection des candidats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Premier candidat */}
                <div className="relative">
                  <label
                    htmlFor="candidate1"
                    className="block text-xl font-serif font-medium text-[#002654] mb-3"
                  >
                    Premier candidat
                  </label>
                  <div className="relative">
                    <select
                      id="candidate1"
                      name="candidates"
                      className="block w-full px-6 py-4 text-lg font-serif border-2 border-[#002654]/20 focus:outline-none focus:ring-2 focus:ring-[#002654] focus:border-[#002654] rounded-2xl bg-white/90 text-[#002654] appearance-none transition-all hover:border-[#002654]/40"
                      required
                    >
                      <option value="">Choisissez un candidat</option>
                      {allCandidates && allCandidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} ({candidate.party})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#002654]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Second candidat */}
                <div className="relative">
                  <label
                    htmlFor="candidate2"
                    className="block text-xl font-serif font-medium text-[#002654] mb-3"
                  >
                    Second candidat
                  </label>
                  <div className="relative">
                    <select
                      id="candidate2"
                      name="candidates"
                      className="block w-full px-6 py-4 text-lg font-serif border-2 border-[#002654]/20 focus:outline-none focus:ring-2 focus:ring-[#002654] focus:border-[#002654] rounded-2xl bg-white/90 text-[#002654] appearance-none transition-all hover:border-[#002654]/40"
                      required
                    >
                      <option value="">Choisissez un candidat</option>
                      {allCandidates && allCandidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} ({candidate.party})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#002654]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="inline-flex items-center px-12 py-5 text-xl font-medium font-serif rounded-2xl shadow-lg text-white bg-gradient-to-r from-[#002654] to-[#EF4135] hover:from-[#001b3b] hover:to-[#d93a2f] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002654] transform hover:scale-105"
                >
                  <span>Comparer</span>
                  <svg className="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
} 