import { supabase } from '@/lib/supabase/config'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'

interface Theme {
  id: string
  name: string
  description: string | null
  created_at: string
}

async function getThemes() {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching themes:', error)
    return []
  }

  return data as Theme[]
}

export const metadata: Metadata = {
  title: 'Thèmes - AgorIA',
  description: 'Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent.',
  openGraph: {
    title: 'Thèmes - AgorIA',
    description: 'Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AgorIA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thèmes - AgorIA',
    description: 'Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent.',
  },
}

export default async function ThemesPage() {
  const themes = await getThemes()

  return (
    <>
      <StructuredData
        type="WebPage"
        name="Thèmes - AgorIA"
        description="Explorez les différents thèmes politiques et comparez les positions des candidats sur les sujets qui vous intéressent."
        url="https://agoria.app/themes"
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
      />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explorez les thèmes
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Découvrez les positions des candidats sur les sujets qui vous importent
          </p>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {themes.length > 0 ? (
            themes.map((theme) => (
              <div
                key={theme.id}
                className="flex flex-col rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link href={`/themes/${theme.id}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{theme.name}</p>
                      {theme.description && (
                        <p className="mt-3 text-base text-gray-500">{theme.description}</p>
                      )}
                    </Link>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/themes/${theme.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Explorer
                      <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-3">
              <p className="text-gray-500">Aucun thème disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 