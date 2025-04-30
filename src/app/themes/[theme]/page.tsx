import { Metadata } from 'next'
import { getThemeWithPositions } from '@/lib/supabase/getThemeWithPositions'
import { ThemeContent } from '@/components/themes/ThemeContent'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

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
      title: 'Thème non trouvé - Korev AI',
      description: 'Le thème que vous recherchez n\'existe pas.',
    }
  }

  return {
    title: `${data.theme.name} - Korev AI`,
    description: data.theme.description || `Découvrez les positions des candidats sur ${data.theme.name}`,
  }
}

async function ThemePageContent({ themeId }: { themeId: string }) {
  const data = await getThemeWithPositions(themeId)

  if (!data) {
    notFound()
  }

  return <ThemeContent theme={data.theme} positions={data.positions} />
}

export default async function ThemePage({ params }: ThemePageProps) {
  const themeId = params.theme

  // Basic ID validation
  if (!themeId || typeof themeId !== 'string') {
    notFound()
  }

  return (
    <Suspense fallback={<div>Chargement du thème...</div>}>
      <ThemePageContent themeId={themeId} />
    </Suspense>
  )
} 