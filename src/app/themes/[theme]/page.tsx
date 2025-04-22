import { Metadata } from 'next'
import { getThemeWithPositions } from '@/lib/supabase/getThemeWithPositions'
import { ThemeContent } from '@/components/themes/ThemeContent'
import { notFound } from 'next/navigation'

interface ThemePageProps {
  params: {
    theme: string
  }
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const themeId = params.theme

  // Basic ID validation
  if (!themeId || typeof themeId !== 'string') {
    notFound()
  }

  // Get data
  const data = await getThemeWithPositions(themeId)

  // Show 404 if no data found
  if (!data) {
    notFound()
  }

  return {
    title: `${data.theme.name} - AgorIA`,
    description: data.theme.description || `Découvrez les positions des candidats sur ${data.theme.name}`,
    viewport: {
      width: 'device-width',
      initialScale: 1
    }
  }
}

export default async function ThemePage({ params }: ThemePageProps) {
  const themeId = params.theme

  // Basic ID validation
  if (!themeId || typeof themeId !== 'string') {
    notFound()
  }

  // Get data
  const data = await getThemeWithPositions(themeId)

  // Show 404 if no data found
  if (!data) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ThemeContent theme={data.theme} positions={data.positions} />
    </main>
  )
} 