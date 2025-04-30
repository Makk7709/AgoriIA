import { createClient } from '@supabase/supabase-js';
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { Suspense } from 'react'

interface Theme {
  id: string
  name: string
  description: string | null
  created_at: string
}

async function getThemes() {
  console.log('Fetching themes...');
  
  // Créer un client Supabase avec le rôle de service
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  // Récupérer tous les thèmes
  const { data: themes, error: themesError } = await supabaseAdmin
    .from('themes')
    .select('*')
    .order('name');

  if (themesError) {
    console.error('Error fetching themes:', themesError);
    return [];
  }

  console.log('All themes:', themes);
  return themes as Theme[];
}

function ThemesList({ themes }: { themes: Theme[] }) {
  return (
    <div className="mt-16 grid gap-6 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
      {themes && themes.length > 0 ? (
        themes.map((theme) => {
          console.log('Rendering theme:', theme);
          return (
            <div
              key={theme.id}
              className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-[#002654]/10 hover:border-[#002654]/30 transition-all group"
            >
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div className="flex-1">
                  <Link href={`/themes/${theme.id}`} className="block">
                    <p className="text-2xl font-semibold font-serif text-[#002654] group-hover:text-[#002654] transition-colors">
                      {theme.name}
                    </p>
                    {theme.description && (
                      <p className="mt-4 text-lg text-[#002654]/70 font-serif">
                        {theme.description}
                      </p>
                    )}
                  </Link>
                </div>
                <div className="mt-8">
                  <Link
                    href={`/themes/${theme.id}`}
                    className="inline-flex items-center px-6 py-3 text-base font-medium font-serif rounded-xl shadow-md text-white bg-gradient-to-r from-[#002654] to-[#EF4135] hover:from-[#001b3b] hover:to-[#d93a2f] transition-all"
                  >
                    Explorer
                    <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center col-span-3">
          <p className="text-xl text-[#002654]/60 font-serif">Aucun thème disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Thèmes - Korev AI',
  description: 'Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent.',
  openGraph: {
    title: 'Thèmes - Korev AI',
    description: 'Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Korev AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thèmes - Korev AI',
    description: 'Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent.',
  },
}

export default async function ThemesPage() {
  const themes = await getThemes();
  console.log('Themes to render:', themes);

  return (
    <>
      <StructuredData
        type="WebPage"
        name="Thèmes - Korev AI"
        description="Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent."
        url="https://agoria.app/themes"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-serif tracking-tight text-[#002654] sm:text-5xl">
            Explorez les thèmes
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[#002654]/80 font-serif sm:mt-6">
            Découvrez les positions des candidats sur les sujets qui vous importent
          </p>
        </div>

        <Suspense fallback={<div>Chargement des thèmes...</div>}>
          <ThemesList themes={themes} />
        </Suspense>
      </div>
    </>
  );
} 