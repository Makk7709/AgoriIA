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
  const data = await getThemeWithPositions(themeId)

  if (!data) {
    return {
      title: 'Thème non trouvé',
      description: 'Le thème demandé n\'existe pas.'
    }
  }

  return {
    title: data.theme.name,
    description: data.theme.description || `Positions politiques sur le thème ${data.theme.name}`
  }
}

export default async function ThemePage({ params }: ThemePageProps) {
  const themeId = params.theme

  // Basic ID validation
  if (!themeId || typeof themeId !== 'string') {
    notFound()
  }

  const data = await getThemeWithPositions(themeId)

  if (!data) {
    notFound()
  }

  return <ThemeContent theme={data.theme} positions={data.positions} />
} 